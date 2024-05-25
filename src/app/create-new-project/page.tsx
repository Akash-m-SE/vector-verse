"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  file: z
    .instanceof(FileList)
    .optional()
    .refine((fileList: FileList | undefined) => {
      if (!fileList || !fileList.length) {
        // Handle case where no file is selected
        return false; // Indicate error
      }

      const file = fileList.item(0); // Assume single file selection
      if (!file?.name) return false; // Handle missing file name

      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      return fileExtension === "pdf";
    }, "Only PDF files are allowed."),
});

const ProfileForm = () => {
  const initialValues = {
    title: "",
    description: "",
    file: undefined,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const fileRef = form.register("file");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitted Values are = ", values);
    // TODO: push it to backend to be processed by bull worker
    axios.post("/api/create-new-project", values);
  }

  return (
    <div className="flex flex-col items-center justify-center p-5 m-10 gap-5 h-full">
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Create Your Project
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Title of the project*/}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description of the project*/}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description for your project"
                    {...field}
                    className="w-[50vw] min-h-[30vh]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Upload PDF File */}
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Your PDF File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    placeholder="pdf-file"
                    accept="application/pdf"
                    {...fileRef}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
