import { Role } from "@prisma/client";
import { ProjectStatus } from "@prisma/client";

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
