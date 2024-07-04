"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "../DashboardUI/data-table";
import { columns } from "../DashboardUI/columns";
import axios from "axios";
import { useSession } from "next-auth/react";
import { EmptyDashboardState } from "@/components/EmptyState";
import Loading from "./loading";

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState([]);
  const session = useSession();
  const [isComponentMounted, setIsComponentMounted] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (session.status === "unauthenticated") return;
      try {
        const response = await axios.get("/api/dashboard");
        const { data } = response.data;

        //@ts-ignore
        setProjects(data);
      } catch (error) {
        console.log("Error fetching projects", error);
      } finally {
        setIsComponentMounted(false);
      }
    };

    fetchProjects();

    // Polling to fetch updated data from the database
    const interval = setInterval(fetchProjects, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [session.status]);

  return (
    <>
      {isComponentMounted && <Loading />}
      {projects.length === 0 ? (
        <EmptyDashboardState />
      ) : (
        <div className="flex flex-col items-center justify-center m-5">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Welcome To Your Dashboard
          </h2>
          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={projects} />
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
