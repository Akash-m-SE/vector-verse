import NextAuth, { NextAuthOptions, SessionStrategy } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 10 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token }: any) {
      // console.log("JWT callback jwt token = ", token);

      return { ...token };
    },

    async session({ session, token }: any) {
      session.user = token;
      // session.user = {
      //   ...session.user,
      //   sub: token.sub, // Explicitly add sub from the token
      //   id: token.sub, // Also add as id for consistency
      // };
      // console.log("Session = ", session, "session token = ", token);
      return session;
    },

    async redirect({ baseUrl }: any) {
      // console.log("baseurl = ", baseUrl);
      return baseUrl;
    },
  },
};

export default NextAuth(authOptions);
