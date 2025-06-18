import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function extractDataFromPdf(byteArrayFile: Uint8Array) {
  try {
    const blob = new Blob([byteArrayFile]);

    const loader = new PDFLoader(blob);

    const docs = await loader.load();

    return docs[0].pageContent;
  } catch (error: any) {
    throw new Error(
      error.message || "Error while extracting data from PDF error",
    );
  }
}
