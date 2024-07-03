import mime from "mime";
import { join } from "path";
import fs from "fs/promises";
import { stat, mkdir } from "fs/promises";
import * as dateFn from "date-fns";

export async function uploadFileToDisk(file: File) {
  // File upload to disk
  // for saving file to disk, we need to convert blob to buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  //structuring the directory name and the path where the file will be stored in the server
  const relativeUploadDir = `public/uploads/${dateFn.format(
    Date.now(),
    "dd-MM-y",
  )}`;
  const uploadDir = join(process.cwd(), relativeUploadDir);
  // console.log("relativeUploadDir", relativeUploadDir, "uploadDir", uploadDir);

  try {
    await stat(uploadDir);
  } catch (e: any) {
    if (e.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
    } else {
      console.error(
        "Error while trying to create directory when uploading a file\n",
        e,
      );

      return;
    }
  }

  try {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    const filename = `${file.name.replace(
      /\.[^/.]+$/,
      "",
    )}-${uniqueSuffix}.${mime.getExtension(file.type)}`;

    // writing the file to disk
    await fs.writeFile(`${uploadDir}/${filename}`, buffer);

    // sending back the response
    const fileUrl = `${relativeUploadDir}/${filename}`;
    // console.log("File path from local directory = ", fileUrl);
    // return NextResponse.json({ fileUrl: `${relativeUploadDir}/${filename}` });

    return fileUrl;
  } catch (e) {
    console.error("Error while trying to upload a file\n", e);

    return;
  }
}
