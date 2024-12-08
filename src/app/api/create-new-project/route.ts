import { NextRequest, NextResponse } from "next/server";
import { uploadFileToS3 } from "@/actions/aws-actions";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addJobToQueue } from "@/actions/bullmq-actions";

import { ProjectType } from "@/types";
import { ProjectStatus } from "@prisma/client";
import { generateUniqueFileName } from "@/actions/fileActions";
import { loginFormSchema } from "@/types/zodSchemas";

export const maxDuration = 60;

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const session = await getServerSession(authOptions);

    const formData = await request.formData();
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      file: formData.get("file[]"),
    };

    const safeData = loginFormSchema.safeParse(data);
    if (!safeData.success) {
      return NextResponse.json(
        { error: safeData.error.message },
        { status: 400 },
      );
    }

    const { title, description, file } = safeData.data;
    const uniqueFile = await generateUniqueFileName(file as File); //generate unique file name
    const response = await uploadFileToS3(uniqueFile); //uploading file to s3

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
        userId: session?.user?.sub as string,
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
