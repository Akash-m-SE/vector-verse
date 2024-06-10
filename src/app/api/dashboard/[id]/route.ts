import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } },
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
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong while fetching your project." },
      { status: 500 },
    );
  }
}
