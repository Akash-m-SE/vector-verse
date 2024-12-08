import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ProjectsListType, ProjectsTableListType } from "@/types";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are not logged in." },
        { status: 401 },
      );
    }

    const projects: ProjectsListType = await prisma.project.findMany({
      where: {
        userId: session?.user?.sub as string,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!projects) {
      return NextResponse.json(
        { messaage: "No projects found" },
        { status: 400 },
      );
    }

    const modifiedProjects: ProjectsTableListType = projects.map((project) => ({
      ...project,
      redirectLink: `/dashboard/${project.id}`,
    }));

    return NextResponse.json(
      { data: modifiedProjects, message: "projects fetched successfully!" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong while fetching the projects." },
      { status: 500 },
    );
  }
}
