"use client";

import React from "react";
import PdfViewerComponent from "./_components/PdfViewerComponent";
import ChatComponent from "./_components/ChatComponent";

interface ChatInterfaceType {
  params: {
    id: string;
  };
}

const ChatInterface: React.FC<ChatInterfaceType> = ({ params }) => {
  const id = params.id;

  return (
    <>
      <div className="flex h-full gap-2">
        <div
          id="PdfViewer"
          className="w-1/2 flex items-center justify-center min-h-[80vh]"
        >
          <PdfViewerComponent id={id} />
        </div>
        <div id="chatComponent" className="w-1/2">
          <ChatComponent id={id} />
        </div>
      </div>
    </>
  );
};

export default ChatInterface;
