"use client";

import React, { useState } from "react";
import PdfViewerComponent from "./_components/PdfViewerComponent";
// import ChatComponent from "./_components/ChatComponentOld";
import ChatComponent from "@/app/dashboard/[id]/_components/Chat";
import useAppStore from "@/store/store";
import { SelectedComponent } from "@/types";

interface ChatInterfaceType {
  params: {
    id: string;
  };
}

const ChatInterface: React.FC<ChatInterfaceType> = ({ params }) => {
  const id = params.id;
  const { PDF, CHAT } = SelectedComponent;

  const className = "w-full lg:w-1/2 h-auto";
  const { selectedComponent } = useAppStore();

  return (
    <>
      <div className="flex flex-row ">
        <PdfViewerComponent
          id={id}
          className={`${className} ${selectedComponent !== PDF && "hidden"} lg:block`}
        />
        <ChatComponent
          id={id}
          className={`${className} ${selectedComponent !== CHAT && "hidden"} lg:block`}
        />
      </div>
    </>
  );
};

export default ChatInterface;
