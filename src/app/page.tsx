"use client";

import { Cards } from "@/components/Cards";
import { NavLink } from "@/types";
import React from "react";

const NavLinks: NavLink[] = [
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
      <main className="flex flex-col items-center mt-10 p-2">
        <h3>Welcome to your Home Page</h3>
        <Cards redirectLinks={NavLinks} />
      </main>
    </>
  );
}
