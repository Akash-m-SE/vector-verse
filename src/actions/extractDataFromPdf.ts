import PDFParser from "pdf2json";

// Modify the extract function to accept a byte array
async function extract(byteArrayFile: Uint8Array): Promise<string> {
  const pdfParser = new (PDFParser as any)(null, 1);

  return new Promise<string>((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", (errData: any) => {
      console.error("Parser Error =", errData.parserError);
      reject(new Error("Error parsing PDF"));
    });

    pdfParser.on("pdfParser_dataReady", () => {
      const parsedText = (pdfParser as any).getRawTextContent();
      resolve(parsedText);
    });

    // Load the PDF from the byte array
    pdfParser.parseBuffer(byteArrayFile);
  });
}

export async function extractDataFromPdf(byteArrayFile: any): Promise<string> {
  try {
    const extractedText = await extract(byteArrayFile);

    // console.log("Extracted Text = ", extractedText);
    return extractedText;
  } catch (error) {
    console.log("Error while parsing the pdf file =", error);
    throw new Error("Error extracting data from PDF");
  }
}
