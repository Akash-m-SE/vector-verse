import path, { join, resolve } from "path";
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

// Deleting the file from local server if somehow it does not gets deleted
export async function deleteFileFromUploads(filename: string) {
  const uploadsDir = join(process.cwd(), "public/uploads");

  async function deleteFileRecursive(dir: string) {
    const items = await readdir(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = resolve(dir, item.name);

      if (item.isDirectory()) {
        await deleteFileRecursive(fullPath); // Recursive call for subdirectories

        // Check if directory is empty after recursive deletion
        const subDirContents = await readdir(fullPath);
        if (subDirContents.length === 0) {
          await rmdir(fullPath);
          console.log(`Deleted empty directory: ${fullPath}`);
        }
      } else if (item.isFile() && item.name === filename) {
        await fs.unlink(fullPath);
        console.log(`Deleted file: ${fullPath}`);

        // Check if parent directory is empty after file deletion
        const parentDir = path.dirname(fullPath);
        const parentDirContents = await readdir(parentDir);
        if (parentDirContents.length === 0) {
          await rmdir(parentDir);
          console.log(`Deleted empty directory: ${parentDir}`);
        }
      }
    }
  }

  try {
    await deleteFileRecursive(uploadsDir);
  } catch (e) {
    console.error("Error while trying to delete a file\n", e);
  }
}
