import prisma from "@/lib/prisma";
// require("@tensorflow/tfjs");
import "@tensorflow/tfjs";
import * as use from "@tensorflow-models/universal-sentence-encoder";
import pgvector from "pgvector";
import { createId } from "@paralleldrive/cuid2";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import * as tf from "@tensorflow/tfjs";

// Suppressing TensorFlow.js logs
tf.env().set("PROD", true);

// Text Cleanup for clean chunk text storage
function cleanText(text: string) {
  text = text.replace(/[\r\n]+/g, " ");
  text = text.replace(/\s+/g, " ");
  text = text.replace(/[^\w\s.,-]/g, "");
  text = text.replace(/----------------Page \d+ Break----------------/g, "");
  return text.trim();
}

export async function generateVectorEmbeddings(data: string) {
  try {
    const model = await use.load();

    const embeddedData = await model.embed(data);

    const embeddedDataArrayFormat = Array.from(embeddedData.arraySync()).flat();

    // console.log("Embedded Data = ", embeddedDataArrayFormat);

    return embeddedDataArrayFormat;
  } catch (error) {
    console.log("Error while generating vector embeddings", error);
    throw new Error();
  }
}

export async function generateVectorEmbeddingsAndStoreThemInDB(
  text: string,
  projectId: string,
) {
  try {
    // Converting the extracted text into document
    const doc = new Document({ pageContent: text });
    // console.log("Document Object from split function = ", doc);

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splits = await textSplitter.splitDocuments([doc]); //splitting the chunks
    console.log("Splits = ", splits);

    const chunks: string[] = [];

    splits.map((item: any) => {
      const extractedText = item.pageContent;
      const chunk = cleanText(extractedText); // cleaning up the chunk text

      // only pushing the chunk if it is not empty
      if (chunk.length > 0) {
        chunks.push(chunk);
      }
    });

    // console.log("Filtered CHunks = ", chunks);

    const embeddings = [];

    for (const chunk of chunks) {
      console.log("Generating Embeddings ......");
      const chunkEmbeddings = await generateVectorEmbeddings(chunk);

      embeddings.push(chunkEmbeddings);
    }

    // console.log("Chunk Array = ", chunks);
    // console.log("Embeddings Array = ", embeddings);

    // Looping throught the chunk and embedding array and storing them in database
    for (let i = 0; i < chunks.length; i++) {
      const chunkText: string = chunks[i];
      const vectorEmbedding: any = embeddings[i];

      if (!vectorEmbedding || vectorEmbedding.length === 0) {
        throw new Error(
          `Embedding array is empty or null for chunk: ${chunkText}`,
        );
      }

      const embedding = pgvector.toSql(vectorEmbedding.flat());
      if (!embedding) {
        throw new Error(
          `pgvector.toSql returned null for embedding: ${vectorEmbedding}`,
        );
      }

      const id = createId();

      const query = `
        INSERT INTO "VectorEmbedding" ("id", "chunkText", "embedding", "projectId", "createdAt", "updatedAt") VALUES ($1, $2, $3::vector, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

      // console.log(
      //   `Running query: ${query} with values:`,
      //   id,
      //   chunkText,
      //   embedding,
      //   projectId
      // );

      const response = await prisma.$executeRawUnsafe(
        query,
        id,
        chunkText,
        embedding,
        projectId,
      );

      console.log("Response from database = ", response);

      console.log(`Chunk ${i + 1} pushed into the DB`);
    }

    if (chunks.length === 0 || embeddings.length === 0) {
      throw new Error("Cannot push empty chunks or embeddings to the database");
    } else {
      console.log("Embeddings pushed to database successfully!");
    }
  } catch (error) {
    console.error("Error while generating vector embeddings", error);
    throw new Error();
  }
}
