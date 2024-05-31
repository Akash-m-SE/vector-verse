import { Queue, Worker, Job } from "bullmq";

import prisma from "@/lib/prisma"; // Adjust the import according to your setup
import { parsePdfFromUrl } from "./processPdfFile";

async function processPdf(job: any) {
  const { projectId } = job?.data;
  console.log("Job details = ", job);
  console.log("ProjectId = ", job.data.projectId);

  // Fetch project details from database
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    console.error(`Project with ID ${projectId} not found`);
    return;
  }

  const { pdfUrl } = project;

  // Parse PDF using the URL
  let parsedText;
  try {
    parsedText = await parsePdfFromUrl(pdfUrl);
    console.log("Parsed Data = ", parsedText);
  } catch (error) {
    console.error(`Failed to parse PDF from URL: ${pdfUrl}`, error);
    return;
  }

  // Generate embeddings using the parsed text
  //   let embeddings;
  //   try {
  //     embeddings = await generateEmbeddings(parsedText);
  //   } catch (error) {
  //     console.error(
  //       `Failed to generate embeddings for project ${projectId}`,
  //       error
  //     );
  //     return;
  //   }

  // ... (Optional) Store embeddings in a database

  console.log(
    `Processed PDF for project ${projectId} and generated embeddings`
  );
}

const pdfProcessingQueue = new Queue("pdf-processing", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

const worker = new Worker(
  "pdf-processing",
  async (job) => {
    await processPdf(job);
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} (process pdf) completed successfully!`);
});

worker.on("failed", (job: any, error) => {
  console.error(`Job ${job.id} (process pdf) failed:`, error);
});

export async function addJobToQueue(projectId: string) {
  await pdfProcessingQueue.add("process pdf files", { projectId });
}

async function generateEmbeddings(text: string): Promise<any> {
  // Implement your embedding generation logic here
  return []; // Return generated embeddings
}
