"use client";

import { Links } from "@/app/page";
import { HoverEffect } from "./ui/card-hover-effect";

export function Cards() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={Links} />
    </div>
  );
}
