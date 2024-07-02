import { Queue, Worker, Job } from "bullmq";

import { extractDataFromPdf } from "./extractDataFromPdf";
import { deleteFileFromDisk } from "./deleteFileFromDisk";
import { generateVectorEmbeddingsAndStoreThemInDB } from "./vectorEmbeddings";
import prisma from "@/lib/prisma";

const pdfProcessingQueue = new Queue("pdf-processing", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

const worker = new Worker(
  "pdf-processing",
  async (job: any) => {
    const { projectId, filePath } = await job.data;

    // Read the PDF file and extract text
    console.log("Hello from bull -mq node");
    console.log("projectId = ", projectId, "filePath = ", filePath);

    const extractedText = await extractDataFromPdf(filePath);
    // console.log("Extracted pdf text = ", extractedText);

    // Generating the vector embeddings and storing them in database
    await generateVectorEmbeddingsAndStoreThemInDB(extractedText, projectId);
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  },
);

worker.on("completed", async (job) => {
  console.log(`Job ${job.id} (process pdf) completed successfully!`);

  // Deleting the file from disk
  await deleteFileFromDisk(job.data.filePath);

  // Updating the project status in database
  await prisma.project.update({
    where: {
      id: job.data.projectId,
    },
    data: {
      status: "CREATED",
    },
  });
});

worker.on("failed", async (job: any, error) => {
  console.error(`Job ${job.id} (process pdf) failed:`, error);

  // Updating the project status to be failed in the database
  await prisma.project.update({
    where: {
      id: job.data.projectId,
    },
    data: {
      status: "FAILED",
    },
  });
});

export async function addJobToQueue(projectId: string, filePath: string) {
  await pdfProcessingQueue.add("process pdf files", { projectId, filePath });
}
