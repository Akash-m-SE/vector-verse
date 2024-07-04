import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ProjectsListType, ProjectsTableListType } from "@/types";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // console.log("Session details from server = ", session);
    // console.log("User Id = ", session.user.sub);

    const projects: ProjectsListType = await prisma.project.findMany({
      where: {
        userId: session?.user?.sub,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // console.log("Projects = ", projects);

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

    // console.log("Modified projects = ", modifiedProjects);

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
