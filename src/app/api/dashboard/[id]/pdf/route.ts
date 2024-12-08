import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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
