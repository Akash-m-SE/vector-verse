import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { deleteFileFromS3 } from "@/actions/aws-actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { questionAnswerChain } from "@/actions/langchain-actions";
import { Role } from "@prisma/client";
import { ChatHistoryType, MessagesType, ProjectType } from "@/types";

export const maxDuration = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
  response: NextResponse,
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are not logged in." },
        { status: 401 },
      );
    }

    const id = params.id;
    const project = await prisma.project.findUnique({
      where: {
        id: id,
      },
      select: {
        pdfUrl: true,
      },
    });

    return NextResponse.json(
      {
        pdfUrl: project?.pdfUrl,
        message: "Successfully fetched your project",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong while fetching your project." },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are not logged in." },
        { status: 401 },
      );
    }

    const userId = session?.user?.sub;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session." },
        { status: 401 },
      );
    }

    const { id } = params;
    const body = await request.json();

    const { question } = body;
    // console.log("Question = ", question);

    // Fetching the Chat History
    const chatHistory: ChatHistoryType = await prisma.message.findMany({
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

    const responseContent =
      typeof response === "string" ? response : JSON.stringify(response);

    const userMessage: MessagesType = await prisma.message.create({
      data: {
        content: question,
        role: Role.USER,
        userId: userId,
        projectId: id,
      },
    });

    const aiMessage: MessagesType = await prisma.message.create({
      data: {
        content: responseContent,
        role: Role.AI,
        userId: userId,
        projectId: id,
      },
    });

    // console.log("user messages = ", userMessage, " ai message = ", aiMessage);

    return NextResponse.json(
      { message: "Success", userMessage: userMessage, aiMessage: aiMessage },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error = ", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } },
  response: NextResponse,
) {
  try {
    const { id } = context.params;

    const project: ProjectType | null = await prisma.project.findUnique({
      where: {
        id: id,
      },
    });

    // console.log("Project Details = ", project);

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 400 },
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
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error while deleting the project" },
      { status: 500 },
    );
  }
}
