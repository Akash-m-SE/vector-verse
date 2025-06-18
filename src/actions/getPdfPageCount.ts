import { PDFDocument } from "pdf-lib";

export async function getPdfPageCount(file: File[]): Promise<any> {
  try {
    const arrayBuffer = await file[0].arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const pageCount = pdfDoc.getPageCount();
    if (pageCount > 2) throw new Error("PDF is too long to be processed");

    return;
  } catch (error: any) {
    console.log("error while getting pdf page count", error);
    throw new Error(error.message || "PDF is too long to be processed");
  }
}
