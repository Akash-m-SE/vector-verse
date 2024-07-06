import { NextRequest, NextResponse } from "next/server";
import { uploadFileToS3 } from "@/actions/aws-actions";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addJobToQueue } from "@/actions/bullmq-actions";

import { ProjectType } from "@/types";
import { ProjectStatus } from "@prisma/client";
import { generateUniqueFileName } from "@/actions/fileActions";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // console.log("Server Session = ", session);

    // Accessing the incoming request items from formData from request
    const formData = await request.formData();
    // console.log("shadcn form values = ", formData);

    const title = formData.get("title");
    const description = formData.get("description");
    const file = formData.get("file[]") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "File blob is required." },
        { status: 400 },
      );
    }

    const uniqueFile = await generateUniqueFileName(file); //generate unique file name
    // console.log("Unique File Details = ", uniqueFile);

    // Uploading the file from AWS S3
    const response = await uploadFileToS3(uniqueFile);

    if (!response) {
      return NextResponse.json(
        { error: "Failed to upload the pdf file in the AWS S3 Bucket." },
        { status: 400 },
      );
    }

    const { fileName, objectURL } = response;

    const responseFromProject: ProjectType = await prisma.project.create({
      data: {
        title: title as string,
        description: description as string,
        pdfName: fileName as string,
        pdfUrl: objectURL as string,
        status: ProjectStatus.CREATING,
        userId: session?.user?.sub,
      },
    });

    if (!responseFromProject) {
      throw new Error("Failed to save project details in the database");
    }

    // Send filename and pdfName to BullMQ
    await addJobToQueue(responseFromProject.id, responseFromProject.pdfName);

    return NextResponse.json(
      { message: "Your Project is being created right now!!" },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        error:
          error.message || "Something went wrong while creating the project",
      },
      { status: 500 },
    );
  }
}
