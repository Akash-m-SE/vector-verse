import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Fetch Conversation History
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    const messages = await prisma.message.findMany({
      where: {
        projectId: id,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        content: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // console.log("Messages = ", messages);

    return NextResponse.json(
      {
        messages: messages,
        message: "Successfully fetched the conversation",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong while fetching your conversation." },
      { status: 500 }
    );
  }
}
