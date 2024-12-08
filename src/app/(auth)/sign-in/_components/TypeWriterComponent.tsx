"use client";

import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

const TypeWriterComponent = () => {
  const words = [
    {
      text: "your",
    },
    {
      text: "personal",
    },
    {
      text: "knowledge",
    },
    {
      text: "Companion.",
      className: "text-green-900 dark:text-green-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-auto">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base text-center">
        Bridge the gap between information and understanding, transforming your
        PDFs into an interactive assistant that's always ready to help.
      </p>
      <TypewriterEffectSmooth words={words} />
    </div>
  );
};

export default TypeWriterComponent;
