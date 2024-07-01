"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

const PdfViewer = ({ id }: { id: string }) => {
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const fetchPdfUrl = async () => {
      const response = await axios.get(`/api/dashboard/${id}`);

      setPdfUrl(response.data.pdfUrl);
    };

    fetchPdfUrl();
  }, [id]);

  return (
    <>
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
