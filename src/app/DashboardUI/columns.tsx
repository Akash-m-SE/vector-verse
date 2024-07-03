"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Router } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Projects = {
  id?: string;
  title?: string;
  description?: string;
  pdfName?: string;
  pdfUrl?: string;
  status?: ProjectStatus;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  redirectLink?: string;
};

enum ProjectStatus {
  CREATING,
  CREATED,
  FAILED,
}

const cleanPdfName = (pdfName: string) => {
  const regex = /-\d+-\d+\.[^.]+$/;
  return pdfName.replace(regex, "");
};

const DeleteProjectButton = ({ id }: { id: any }) => {
  const { toast } = useToast();

  const deleteProject = async (id: any) => {
    try {
      const response = await axios.delete(`/api/dashboard/${id}`);

      if (response.status === 200) {
        toast({
          description: response.data.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to delete project.",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel></DropdownMenuLabel>
        <DropdownMenuItem onClick={() => deleteProject(id)}>
          Delete Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Projects>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return <div className="font-bold">Title</div>;
    },
  },
  {
    accessorKey: "pdfName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-bold"
        >
          Pdf Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const pdfName: string = row.getValue("pdfName");
      const cleanedPdfName = cleanPdfName(pdfName);
      return <div>{cleanedPdfName}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-bold"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const status: string = row.getValue("status");

      const statusClass =
        status === "CREATING"
          ? "text-blue-500 font-bold"
          : status === "CREATED"
            ? "text-green-500 font-bold"
            : status === "FAILED"
              ? "text-red-500 font-bold"
              : "";
      return (
        <div className="flex items-center justify-center">
          <div className={statusClass}>{status}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-bold"
          >
            Created At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const createdAt: Date = row.getValue("createdAt");
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }).format(new Date(createdAt));

      return (
        <div className="flex items-center justify-center">{formattedDate}</div>
      );
    },
  },
  {
    accessorKey: "redirectLink",
    header: ({ column }) => {
      return (
        <div className="font-bold flex items-center justify-center">View</div>
      );
    },
    cell: ({ row }) => {
      const projectStatus: string = row.getValue("status");
      const redirectLink: string = row.getValue("redirectLink");

      const disabled = projectStatus !== "CREATED" ? true : false;

      return (
        <div className="flex items-center justify-center">
          <Button asChild={!disabled} disabled={disabled}>
            <Link href={redirectLink}>View Project</Link>
          </Button>
        </div>
      );
    },
  },
  {
    id: "actions",
    // header: "Actions",
    header: ({ column }) => {
      return (
        <div className="font-bold flex items-center justify-center">
          Actions
        </div>
      );
    },
    cell: ({ row }) => {
      const id = row.original.id;

      return (
        <div className="flex items-center justify-center">
          <DeleteProjectButton id={id} />
        </div>
      );
    },
  },
];
