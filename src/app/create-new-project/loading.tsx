"use client";

import React from "react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

const loadingStates = [
  {
    text: "Initializing new project...",
  },
  {
    text: "Setting up your workspace...",
  },
  {
    text: "Take a moment to breathe...",
  },
  {
    text: "Configuring project settings...",
  },
  {
    text: "Loading AI assistant tools...",
  },
  {
    text: "Don't forget to get up and stretch...",
  },
  {
    text: "Almost ready...",
  },
];

export default function Loading() {
  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={true}
        duration={2000}
      />
    </div>
  );
}
