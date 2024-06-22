import { generateVectorEmbeddings } from "@/actions/vectorEmbeddings";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    const project = await prisma.project.findUnique({
      where: {
        id: id,
      },
    });

    // console.log("Project Details = ", project);

    return NextResponse.json(
      {
        project: project,
        projectId: id,
        message: "Successfully fetched your project",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong while fetching your project." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    // console.log("Id = ", id);

    const body = await request.json();

    const { question } = body;
    console.log("Question = ", question);

    //TODO :- change question into embedding get the nearest embeddings from database and send both of the embeddings to llm to get the answer
    const embeddedQuestion = await generateVectorEmbeddings(question);

    // console.log("Embedded Question = ", embeddedQuestion);

    //   const query = `
    //   SELECT "id", "chunkText", "embedding" <-> ${embeddedQuestion} AS distance
    //   FROM "VectorEmbedding"
    //   WHERE "projectId" = '${id}'
    //   ORDER BY distance ASC
    //   LIMIT 10;
    // `;

    // const similarEmbeddings = await prisma.$executeRawUnsafe(query);

    // console.log("Similar Embeddings = ", similarEmbeddings);

    // const embeddingStr = `ARRAY[${embeddedQuestion.join(", ")}]::vector`;
    // const embeddingStr = `'{${embeddedQuestion.join(",")}}'::vector`;

    // const similarVectors = await prisma.$executeRawUnsafe(`
    //   SELECT "id", "chunkText", "embedding" "<->" ${embeddedQuestion} AS distance
    //   FROM "VectorEmbedding"
    //   WHERE "projectId" = ${id}
    //   ORDER BY distance ASC
    //   LIMIT 10
    // `);

    // changing the embedded question to relevant sql accepted format
    const embeddingQuestionStr = `[${embeddedQuestion.join(",")}]`;

    // const similarVectors = await prisma.$queryRawUnsafe(
    //   `
    //   SELECT "id", "chunkText", "embedding" <-> $1::vector AS distance
    //   FROM "VectorEmbedding"
    //   WHERE "projectId" = $2
    //   ORDER BY distance ASC
    //   LIMIT 10
    //   `,
    //   embeddingQuestionStr,
    //   id
    // );

    // Finding similar vectors according to our question
    const similarVectorsData: any = await prisma.$queryRawUnsafe(
      `
      SELECT "id", "chunkText", "embedding" <-> $1::vector AS distance
      FROM "VectorEmbedding"
      WHERE "projectId" = $2
      ORDER BY distance ASC
      LIMIT 10
      `,
      embeddingQuestionStr,
      id
    );

    // const similarVectorsData: any = await prisma.$queryRawUnsafe(
    //   `
    //   SELECT "id", "embedding" <=> $1::vector AS distance
    //   FROM "VectorEmbedding"
    //   WHERE "projectId" = $2
    //   ORDER BY distance ASC
    //   LIMIT 10
    //   `,
    //   embeddingQuestionStr,
    //   id
    // );

    console.log("Similar Vector = ", similarVectorsData);

    const similarVectorsId = similarVectorsData.map((item: any) => item.id);
    console.log("Similar vector id = ", similarVectorsId);

    let parsedEmbeddings = []; //collection of all the relevant vectors

    for (let i = 0; i < similarVectorsId.length; i++) {
      // Fetching individual embedding from database in string format
      const individualEmbedding: any =
        await prisma.$queryRaw`SELECT "embedding"::text as embedding FROM "VectorEmbedding" WHERE "id" = ${similarVectorsId[i]}`;

      // Typecasting the vectors into vectors/array type
      const individualParsedEmbedding = JSON.parse(
        individualEmbedding[0].embedding.replace(/[()]/g, "")
      );

      parsedEmbeddings.push(individualParsedEmbedding);
    }

    console.log("Final Parsed Embeddings collection = ", parsedEmbeddings);

    // TODO: passing the question along with the context which are the relevant vectors

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.log("Error = ", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
