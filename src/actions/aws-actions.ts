import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs/promises";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
  },
});

// Upload the pdf file from local server to S3 bucket
export async function uploadFileToS3(filepath: string) {
  const fileBuffer = await fs.readFile(filepath);
  // console.log("file Buffer = ", fileBuffer);

  const fileName = filepath.split("/").pop();

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: "application/pdf",
  };

  const command = new PutObjectCommand(params);

  try {
    const response = await s3Client.send(command);
    console.log("File uploaded successfully to AWS S3 bucket:", response);
    // return response;

    // returning object url so that it can be used to read and access the pdf file
    const objectURL = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;

    return { fileName, objectURL };
  } catch (error) {
    throw error;
  }
}

// TODO: Fetch the file from S3 bucket

// TODO: Delete the file from S3 bucket
