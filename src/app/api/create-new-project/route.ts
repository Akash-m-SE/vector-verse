import mime from "mime";
import { join } from "path";
import { stat, mkdir, readdir, rmdir } from "fs/promises";
import * as dateFn from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { uploadFileToS3 } from "@/actions/aws-actions";
import fs from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addJobToQueue } from "@/actions/bullmq-actions";
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
        userId: session?.user?.sub,
      },
    });

    console.log("response from project = ", responseFromProject);
    // Add status of pdf file to database

    // console.log("Project Details = ", responseFromProject);

    // TODO: make the bullmq worker to parse the pdf file
    // const job = await addJobToQueue(responseFromProject[0].id);
    // await addJobToQueue(responseFromProject.id);

    // if (!job) {
    //   console.log("Error while adding job to queue");
    // }

    // Extract Data from pdf file which is stored in the local server
    const parsedText = await extractDataFromPdf(filepath);
    console.log("text from file in route.ts = ", parsedText);

    // Deleting the file from server after entry in database
    // const response = true;
    if (response) {
      deleteFileFromDisk(filepath);
    }

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

async function uploadFileToDisk(file: File) {
  // File upload to disk
  // for saving file to disk, we need to convert blob to buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  //structuring the directory name and the path where the file will be stored in the server
  const relativeUploadDir = `/uploads/${dateFn.format(Date.now(), "dd-MM-y")}`;
  const uploadDir = join(process.cwd(), "public", relativeUploadDir);

  try {
    await stat(uploadDir);
  } catch (e: any) {
    if (e.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
    } else {
      console.error(
        "Error while trying to create directory when uploading a file\n",
        e
      );
      // return NextResponse.json(
      //   { error: "Something went wrong." },
      //   { status: 500 }
      // );
      return;
    }
  }

  try {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    const filename = `${file.name.replace(
      /\.[^/.]+$/,
      ""
    )}-${uniqueSuffix}.${mime.getExtension(file.type)}`;

    // writing the file to disk
    await fs.writeFile(`${uploadDir}/${filename}`, buffer);

    // sending back the response
    const fileUrl = `${relativeUploadDir}/${filename}`;
    // console.log("File path from local directory = ", fileUrl);
    // return NextResponse.json({ fileUrl: `${relativeUploadDir}/${filename}` });

    return fileUrl;
  } catch (e) {
    console.error("Error while trying to upload a file\n", e);
    // return NextResponse.json(
    //   { error: "Something went wrong." },
    //   { status: 500 }
    // );
    return;
  }
}

// Deleting File from Disk
async function deleteFileFromDisk(filePath: string) {
  try {
    const absolutePath = path.join(process.cwd(), "public", filePath);

    await fs.unlink(absolutePath);
    // console.log("Unlinking Successfull");

    const directoryPath = path.dirname(absolutePath); // Get directory path from file path
    const directoryContents = await readdir(directoryPath); // Get directory contents

    // console.log(
    //   "Directory Path = ",
    //   directoryPath,
    //   "\n Directory Contents = ",
    //   directoryContents
    // );

    if (directoryContents.length === 0) {
      await rmdir(directoryPath); //Deleting the empty folder from server
      // console.log("Succesfully Deleted the empty folder");
    }
  } catch (error) {
    console.log("Error while trying to unlink the file\n", error);
    return;
  }
}
