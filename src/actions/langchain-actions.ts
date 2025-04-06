import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChatGroq } from "@langchain/groq";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { CustomRetriever } from "./customRetriever";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { Role } from "@prisma/client";
import { ChatHistoryType, IndividualChatHistoryType } from "@/types";

export async function PDFLoader() {}

// Function to split the text into chunks
export async function textSplitter(text: string) {
  // Converting the extracted text into document
  const doc = new Document({ pageContent: text });
  // console.log("Document Object from split function = ", doc);

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splits = await textSplitter.splitDocuments([doc]); //splitting the chunks
  //   console.log("Splits = ", splits);

  return splits;
}

// Define the system prompt for the QA chain
const qaSystemPrompt = `You are an assistant for question-answering tasks.
Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know.
Use three sentences maximum and keep the answer concise.

{context}`;

const qaPrompt = ChatPromptTemplate.fromMessages([
  ["system", qaSystemPrompt],
  new MessagesPlaceholder("chat_history"),
  ["human", "{question}"],
]);

const contextualizeQSystemPrompt = `Given a chat history and the latest user question
which might reference context in the chat history, formulate a standalone question
which can be understood without the chat history. Do NOT answer the question,
just reformulate it if needed and otherwise return it as is.`;

const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
  ["system", contextualizeQSystemPrompt],
  new MessagesPlaceholder("chat_history"),
  ["human", "{question}"],
]);

export async function questionAnswerChain(
  id: string,
  question: string,
  chatHistory: ChatHistoryType,
) {
  // Formatting the chat history for question contextualization
  const formattedChatHistory = chatHistory.map(
    (item: IndividualChatHistoryType) =>
      item.role === Role.USER
        ? new HumanMessage(item.content)
        : new AIMessage(item.content),
  );
  // console.log("Formatted Chat History = ", formattedChatHistory);

  const model = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
  });

  const contextualizeQChain = contextualizeQPrompt
    .pipe(model)
    .pipe(new StringOutputParser());

  const contextualizedQuestion = (input: Record<string, unknown>) => {
    if ("chat_history" in input) {
      return contextualizeQChain;
    }
    return input.question;
  };

  // Custom Retriever Class
  const retriever = new CustomRetriever(id);

  const ragChain = RunnableSequence.from([
    RunnablePassthrough.assign({
      context: async (input: Record<string, unknown>) => {
        if ("chat_history" in input) {
          const chain: any = contextualizedQuestion(input);
          return chain.pipe(retriever).pipe(formatDocumentsAsString);
        }
        return "";
      },
    }),
    qaPrompt,
    model,
  ]);

  const result = await ragChain.invoke({
    question,
    chat_history: formattedChatHistory,
  });

  // console.log("Result from RAG Chain = ", result);

  return result.content;
}
