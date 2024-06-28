"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { LampContainer } from "../../../components/ui/lamp";

const page = () => {
  return (
    <>
      <LampContainer className="h-full">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl light:text-white">
          Sign In With Your Credentials
        </h1>
        <Button
          className="mt-10 w-[10vw] h-[5vh] flex items-center justify-center font-semibold"
          onClick={() => signIn("google")}
        >
          <FcGoogle className="mr-3 w-full" />
          <span className="light:text-white">Sign In With Google</span>
        </Button>
      </LampContainer>
    </>
  );
};

export default page;
