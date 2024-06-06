import PDFParser from "pdf2json";
import path from "path";
import { promises as fs } from "fs";

// Due to the async nature of the pdf parsing function, we have to ensure pdf parsing is complete before we return the result
async function extract(fileUrl: string): Promise<string> {
  try {
    const absolutePath = path.join(process.cwd(), fileUrl);
    // console.log("Absolute path for PDF:", absolutePath);

    // Checking if the file exists
    try {
      await fs.stat(absolutePath);
    } catch (e) {
      console.error("File does not exist:", absolutePath);
      throw new Error(`File not found: ${absolutePath}`);
    }

    const pdfParser = new (PDFParser as any)(null, 1);

    return new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        console.error("Parser Error =", errData.parserError);
        reject(new Error("Error parsing PDF"));
      });

      pdfParser.on("pdfParser_dataReady", () => {
        const parsedText = (pdfParser as any).getRawTextContent();
        // console.log("Parsed Text =", parsedText, typeof parsedText);

        // Writing the parsed text to a JSON File
        // let jsonFilePath = fileUrl.replace(".pdf", ".json");
        // fs.writeFile(jsonFilePath, JSON.stringify({ content: parsedText }));
        resolve(parsedText);
      });

      pdfParser.loadPDF(absolutePath);
    });
  } catch (error) {
    console.log("Error while parsing the pdf file =", error);
    throw new Error("Error extracting data from PDF");
  }
}

export async function extractDataFromPdf(fileUrl: string): Promise<string> {
  const extractedText = await extract(fileUrl);

  return extractedText;
}
