"use client";

import Loading from "@/app/dashboard/loading";
import axios from "axios";
import React, { useEffect, useState } from "react";

const PdfViewer = ({ id }: { id: string }) => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [isComponentMounted, setIsComponentMounted] = useState(true);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const response = await axios.get(`/api/dashboard/${id}`);

        setPdfUrl(response.data.pdfUrl);
      } catch (error) {
        console.log("Error while fetching pdf url", error);
      } finally {
        setIsComponentMounted(false);
      }
    };

    fetchPdfUrl();
  }, [id]);

  return (
    <>
      {isComponentMounted && <Loading />}
      <div className="w-full h-full">
        <iframe
          src={pdfUrl}
          height={"100%"}
          width={"100%"}
          className="w-full h-full"
        />
      </div>
    </>
  );
};

export default PdfViewer;
