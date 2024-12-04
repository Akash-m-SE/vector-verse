"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "./loading";
import { FileUpload } from "@/components/ui/file-upload";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  file: z
    .any()
    .optional()
    .refine((fileList: File[] | undefined) => {
      if (!fileList || !fileList.length) {
        return false; // Indicate error if no file
      }

      const file = fileList[0]; // Assume single file selection
      if (!file?.name) return false; // Handle missing file name

      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      return fileExtension === "pdf";
    }, "Only PDF files are allowed."),
});

const ProfileForm: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  const session = useSession();

  const [files, setFiles] = useState<File[]>([]);

  const initialValues = {
    title: "",
    description: "",
    file: null,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const fileRef = form.register("file");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (session.status === "unauthenticated") {
      toast({
        variant: "destructive",
        title: "Cannot create new project!",
        description: "Please login to create new project.",
      });
      return;
    }

    try {
      setIsLoading(true);
      setIsComponentMounted(true);

      const response = await axios.post("/api/create-new-project", values, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsComponentMounted(false);

      if (response) {
        toast({
          title: "Success!!",
          description: response.data.message,
        });

        form.reset(initialValues);
        router.push("/dashboard");
      }
    } catch (error: any) {
      // console.log(
      //   "Something went wrong while posting the values to backend =",
      //   error
      // );
      toast({
        variant: "destructive",
        title: "Uh Oh! Something went wrong!",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
      setIsComponentMounted(false);
    }
  }

  const handleResetForm = (e: any) => {
    e.preventDefault();
    form.reset(initialValues);
  };

  return (
    <>
      {isComponentMounted && <Loading />}

      <div className="flex flex-col items-center justify-center p-3 gap-5 h-full">
        <div className="flex w-auto items-center justify-between">
          <h1>Create a new project</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title for your project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      // className="w-[50vw] min-h-[30vh]"
                      className="w-full lg:w-[40vw] md:min-h-[15vh]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Old file upload component */}
            {/* <FormField
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
            /> */}

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Your PDF File</FormLabel>
                  <FormControl>
                    <Controller
                      control={form.control}
                      name="file"
                      render={({ field: { onChange, value } }) => (
                        <FileUpload
                          onChange={(files) => {
                            onChange(files);
                          }}
                          multipleFiles={false}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <Button
                disabled={isLoading}
                onClick={(e) => handleResetForm(e)}
                className="bg-red-400"
              >
                Reset Form
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-400"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default ProfileForm;
