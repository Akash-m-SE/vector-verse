"use client";

import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "./ui/hero-highlight";
import Link from "next/link";

export function EmptyDashboardState() {
  return (
    <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto h-full w-full"
      >
        You have not created any projects yet to be displayed on your dashboard.
        <br />
        <Link href="/projects">
          <Highlight className="dark:text-green-500 dark:hover:text-white duration-500 text-blue-600 hover:text-black p-2">
            Create a new Project?
          </Highlight>
        </Link>
      </motion.h1>
    </HeroHighlight>
  );
}

export function EmptyMessageState() {
  return (
    <div
      id="empty-state"
      className="flex flex-col items-center justify-center p-2 m-2 gap-2"
    >
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        No Conversations Found!!
      </h1>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center">
        Start your conversation by typing your question in the chat box.
      </h2>
    </div>
  );
}
