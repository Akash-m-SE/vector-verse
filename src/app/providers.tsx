"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";

interface ProvidersType {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersType> = ({ children }) => {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Providers;
