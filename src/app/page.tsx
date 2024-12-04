"use client";

import { Cards } from "@/components/Cards";
import React from "react";

const Links = [
  {
    title: "New Project",
    description:
      "Create a new project to start asking questions about your pdf",
    link: "/create-new-project",
  },
  {
    title: "Dashboard",
    description: "Take a detailed view of all the projects you have created!",
    link: "/dashboard",
  },
];

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center justify-center mt-10 p-2">
        <h2 className="">Welcome to your Home Page</h2>
        <Cards redirectLinks={Links} />
      </main>
    </>
  );
}
