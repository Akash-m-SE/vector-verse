import { NextRequest, NextResponse } from "next/server";
import { uploadFileToS3 } from "@/actions/aws-actions";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addJobToQueue } from "@/actions/bullmq-actions";
import { uploadFileToDisk } from "@/actions/uploadFileToDisk";

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
        { status: 400 }
      );
    }

    // Successfully working
    // console.log("title = ", title);
    // console.log("description = ", description);
    // console.log("uploaded file blob = ", file);
    // console.log("uploaded file blob name = ", file.name);
    // console.log("uploaded file name = ", file.);

    // Uploading the file to Server to be saved locally
    const filepath = await uploadFileToDisk(file);

    if (!filepath) {
      return NextResponse.json(
        { error: "Failed to upload the pdf file in the server." },
        { status: 400 }
      );
    }

    console.log("file path from function = ", filepath);

    // Uploading the file from Server to S3
    const response = await uploadFileToS3(filepath);

    if (!response) {
      return NextResponse.json(
        { error: "Failed to upload the pdf file in the AWS S3 Bucket." },
        { status: 400 }
      );
    }

    // console.log("Response from AWS = ", response);
    // console.log("Name of the pdf file = ", response.fileName);
    // console.log("URL of the pdf file = ", response.objectURL);
    const { fileName, objectURL } = response;

    // TODO: Add Database functionality to create a new PROJECT entry with the title, description, objectURL and fileName
    const responseFromProject = await prisma.project.create({
      data: {
        title: title as string,
        description: description as string,
        pdfName: fileName as string,
        pdfUrl: objectURL as string,
        status: "CREATING",
        userId: session?.user?.sub,
      },
    });

    // console.log("response from project = ", responseFromProject);
    // Add status of pdf file to database

    // console.log("Project Details = ", responseFromProject);

    // Send filepath of projectId and stored file to bull mq worker
    await addJobToQueue(responseFromProject.id, filepath); //correct one

    return NextResponse.json({ fileUrl: filepath });
    // TODO:- return json with message
    // return NextResponse.json({message: "File Uploaded Successfully"}, {status: 200});

    // ENd of File Upload
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong while creating the project" },
      { status: 500 }
    );
  }
}
