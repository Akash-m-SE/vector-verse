import { Queue, Worker } from "bullmq";
import { extractDataFromPdf } from "./extractDataFromPdf";
import { generateVectorEmbeddingsAndStoreThemInDB } from "./vectorEmbeddings";
import prisma from "@/lib/prisma";
import { ProjectStatus } from "@prisma/client";
import { downloadFileFromS3 } from "./aws-actions";

// const RedisConnection = {
//   host: String(process.env.REDIS_HOST) || "localhost",
//   port: Number(process.env.REDIS_PORT) || 6379,
//   password: String(process.env.REDIS_PASSWORD) || "",
// };

const RedisConnection = {
  host: String(process.env.REDIS_HOST),
  port: Number(process.env.REDIS_PORT),
  password: String(process.env.REDIS_PASSWORD),
};

const pdfProcessingQueue = new Queue("pdf-processing", {
  connection: RedisConnection,
});

const worker = new Worker(
  "pdf-processing",
  async (job: any) => {
    const { projectId, pdfName } = await job.data;

    // Read the PDF file and extract text
    console.log("Hello from BullMQ Worker");
    console.log("projectId = ", projectId, "Pdf Name = ", pdfName);

    // Download the File from s3
    const fileFromS3 = await downloadFileFromS3(pdfName);

    // Extract data from PDF file
    const extractedText = await extractDataFromPdf(fileFromS3);

    // Generating the vector embeddings and storing them in database
    await generateVectorEmbeddingsAndStoreThemInDB(extractedText, projectId);
  },
  {
    connection: RedisConnection,
  },
);

worker.on("completed", async (job) => {
  console.log(`Job ${job.id} (process pdf) completed successfully!`);

  // Updating the project status in database
  await prisma.project.update({
    where: {
      id: job.data.projectId,
    },
    data: {
      status: ProjectStatus.CREATED,
    },
  });
});

worker.on("failed", async (job: any, error: any) => {
  console.error(`Job ${job.id} (process pdf) failed:`, error);

  // Updating the project status to be failed in the database
  await prisma.project.update({
    where: {
      id: job.data.projectId,
    },
    data: {
      status: ProjectStatus.FAILED,
    },
  });
});

export async function addJobToQueue(projectId: string, pdfName: string) {
  await pdfProcessingQueue.add("process pdf files", { projectId, pdfName });
}
