import { users } from "@/lib/mockUsers";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; 
      name?: string | null;
      email?: string | null;
    };
  }

  interface JWT {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = users.find(
          (u) =>
            u.email === credentials?.email &&
            u.password === credentials?.password
        );
        if (user)
          return { id: user.id.toString(), email: user.email, name: user.name };
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: "supersecret-key-2025-09-27",
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = String(user.id); 
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = String(token.id); 
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
