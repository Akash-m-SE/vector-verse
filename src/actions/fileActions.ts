import mime from "mime";

export async function generateUniqueFileName(file: File): Promise<File> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const originalFilename = file.name;
    const extension = mime.getExtension(file.type) || "";

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${originalFilename.replace(/\.[^/.]+$/, "")}-${uniqueSuffix}.${extension}`;

    return new File([buffer], filename, { type: file.type });
  } catch (error: any) {
    console.log("Error while generating unique file name", error);
    throw new Error("Error while generating unique file name");
  }
}
