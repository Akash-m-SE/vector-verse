"use client";

import Image from "next/image";
import React from "react";
import logo from "../../public/logo.png";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

const Navbar = () => {
  return (
    <div className="text-white bg-slate-900 h-20 p-4 flex justify-between sticky top-0 opacity-95 ">
      <div id="navbar-icon" className="w-1/3">
        <Link href={"/"}>
          <Image src={logo} alt="logo" height={50} width={50} />
        </Link>
      </div>

      <div
        id="navbar-content"
        className="flex p-2 gap-5 w-1/3 items-center justify-center"
      >
        <Link href={"/"}>Home</Link>
        <Link href={"/"}>About</Link>
        <Link href={"/"}>Contact</Link>
      </div>

      <div id="navbar-avatar" className="m-2 gap-5 flex w-1/3 justify-end">
        <div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <ModeToggle />
        <Button variant="destructive" onClick={() => signOut()}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
