"use client";

import { Cards } from "@/components/Cards";
import { useSession } from "next-auth/react";

export default function Home() {
  const user = useSession();
  console.log(user);

  //@ts-ignore
  // const userId = user?.data?.user?.sub;
  // console.log("User Database Id = ", userId);

  return (
    <main className="flex max-h-screen w-full flex-col items-center justify-between p-24">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Welcome To Your Home Page
      </h2>
      <Cards />
    </main>
  );
}
