import { Document } from "@langchain/core/documents";
import { BaseRetriever, BaseRetrieverInput } from "@langchain/core/retrievers";
import { CallbackManagerForRetrieverRun } from "@langchain/core/callbacks/manager";
import { generateVectorEmbeddings } from "./vectorEmbeddings";
import prisma from "@/lib/prisma";

export interface CustomRetrieverInput extends BaseRetrieverInput {}

export class CustomRetriever extends BaseRetriever {
  lc_namespace = ["langchain", "retrievers"];

  private projectId: string;

  constructor(projectId: string, fields?: CustomRetrieverInput) {
    super(fields);
    this.projectId = projectId;
  }

  async _getRelevantDocuments(
    question: string,
    runManager?: CallbackManagerForRetrieverRun,
  ): Promise<Document[]> {
    const embeddedQuestion = await generateVectorEmbeddings(question);

    const embeddingQuestionStr = `[${embeddedQuestion.join(",")}]`;

    const similarVectorsData: any = await prisma.$queryRawUnsafe(
      `
        SELECT "id", "chunkText", "embedding" <-> $1::vector AS distance
        FROM "VectorEmbedding"
        WHERE "projectId" = $2
        ORDER BY distance ASC
        LIMIT 10
        `,
      embeddingQuestionStr,
      this.projectId,
    );

    // console.log("Similar vector data = ", similarVectorsData);

    return similarVectorsData.map(
      (item: any) =>
        new Document({
          pageContent: item.chunkText,
          metadata: {},
        }),
    );
  }
}
