import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { deleteFileFromS3 } from "@/actions/aws-actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { questionAnswerChain } from "@/actions/langchain-actions";

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
    const session = await getServerSession(authOptions);
    const userId = session.user.sub;
    const { id } = context.params;
    // console.log("Id = ", id);

    const body = await request.json();

    const { question } = body;
    // console.log("Question = ", question);

    // Fetching the Chat History
    const chatHistory = await prisma.message.findMany({
      where: {
        projectId: id,
        userId: userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Question Answer Chain with Context
    const response = await questionAnswerChain(id, question, chatHistory);

    // console.log("Response from route = ", response);

    const responseContent =
      typeof response === "string" ? response : JSON.stringify(response);

    await prisma.message.create({
      data: {
        content: question,
        role: "USER",
        userId: userId,
        projectId: id,
      },
    });

    await prisma.message.create({
      data: {
        content: responseContent,
        role: "AI",
        userId: userId,
        projectId: id,
      },
    });

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.log("Error = ", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 400 }
      );
    }

    // Delete from AWS S3
    await deleteFileFromS3(project.pdfName);

    // Delete Vector Embeddings containing projectId = id
    await prisma.vectorEmbedding.deleteMany({
      where: {
        projectId: id,
      },
    });

    // Deleting from Message Table
    await prisma.message.deleteMany({
      where: {
        projectId: id,
      },
    });

    // Delete project from Projects table containing id = id
    await prisma.project.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: "Successfully deleted the project" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error while deleting the project" },
      { status: 500 }
    );
  }
}
