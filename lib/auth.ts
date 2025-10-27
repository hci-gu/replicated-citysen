import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const emailServer =
  process.env.EMAIL_SERVER_HOST &&
  process.env.EMAIL_SERVER_USER &&
  process.env.EMAIL_SERVER_PASSWORD
    ? {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      }
    : undefined;

const emailProvider = EmailProvider({
  server: emailServer,
  from: process.env.EMAIL_FROM ?? "CitySen <noreply@citysen.local>",
  ...(emailServer
    ? {}
    : {
        sendVerificationRequest: async ({ url, identifier }: { url: string; identifier: string }) => {
          console.info(`Magic link for ${identifier}: ${url}`);
        }
      })
});

const googleProvider =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      })
    : null;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database"
  },
  providers: [emailProvider, googleProvider].filter(Boolean) as NextAuthOptions["providers"],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  }
};
