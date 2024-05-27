import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log(request.url);

    const { title, description, file } = await request.json();
    console.log(
      "title = ",
      title,
      "description = ",
      description,
      "file values = ",
      file
    );
  } catch (error) {
    console.log(error);
  }
}
