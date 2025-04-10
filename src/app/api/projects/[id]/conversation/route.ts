import { questionAnswerChain } from "@/actions/langchain-actions";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ChatHistoryType, MessagesType } from "@/types";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

// Fetch Conversation History
export async function GET(
  request: NextRequest,
  context: { params: { id: string } },
  response: NextResponse,
) {
  try {
    const session = getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are not logged in." },
        { status: 401 },
      );
    }

    const { id } = context.params;
    const messages: MessagesType[] = await prisma.message.findMany({
      where: {
        projectId: id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // console.log("Messages = ", messages);

    return NextResponse.json(
      {
        messages: messages,
        message: "Successfully fetched the conversation",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong while fetching your conversation." },
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
