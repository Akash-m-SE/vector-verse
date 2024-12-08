"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Home,
  LogOut,
  LucideIcon,
  Menu,
  AppWindow,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./ModeToggle";
import { usePathname } from "next/navigation";
import useAppStore from "@/store/store";
import { SelectedComponent } from "@/types";

interface NavLinkProps {
  icon: LucideIcon;
  label: string;
  variant?: "default" | "danger";
  redirectLink?: string;
  onClick?: () => void;
}

const NavLink = ({
  icon: Icon,
  label,
  variant = "default",
  redirectLink,
  onClick,
}: NavLinkProps) => {
  const commonStyles = `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
    variant === "danger"
      ? "text-red-500 dark:text-red-400 hover:bg-red-900/20 dark:hover:bg-red-800/20"
      : "text-black dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-800"
  }`;

  return onClick ? (
    <button
      onClick={onClick}
      className={`${commonStyles} w-full`}
      type="button"
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  ) : (
    <a href={redirectLink} className={commonStyles}>
      <Icon size={20} />
      <span>{label}</span>
    </a>
  );
};

const OtherLinks: React.FC = () => {
  const { setSelectedComponent } = useAppStore();

  return (
    <>
      {/* TODO :- add css for hiding/showing the pdf/chat */}
      <div
        className="border-t border-b border-gray-800 pt-4 space-y-1 hover:cursor-pointer mb-5 mt-5"
        id="others-links"
      >
        <NavLink
          icon={FileText}
          label="Pdf"
          onClick={() => setSelectedComponent(SelectedComponent.PDF)}
        />

        <NavLink
          icon={MessageSquare}
          label="Chat"
          onClick={() => setSelectedComponent(SelectedComponent.CHAT)}
        />
      </div>
    </>
  );
};

const UserProfile: React.FC = () => {
  const [loggedInUserPicture, setLoggedInUserPicture] = useState(
    "https://github.com/shadcn.png",
  );

  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      setLoggedInUserPicture(session?.user?.picture as string);
    }
  }, [status]);

  return (
    <div className="flex items-center space-x-3 w-fit">
      <Avatar>
        <AvatarImage src={loggedInUserPicture} />
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{session?.user?.name}</span>
        <span className="text-xs text-gray-400">{session?.user?.email}</span>
      </div>
    </div>
  );
};

const MobileNavBar: React.FC = () => {
  const pathName = usePathname();

  if (pathName === "/sign-in") return;

  return (
    <>
      <div className="px-4 py-3 bg-[#1a1a1a] block lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="p-2 rounded-lg hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </Button>
          </SheetTrigger>

          <SheetContent
            className="w-[300px] border-gray-800 flex flex-col justify-between"
            side={"left"}
          >
            <div>
              <SheetHeader>
                <SheetTitle>Vector Verse</SheetTitle>
                <SheetDescription>
                  Interactively chat with and extract insights from your PDFs
                </SheetDescription>
              </SheetHeader>

              <div className="mt-8 space-y-6" id="pages-navlinks">
                <div className="space-y-1">
                  <NavLink icon={Home} label="Home" redirectLink="/" />
                  <NavLink
                    icon={AppWindow}
                    label="Dashboard"
                    redirectLink="/dashboard"
                  />
                </div>
              </div>

              {/* Conditional rendering pdf and chat */}
              <OtherLinks />
            </div>
            <div id="Sheet-Footer-Component">
              <div className="border-t border-gray-800 space-y-1 hover:cursor-pointer mb-2 pt-3">
                <ModeToggle /> <span>Toggle Theme</span>
                <NavLink
                  icon={LogOut}
                  label="Log out"
                  variant="danger"
                  onClick={() => signOut()}
                />
              </div>

              <div
                className="border-t border-gray-800 pt-4"
                id="profile-section"
              >
                <UserProfile />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default MobileNavBar;
