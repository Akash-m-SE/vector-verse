"use client";

import { EmptyState } from "@/components/EmptyState";
import React, { useEffect, useState } from "react";
import { getData } from "../payments/page";
import { DataTable } from "../payments/data-table";
import { columns } from "../payments/columns";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getData();

        //@ts-ignore
        setProjects(response);

        console.log("response from get data function = ", response);
      } catch (error) {
        console.log("Error fetching projects", error);
      }
    };

    fetchProjects();
  }, []);

  // useEffect(() => {
  //   console.log("Use state projects = ", projects);
  // }, [projects]);

  if (projects.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center m-5">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Welcome To Your Dashboard
        </h2>
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={projects} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
