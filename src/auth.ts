import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/utils/db/prisma-db";

const adapter = PrismaAdapter(
  prisma as unknown as Parameters<typeof PrismaAdapter>[0]
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  providers: [Google],
  pages: {
    signIn: "/login",
  },
});
