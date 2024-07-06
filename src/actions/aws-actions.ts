import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import mime from "mime";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
  },
});

// Uploading file to s3
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

    if (!response) {
      throw new Error("Failed to upload file to s3");
    }

    // Returning object url so that it can be used to read and access the uploaded file
    const objectURL = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;

    return { fileName: params.Key, objectURL };
  } catch (error: any) {
    console.log("Error uploading file to AWS S3:", error);
    throw new Error("Error uploading file to AWS S3");
  }
}

// Downloading file from s3
export async function downloadFileFromS3(pdfName: string): Promise<Uint8Array> {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: pdfName,
  };

  try {
    const response = await s3Client.send(new GetObjectCommand(params));

    if (!response.Body) {
      throw new Error("Response body from S3 is undefined");
    }

    const byteArrayFile = await response.Body.transformToByteArray();

    // console.log("Byte Array Transform = ", byteArrayFile);

    return byteArrayFile;
  } catch (error: any) {
    console.error("Error downloading file from S3:", error);
    throw new Error("Error downloading file from S3");
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
  } catch (error) {
    console.log("Error while deleting object from S3:", error);
    throw new Error("Error while deleting object from S3");
  }
}
