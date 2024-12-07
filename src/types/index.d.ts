import NextAuth from "next-auth";
import { Role, ProjectStatus } from "@prisma/client";

type NavLink = {
  title: string;
  description: string;
  link: string;
};

type IndividualChatHistoryType = {
  id: string;
  content: string;
  role: Role;
  userId: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
};

type ChatHistoryType = IndividualChatHistoryType[];

type ProjectType = {
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

type ProjectsTableType = ProjectType & {
  redirectLink?: string;
};

type ProjectsTableListType = ProjectsTableType[];

type ProjectsListType = ProjectType[];

type MessagesType = {
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
