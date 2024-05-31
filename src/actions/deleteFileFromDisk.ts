import path from "path";
import fs from "fs/promises";
import { readdir, rmdir } from "fs/promises";

export async function deleteFileFromDisk(filePath: string) {
  try {
    const absolutePath = path.join(process.cwd(), filePath);

    await fs.unlink(absolutePath);
    // console.log("Unlinking Successfull");

    const directoryPath = path.dirname(absolutePath); // Get directory path from file path
    const directoryContents = await readdir(directoryPath); // Get directory contents

    // console.log(
    //   "Directory Path = ",
    //   directoryPath,
    //   "\n Directory Contents = ",
    //   directoryContents
    // );

    if (directoryContents.length === 0) {
      await rmdir(directoryPath); //Deleting the empty folder from server
      // console.log("Succesfully Deleted the empty folder");
    }
  } catch (error) {
    console.log("Error while trying to unlink the file\n", error);
    return;
  }
}
