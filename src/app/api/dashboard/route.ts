import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // console.log("Session details from server = ", session);
    // console.log("User Id = ", session.user.sub);

    const projects = await prisma.project.findMany({
      where: {
        userId: session?.user?.sub,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("Projects = ", projects);
    return NextResponse.json(
      { data: projects, message: "projects fetched successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong while fetching the projects." },
      { status: 500 }
    );
  }
}
