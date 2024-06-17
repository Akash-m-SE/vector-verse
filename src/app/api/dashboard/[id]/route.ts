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

    const embeddedQuestion = await generateVectorEmbeddings(question);

    // console.log("Embedded Question = ", embeddedQuestion);

    //TODO :- change question into embedding get the nearest embeddings from database and send both of the embeddings to llm to get the answer

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.log("Error = ", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
