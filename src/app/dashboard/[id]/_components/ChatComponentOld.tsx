"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { dummyMessages } from "@/utils/dummyData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import axios from "axios";
import { EmptyMessageState } from "@/components/EmptyState";
import ChatSkeletonLoader from "@/components/ChatSkeletonLoader";
import Loading from "@/app/dashboard/loading";
import { Role } from "@prisma/client";
import { MessagesType } from "@/types";

interface ChatType {
  id: string;
}

const ChatComponent: React.FC<ChatType> = ({ id }) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<MessagesType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  const session = useSession();
  const userPicture = session?.data?.user?.picture;

  const scrollToBottom = () => {
    const messagesEnd = document.getElementById("MessagesEnd");
    if (messagesEnd) {
      messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await axios.get(`/api/projects/${id}/conversation`);
        setMessages(response.data.messages);
      } catch (error) {
        console.log("Error while fetching conversation", error);
      } finally {
        setIsComponentMounted(false);
      }
    };

    fetchConversation();
  }, [setMessages, id]);

  const handleClick = async (e: any) => {
    e.preventDefault();

    if (question.length === 0) return;

    setIsLoading(true);
    scrollToBottom();

    try {
      const response = await axios.post(`/api/projects/${id}/conversation`, {
        question,
      });

      const { userMessage, aiMessage } = response.data;

      setMessages((prevMessages) => [...prevMessages, userMessage, aiMessage]);
    } catch (error) {
      console.log("Error while posting messages", error);
    } finally {
      setQuestion("");
      setIsLoading(false);
    }
  };

  return (
    <>
      {isComponentMounted && <Loading />}
      <div className="flex flex-col p-2 min-h-[90vh]">
        <div
          id="Messages"
          className={`${messages.length === 0 && "flex flex-col"} flex-grow overflow-y-auto min-h-[80vh] max-h-[80vh] items-center justify-center`}
        >
          {messages.length === 0 ? (
            <>
              <div className="flex-grow w-full" id="skeleton">
                <ChatSkeletonLoader loading={isLoading} />
              </div>
              <div className="flex-grow items-center justify-content-start w-full">
                <EmptyMessageState />
              </div>
            </>
          ) : (
            <>
              {messages.map((message: MessagesType) => (
                <div className="w-full p-2" key={message.id}>
                  {/* For User */}
                  {message.role === Role.USER && (
                    <div className="w-full flex flex-row justify-end">
                      <div
                        key={message.id}
                        className={`h-auto w-auto rounded-lg p-2 m-2 flex justify-end text`}
                      >
                        {message.content}
                      </div>
                      <Avatar>
                        <AvatarImage src={userPicture ? userPicture : ""} />
                      </Avatar>
                    </div>
                  )}

                  {/* For AI */}
                  {message.role === Role.AI && (
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

              <ChatSkeletonLoader loading={isLoading} />
            </>
          )}

          <div id="MessagesEnd"></div>
        </div>

        <div id="Message-Box" className="flex w-full gap-2">
          <Textarea
            placeholder="Type your message here."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div className="flex items-end">
            <Button disabled={isLoading} onClick={(e) => handleClick(e)}>
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatComponent;
