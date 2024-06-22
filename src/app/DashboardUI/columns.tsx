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

export const columns: ColumnDef<Projects>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "pdfName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status: string = row.getValue("status");

      const statusClass =
        status === "CREATING"
          ? "text-blue-500"
          : status === "CREATED"
            ? "text-green-500"
            : status === "FAILED"
              ? "text-red-500"
              : "";
      return <div className={statusClass}>{status}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt");
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        //@ts-ignore
      }).format(new Date(createdAt));

      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "redirectLink",
    header: "View",
    cell: ({ row }) => {
      const projectStatus: string = row.getValue("status");
      const redirectLink: string = row.getValue("redirectLink");

      return (
        <Button disabled={projectStatus !== "CREATED" ? true : false}>
          <Link href={redirectLink}>View Project</Link>
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const payment = row.original;

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
            <DropdownMenuItem
            // Add Delete Project from database, along with delete item from s3 bucket
            // onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
