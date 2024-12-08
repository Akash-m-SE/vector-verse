"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { WavyBackground } from "@/components/ui/wavy-background";
import TypeWriterComponent from "./_components/TypeWriterComponent";
import { signIn } from "next-auth/react";

const page: React.FC = () => {
  return (
    <>
      <WavyBackground className="max-w-4xl mx-auto pb-40 flex flex-col items-center justify-center p-5 gap-5">
        <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center border-b">
          Vector Verse
        </p>

        <TypeWriterComponent />

        <Button
          className="text-semibold text-black"
          onClick={() => signIn("google")}
        >
          <FcGoogle className="mr-2" />
          Sign in with Google
        </Button>
      </WavyBackground>
    </>
  );
};

export default page;
