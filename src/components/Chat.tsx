"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { dummyMessages } from "@/utils/dummyData";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Chat = ({ id }: { id: string }) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const session = useSession();
  //@ts-ignore
  const userPicture = session?.data?.user?.picture;

  // console.log("ProjectId = ", id);

  // Function to scroll the Messages div to the bottom after updates
  const scrollToBottom = () => {
    const messagesDiv = document.getElementById("Messages");
    if (messagesDiv) {
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  };

  // Call scrollToBottom on messages update and component mount
  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Dependency array: update only when messages change

  useEffect(() => {
    // @ts-ignore
    setMessages(dummyMessages);
  }, [messages]);

  const handleClick: any = (e: any) => {
    e.preventDefault();
    if (question.length === 0) return;

    // @ts-ignore
    setMessages([...messages, question]);

    const response = axios.post(`/api/dashboard/${id}`, { question });

    console.log("Response = ", response);
  };

  return (
    <div className="flex flex-col p-2 min-h-[90vh]">
      <div
        id="Messages"
        className="flex-grow overflow-y-auto min-h-[80vh] max-h-[80vh]"
      >
        {messages.map((message: any) => (
          <div className="w-full p-2" key={message.id}>
            {/* For User */}
            {message.role === "USER" && (
              <div className="w-full flex flex-row justify-end">
                <div
                  key={message.id}
                  className={`h-auto w-auto rounded-lg p-2 m-2 flex justify-end`}
                >
                  USER = {message.content}
                </div>
                <Avatar>
                  <AvatarImage
                    //@ts-ignore
                    src={userPicture}
                  />
                </Avatar>
              </div>
            )}

            {/* For AI */}
            {message.role === "AI" && (
              <div className="flex flex-row w-full">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                </Avatar>
                <div
                  key={message.id}
                  className={`h-auto w-auto rounded-lg p-2 m-2 flex justify-start`}
                >
                  AI = {message.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div id="Message-Box" className="flex w-full gap-2">
        <Textarea
          placeholder="Type your message here."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button className="h-full" onClick={(e) => handleClick(e)}>
          Send Message
        </Button>
      </div>
    </div>
  );
};

export default Chat;
