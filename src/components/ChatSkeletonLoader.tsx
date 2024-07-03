import React from "react";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarImage } from "./ui/avatar";

const ChatSkeletonLoader = ({
  loading,
  className,
}: {
  loading: boolean;
  className?: string;
}) => {
  if (!loading) return null;

  return (
    <>
      <div className={`flex gap-2 w-full mb-2 p-2 ${className}`}>
        <div id="Image-Container">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
          </Avatar>
        </div>
        <div id="Skeleton-Container" className="flex flex-col gap-2 m-2">
          {/* <Skeleton className="w-[15vw] h-[20px] rounded-full" />
          <Skeleton className="w-[10vw] h-[20px] rounded-full" />
          <Skeleton className="w-[5vw] h-[20px] rounded-full" /> */}
          <Skeleton className="w-[40vw] h-[20px] rounded-full" />
          <Skeleton className="w-[25vw] h-[20px] rounded-full" />
          <Skeleton className="w-[15vw] h-[20px] rounded-full" />
        </div>
      </div>
    </>
  );
};

export default ChatSkeletonLoader;
