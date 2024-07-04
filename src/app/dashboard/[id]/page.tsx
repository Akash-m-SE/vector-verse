import Chat from "@/components/Chat";
import PdfViewer from "@/components/PdfViewer";
import React from "react";

interface ChatInterfaceType {
  params: {
    id: string;
  };
}

const ChatInterface: React.FC<ChatInterfaceType> = ({ params }) => {
  const id: string = params.id;

  return (
    <>
      <div className="flex h-full gap-2">
        <div
          id="PdfViewer"
          className="w-1/2 flex items-center justify-center min-h-[80vh]"
        >
          <PdfViewer id={id} />
        </div>
        <div id="chatComponent" className="w-1/2">
          <Chat id={id} />
        </div>
      </div>
    </>
  );
};

export default ChatInterface;
