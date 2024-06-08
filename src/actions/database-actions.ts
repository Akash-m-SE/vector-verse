"use server";

import prisma from "@/lib/prisma";
async function getProjects(userId: string) {
  try {
    console.log("userid = ", userId);
    const response = await prisma.project.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return response;
  } catch (error) {
    console.log("Error fetching projects", error);
    throw new Error();
  }
}
