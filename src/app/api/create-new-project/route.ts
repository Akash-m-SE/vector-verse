import { NextRequest, NextResponse } from "next/server";
import { downloadFileFromS3, uploadFileToS3 } from "@/actions/aws-actions";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addJobToQueue } from "@/actions/bullmq-actions";
import {
  generateUniqueFileName,
  uploadFileToDisk,
} from "@/actions/uploadFileToDisk";
import { ProjectType } from "@/types";
import { ProjectStatus } from "@prisma/client";
import { extractDataFromPdf } from "@/actions/extractDataFromPdf";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // console.log("Server Session = ", session);
    // console.log("Server Session database id = ", session?.user?.sub);

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

    // Uploading the file to Server to be saved locally
    // const filepath = await uploadFileToDisk(file);

    // if (!filepath) {
    //   return NextResponse.json(
    //     { error: "Failed to upload the pdf file in the server." },
    //     { status: 400 },
    //   );
    // }

    // console.log("file path from function = ", filepath);

    const uniqueFile = await generateUniqueFileName(file);

    console.log("Unique File Details = ", uniqueFile);

    // Uploading the file from Server to S3
    // const response = await uploadFileToS3(filepath);
    // **upload file to s3
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

    // Sending filepath of stored file and projectId to bull mq worker
    // await addJobToQueue(responseFromProject.id, filepath);
    // await addJobToQueue(responseFromProject.id);

    // **await downloadFileFromS3(responseFromProject.pdfName)
    // const fileFromS3 = await downloadFileFromS3(
    //   "Akash_Maity_Resume-1720180326648-242011262.pdf"
    // );

    // if (!fileFromS3) {
    //   console.log("Failed to fetch file from S3");
    // }

    // **reading the file
    // await extractDataFromPdf(fileFromS3);

    // **send filename from project table to bull mq worker
    await addJobToQueue(responseFromProject.id, responseFromProject.pdfName);

    return NextResponse.json(
      { message: "Your Project is being created right now!!" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong while creating the project" },
      { status: 500 },
    );
  }
}
