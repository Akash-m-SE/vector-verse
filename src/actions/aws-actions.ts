import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs/promises";
import mime from "mime";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
  },
});

// Upload the pdf file from local server to S3 bucket
// export async function uploadFileToS3(filepath: string) {
//   const fileBuffer = await fs.readFile(filepath);
//   // console.log("file Buffer = ", fileBuffer);

//   const fileName = filepath.split("/").pop();

//   const params = {
//     Bucket: process.env.AWS_S3_BUCKET_NAME,
//     Key: fileName,
//     Body: fileBuffer,
//     ContentType: "application/pdf",
//   };

//   const command = new PutObjectCommand(params);

//   try {
//     const response = await s3Client.send(command);
//     // console.log("File uploaded successfully to AWS S3 bucket:", response);
//     // return response;

//     // returning object url so that it can be used to read and access the pdf file
//     const objectURL = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;

//     return { fileName, objectURL };
//   } catch (error) {
//     throw error;
//   }
// }

// **Uploading file to s3
export async function uploadFileToS3(file: File) {
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const originalFilename = file.name;

  // Extract filename without extension
  const filenameWithoutExtension = originalFilename.replace(/\.[^/.]+$/, "");

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${filenameWithoutExtension}.${mime.getExtension(file.type)}`, // Add extension based on file type
    Body: fileBuffer,
    ContentType: file.type,
  };

  const command = new PutObjectCommand(params);

  try {
    const response = await s3Client.send(command);
    // console.log("File uploaded successfully to AWS S3 bucket:", response);

    // Returning object url so that it can be used to read and access the uploaded file
    const objectURL = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;

    return { fileName: params.Key, objectURL }; // Return filename with extension
  } catch (error) {
    throw error;
  }
}

// **download file from s3
export async function downloadFileFromS3(
  pdfName: string,
): Promise<Uint8Array | undefined> {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: pdfName,
  };

  try {
    const response = await s3Client.send(new GetObjectCommand(params));
    // console.log("Downloaded file from s3 = ", response);
    // const fileBuffer = await response.Body.

    if (!response.Body) {
      throw new Error("Response body from S3 is undefined");
    }

    const byteArrayFile = await response.Body.transformToByteArray();

    console.log("Byte Array Transform = ", byteArrayFile);

    return byteArrayFile;
  } catch (error) {
    console.error("Error downloading file from S3:", error);
  }
}

// Delete the file from S3 bucket
export async function deleteFileFromS3(fileName: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
  });

  try {
    const response = await s3Client.send(command);
    // console.log("response after deleting from S3 = ", response);
  } catch (error) {
    throw new Error("Error while deleting object from S3");
  }
}
