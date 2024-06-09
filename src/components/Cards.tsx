"use client";

import { HoverEffect } from "./ui/card-hover-effect";

interface CardsProps {
  title: string;
  description: string;
  link: string;
}

export function Cards({ redirectLinks }: { redirectLinks: CardsProps[] }) {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={redirectLinks} />
    </div>
  );
}
