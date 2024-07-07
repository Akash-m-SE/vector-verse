import prisma from "@/lib/prisma";
import { MessagesType } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

// Fetch Conversation History
export async function GET(
  request: NextRequest,
  context: { params: { id: string } },
) {
  try {
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
