"use client";

import { HoverEffect } from "./ui/card-hover-effect";

export function Cards() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}

export const projects = [
  {
    title: "New Project",
    description:
      "Create a new project to start asking questions about your pdf",
    link: "/create-new-project",
    // /create-new-project
  },
  {
    title: "My Projects",
    description: "Take a detailed view of all the projects you have created!",
    link: "/my-projects",
    // /my-projects/loggedin-user-id
  },
];
