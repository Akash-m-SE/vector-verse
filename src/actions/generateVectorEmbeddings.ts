import prisma from "@/lib/prisma";
require("@tensorflow/tfjs");
const use = require("@tensorflow-models/universal-sentence-encoder");
import pgvector from "pgvector";
import { createId } from "@paralleldrive/cuid2";

export async function generateVectorEmbeddings(
  text: string,
  projectId: string,
) {
  try {
    // Splitting the text into chunks
    const chunkSize = 500;
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }

    // console.log("Chunks = ", chunks);

    const model = await use.load();

    const embeddings = [];

    for (const chunk of chunks) {
      const chunkEmbeddings = await model.embed(chunk);
      embeddings.push(Array.from(chunkEmbeddings.dataSync()));
    }

    // console.log("Embeddings Array = ", embeddings);

    // console.log("Project id = ", projectId);

    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i];
      const vectorEmbedding = embeddings[i];

      if (!vectorEmbedding || vectorEmbedding.length === 0) {
        throw new Error(
          `Embedding array is empty or null for chunk: ${chunkText}`,
        );
      }

      const embedding = pgvector.toSql(vectorEmbedding);
      if (!embedding) {
        throw new Error(
          `pgvector.toSql returned null for embedding: ${vectorEmbedding}`,
        );
      }

      const id = createId();

      // console.log(`Chunk Text: ${chunkText} \n`);
      // console.log("Vector Embedding", vectorEmbedding);
      // console.log(`Embedding: ${embedding} \n`);
      // console.log(`Project ID: ${projectId} \n`);
      // console.log(`Database ID: ${id} \n`);

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

      // const response =
      //   await prisma.$executeRaw`INSERT INTO "VectorEmbedding" ("id", "chunkText", "embedding", "projectId", "createdAt", "updatedAt") VALUES (${id}, ${chunkText},  ${embedding}::vector, ${projectId}, ${new Date()}, ${new Date()})`;

      console.log("Response from database = ", response);

      console.log(`Chunk ${i + 1} pushed into the DB`);
    }

    console.log("Embeddings pushed to database successfully!");
  } catch (error) {
    console.error("Error while generating vector embeddings", error);
    throw new Error();
  }
}
