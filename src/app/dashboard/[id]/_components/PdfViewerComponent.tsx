"use client";

import Loading from "@/app/dashboard/loading";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface PdfViewerType {
  id: string;
  className?: string;
}

const PdfViewerComponent: React.FC<PdfViewerType> = ({ id, className }) => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [isComponentMounted, setIsComponentMounted] = useState(true);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const response = await axios.get(`/api/dashboard/${id}/pdf`);

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
      <div className={`w-full h-full ${className}`}>
        <iframe
          src={pdfUrl}
          height={"100%"}
          width={"100%"}
          className="h-[90vh] lg:h-[89vh] xl:h-[85vh]"
        />
      </div>
    </>
  );
};

export default PdfViewerComponent;
