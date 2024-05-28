import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // ...add more providers here
  ],

  adapters: PrismaAdapter(prisma),

  pages: {
    signIn: "/sign-in",
  },

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },
};

export default NextAuth(authOptions);
