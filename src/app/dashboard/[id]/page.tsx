"use client";

import Chat from "@/components/Chat";
import PdfViewer from "@/components/PdfViewer";
import axios from "axios";
import React, { useEffect, useState } from "react";

const ChatInterface = ({ params }: any) => {
  const id = params.id;
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await axios.get(`/api/dashboard/${id}`);
        // console.log("Response from database = ", response);

        const { project } = response.data;

        setPdfUrl(project.pdfUrl);
      } catch (error) {
        console.log("Error fetching pdf", error);
      }
    };

    fetchPdf();
  }, []);

  return (
    <>
      <div className="flex h-full">
        <div
          id="PdfViewer"
          className="w-1/2 flex items-center justify-center min-h-screen"
        >
          <PdfViewer pdfUrl={pdfUrl} />
        </div>
        <div id="ChatInterface" className="w-1/2">
          <Chat />
        </div>
      </div>
    </>
  );
};

export default ChatInterface;
