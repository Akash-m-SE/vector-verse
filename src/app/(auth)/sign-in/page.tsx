"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { LampContainer } from "../../../components/ui/lamp";
import logo from "../../../../public/logo.png";
import Image from "next/image";

const page: React.FC = () => {
  return (
    <>
      <LampContainer>
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.1,
            duration: 0.8,
            ease: "easeInOut",
          }}
        >
          <Image
            src={logo}
            alt="Vector Verse Logo"
            width={200}
            height={200}
            className="w-full h-full rounded-lg"
          />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl m-10"
        >
          Welcome to Vector Verse
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
        >
          Sign In With Your Credentials
        </motion.h2>
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.7,
            duration: 0.8,
            ease: "easeInOut",
          }}
        >
          <Button
            className="mt-10 w-[10vw] h-[5vh] flex items-center justify-center font-semibold"
            onClick={() => signIn("google")}
          >
            <FcGoogle className="mr-3 w-full" />
            <span className="light:text-white">Sign In With Google</span>
          </Button>
        </motion.div>
      </LampContainer>
    </>
  );
};

export default page;
