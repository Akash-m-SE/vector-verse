"use client";

import React, { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Role } from "@prisma/client";
import { dummyMessages } from "@/utils/dummyData";

import axios from "axios";
import Loading from "../../loading";
import ChatSkeletonLoader from "@/components/ChatSkeletonLoader";
import { MessagesType } from "@/types";

const { USER, AI } = Role;

const EmptyChat: React.FC = () => {
  return (
    <Card>
      {/* TODO:- make this optional when theres no conversation */}
      <CardContent className="flex flex-row items-center justify-center text-center h-[80vh] lg:h-[80vh] xl:h-[81vh]">
        <h2>What can i help you with?</h2>
      </CardContent>
    </Card>
  );
};

interface ChatType {
  id: string;
  className?: string;
}

const ChatComponent: React.FC<ChatType> = ({ id, className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  const [messages, setMessages] = useState<MessagesType[]>([]);
  const [question, setQuestion] = useState<string>("");

  const questionLength = question.trim().length;

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
        const response = await axios.get(`/api/dashboard/${id}/conversation`);
        setMessages(response.data.messages);
      } catch (error) {
        console.log("Error while fetching conversation", error);
      } finally {
        setIsComponentMounted(false);
      }
    };

    fetchConversation();
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (questionLength === 0) return;

    setIsLoading(true);
    scrollToBottom();

    try {
      const response = await axios.post(`/api/dashboard/${id}/conversation`, {
        question,
      });
      const { userMessage, aiMessage } = response.data;

      setMessages((prevMessages) => [...prevMessages, userMessage, aiMessage]);
    } catch (error: any) {
      console.log("Error while posting messages", error);
    } finally {
      setQuestion("");
      setIsLoading(false);
    }
  };

  return (
    <>
      {isComponentMounted && <Loading />}
      <Card className={`flex flex-col ${className}`} id="chat-component">
        {!messages || messages.length === 0 ? (
          <EmptyChat />
        ) : (
          <CardContent className="flex-grow overflow-y-auto overflow-x-hidden w-auto h-[80vh] lg:h-[80vh] xl:h-[82vh]">
            <div className="space-y-4 mt-10">
              {messages?.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                    message?.role === USER
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  {message?.content}
                </div>
              ))}
            </div>
            <ChatSkeletonLoader loading={isLoading} />
            <div id="MessagesEnd"></div>
          </CardContent>
        )}
        <CardFooter id="chat-message-box" className="flex">
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex w-full items-center space-x-2 "
          >
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              value={question}
              disabled={isLoading}
              onChange={(event) => setQuestion(event.target.value)}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || questionLength === 0}
            >
              <Send />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </>
  );
};

export default ChatComponent;
