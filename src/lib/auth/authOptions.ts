import { login, loginWithGoogle } from "@/lib/db/firebase/service";
import { compare } from "bcrypt";
import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { LoginUserData, ExtendedToken, ExtendedSession } from "@/types";

type LoginUser = LoginUserData;

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "Email" },
        password: { label: "Password", type: "Password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        const user = (await login({ email })) as LoginUser | null;
        if (user) {
          const passwordConfirm = await compare(password, user.password);
          if (passwordConfirm) {
            return user;
          }
          return null;
        } else {
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      const extendedToken = token as JWT & ExtendedToken;
      if (account?.provider === "credentials" && user) {
        extendedToken.email = user.email ?? null;
        extendedToken.fullName = (user as LoginUser).fullName;
        extendedToken.role = (user as LoginUser).role;
      }
      if (account?.provider === "google" && user && user.email) {
        const data = {
          fullName: user.name || "",
          email: user.email,
          type: "google",
        };

        const result = await loginWithGoogle(data);
        if (result.status) {
          extendedToken.email = result.data.email ?? null;
          extendedToken.fullName = result.data.fullName;
          extendedToken.role = result.data.role;
        }
      }
      return extendedToken;
    },
    async session({ session, token }) {
      const extendedSession = session as Session & ExtendedSession;
      const extendedToken = token as JWT & ExtendedToken;
      if (extendedSession.user) {
        if ("email" in extendedToken && extendedToken.email !== undefined) {
          extendedSession.user.email = extendedToken.email;
        }
        if (
          "fullName" in extendedToken &&
          extendedToken.fullName !== undefined
        ) {
          extendedSession.user.fullName = extendedToken.fullName;
        }
        if ("role" in extendedToken && extendedToken.role !== undefined) {
          extendedSession.user.role = extendedToken.role;
        }
      }
      return extendedSession;
    },
  },
  pages: {
    signIn: "/login",
  },
};
