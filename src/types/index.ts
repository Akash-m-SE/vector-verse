import NextAuth from "next-auth";
import { Role, ProjectStatus } from "@prisma/client";

export type NavLink = {
  title: string;
  description: string;
  link: string;
};

export type IndividualChatHistoryType = {
  id: string;
  content: string;
  role: Role;
  userId: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ChatHistoryType = IndividualChatHistoryType[];

export type ProjectType = {
  id: string;
  title: string;
  description: string;
  pdfName: string;
  pdfUrl: string;
  status: ProjectStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export enum SelectedComponent {
  PDF,
  CHAT,
}

export type ProjectsTableType = ProjectType & {
  redirectLink?: string;
};

export type ProjectsTableListType = ProjectsTableType[];

export type ProjectsListType = ProjectType[];

export type MessagesType = {
  id: string;
  content: string;
  role: Role;
  userId: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
};

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      picture?: string | null;
      sub?: string | null;
    };
  }

  interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    picture?: string | null;
    sub?: string | null;
  }
}
