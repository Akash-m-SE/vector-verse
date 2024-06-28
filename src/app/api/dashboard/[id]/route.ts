import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatGroq } from "@langchain/groq";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { CustomRetriever } from "@/actions/customRetriever";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const { id } = context.params;

    const project = await prisma.project.findUnique({
      where: {
        id: id,
      },
    });

    // console.log("Project Details = ", project);

    return NextResponse.json(
      {
        project: project,
        projectId: id,
        message: "Successfully fetched your project",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong while fetching your project." },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const { id } = context.params;
    // console.log("Id = ", id);

    const body = await request.json();

    const { question } = body;
    console.log("Question = ", question);

    // Instantiate the model
    const model = new ChatGroq({
      model: "mixtral-8x7b-32768",
      temperature: 0,
    });

    const systemTemplate = [
      `You are an assistant for question-answering tasks. `,
      `Use the following pieces of retrieved context to answer `,
      `the question. If you don't know the answer, say that you `,
      `don't know. Use three sentences maximum and keep the `,
      `answer concise.`,
      `\n\n`,
      `{context}`,
    ].join("");

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemTemplate],
      ["human", "{input}"],
    ]);

    const questionAnswerChain = await createStuffDocumentsChain({
      llm: model,
      prompt,
    });

    // Custom Retriever Class
    const retriever = new CustomRetriever(id);

    const ragChain = await createRetrievalChain({
      retriever,
      combineDocsChain: questionAnswerChain,
    });

    // Ask a question
    const results = await ragChain.invoke({
      input: question,
    });

    console.log("Result from RAG Chain = ", results);

    //TODO:- Add chat history to a question-answering chain for context

    //TODO: - Add Database functionality to add user's question and the AI's answer

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.log("Error = ", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
