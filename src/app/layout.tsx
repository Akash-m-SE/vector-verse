import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import Providers from "./providers";
import MobileNavBar from "@/components/MobileNavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vector Verse",
  description:
    "Interactively chat with and extract insights from your PDFs using advanced AI in a user-friendly web app.Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <MobileNavBar />
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
