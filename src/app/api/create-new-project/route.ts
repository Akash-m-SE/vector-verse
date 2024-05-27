import mime from "mime";
import { join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import * as dateFn from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    console.log("shadcn form values = ", formData);

    const title = formData.get("title");
    const description = formData.get("description");
    const file = formData.get("file[]") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "File blob is required." },
        { status: 400 }
      );
    }

    // Successfully working
    console.log("title = ", title);
    console.log("description = ", description);
    console.log("uploaded file blob = ", file);
    console.log("uploaded file blob size = ", file.name);
    // console.log("uploaded file name = ", file.);

    // File upload to disk
    // for saving file to disk, we need to convert blob to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    //structuring the directory name and the path where the file will be stored in the server
    const relativeUploadDir = `/uploads/${dateFn.format(
      Date.now(),
      "dd-MM-y"
    )}`;
    const uploadDir = join(process.cwd(), "public", relativeUploadDir);

    try {
      await stat(uploadDir);
    } catch (e: any) {
      if (e.code === "ENOENT") {
        await mkdir(uploadDir, { recursive: true });
      } else {
        console.error(
          "Error while trying to create directory when uploading a file\n",
          e
        );
        return NextResponse.json(
          { error: "Something went wrong." },
          { status: 500 }
        );
      }
    }

    try {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

      const filename = `${file.name.replace(
        /\.[^/.]+$/,
        ""
      )}-${uniqueSuffix}.${mime.getExtension(file.type)}`;

      // writing the file to disk
      await writeFile(`${uploadDir}/${filename}`, buffer);

      // sending back the response
      // TODO: uploading the file from disk to s3 and fetching the url and saving it to database
      const fileUrl = `${relativeUploadDir}/${filename}`;
      console.log("File path from local directory = ", fileUrl);
      return NextResponse.json({ fileUrl: `${relativeUploadDir}/${filename}` });
    } catch (e) {
      console.error("Error while trying to upload a file\n", e);
      return NextResponse.json(
        { error: "Something went wrong." },
        { status: 500 }
      );
    }
    // ENd of File Upload
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong while creating the project" },
      { status: 500 }
    );
  }
}
