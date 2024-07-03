"use client";

import React from "react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

const loadingStates = [
  {
    text: "Loading your interactive chat...",
  },
  {
    text: "Syncing with the PDF viewer...",
  },
  {
    text: "Take a moment to breathe...",
  },
  {
    text: "Preparing AI chat responses...",
  },
  {
    text: "Don't forget to get up and stretch...",
  },
  {
    text: "Rendering user interface...",
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
