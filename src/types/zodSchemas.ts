import { z } from "zod";

// Old login form schema
// export const loginFormSchema = z.object({
//   title: z.string().min(2, {
//     message: "Username must be at least 2 characters.",
//   }),
//   description: z.string().min(2, {
//     message: "Description must be at least 2 characters.",
//   }),
//   file: z
//     .any()
//     .optional()
//     .refine((fileList: File[] | undefined) => {
//       if (!fileList || !fileList.length) {
//         return false; // Indicate error if no file
//       }

//       const file = fileList[0]; // Assume single file selection
//       if (!file?.name) return false; // Handle missing file name

//       const fileExtension = file.name.split(".").pop()?.toLowerCase();
//       return fileExtension === "pdf";
//     }, "Only PDF files are allowed."),
// });

// New Login Schema
export const loginFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  file: z
    .union([z.array(z.instanceof(File)), z.instanceof(File)])
    .optional()
    .refine((fileList: File[] | File | undefined) => {
      // Handle if fileList is an array (multiple files) or a single file
      if (!fileList) return false; // No file provided

      const files = Array.isArray(fileList) ? fileList : [fileList]; // Handle both single and multiple files
      return files.every((file) => file.type === "application/pdf"); // Check if all files are PDFs
    }, "Only PDF files are allowed."),
});
