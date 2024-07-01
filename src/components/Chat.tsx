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
import { EmptyMessageState } from "./EmptyState";

const Chat = ({ id }: { id: string }) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  //@ts-ignore
  const userPicture = session?.data?.user?.picture;

  // Function to scroll the Messages div to the bottom after updates
  const scrollToBottom = () => {
    const messagesDiv = document.getElementById("Messages");
    if (messagesDiv) {
      messagesDiv.scrollTo({
        top: messagesDiv.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Dependency array: update only when messages change

  useEffect(() => {
    const fetchConversation = async () => {
      const response = await axios.get(`/api/dashboard/${id}/conversation`);

      // console.log("Response = ", response);

      setMessages(response.data.messages);
    };

    fetchConversation();
  }, [setMessages, id]);

  const handleClick = async (e: any) => {
    try {
      setIsLoading(true);
      e.preventDefault();

      console.log("button clicked");

      if (question.length === 0) return;

      const response = await axios.post(`/api/dashboard/${id}`, { question });

      console.log("Response = ", response);

      const { userMessage, aiMessage } = response.data;

      //@ts-ignore
      setMessages([...messages, userMessage, aiMessage]);
    } catch (error) {
      console.log("Error while posting messages", error);
    } finally {
      setQuestion("");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-2 min-h-[90vh]">
      <div
        id="Messages"
        className={`${messages.length === 0 && "flex flex-col"} flex-grow overflow-y-auto min-h-[80vh] max-h-[80vh] items-center justify-center`}
      >
        {messages.length === 0 && <EmptyMessageState />}

        {messages.map((message: any) => (
          <div className="w-full p-2" key={message.id}>
            {/* For User */}
            {message.role === "USER" && (
              <div className="w-full flex flex-row justify-end">
                <div
                  key={message.id}
                  className={`h-auto w-auto rounded-lg p-2 m-2 flex justify-end text`}
                >
                  {message.content}
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
                  {message.content}
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
        <Button
          className="h-full"
          disabled={isLoading}
          onClick={(e) => handleClick(e)}
        >
          Send Message
        </Button>
      </div>
    </div>
  );
};

export default Chat;
