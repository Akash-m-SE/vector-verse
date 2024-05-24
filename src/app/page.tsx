"use client";

import { Cards } from "@/components/Cards";

export default function Home() {
  return (
    <main className="flex max-h-screen w-full flex-col items-center justify-between p-24">
      Hello this is home page
      <Cards />
    </main>
  );
}
