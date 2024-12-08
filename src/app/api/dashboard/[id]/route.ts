import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { deleteFileFromS3 } from "@/actions/aws-actions";
import { ProjectType } from "@/types";

export const maxDuration = 60;

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
