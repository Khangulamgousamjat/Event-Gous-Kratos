import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { getRequestIp, applyRateLimit } from '@/lib/rate-limit';

type AppUser = {
  id: string;
  name: string;
  email: string;
  role: 'PARTICIPANT' | 'ADMIN' | 'VOLUNTEER';
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) return null;

        const rateLimitResult = applyRateLimit({
          namespace: 'staff-login',
          identifier: getRequestIp(request),
          limit: 8,
          windowMs: 10 * 60 * 1000,
        });

        if (!rateLimitResult.allowed) {
          return null;
        }

        const [user] = await db.select().from(users).where(eq(users.email, credentials.email as string));

        if (!user || !user.password) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordCorrect) return null;

        if (user.role !== 'ADMIN' && user.role !== 'VOLUNTEER') {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        } satisfies AppUser;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existingUser = await db.select().from(users).where(eq(users.email, user.email as string)).limit(1);
        if (existingUser.length === 0) {
          try {
            await db.insert(users).values({
              name: user.name as string,
              email: user.email as string,
              role: 'PARTICIPANT',
            });
          } catch (error) {
            console.error('Failed to sync Google user to database:', error);
            return false;
          }
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === 'google') {
        const existingUser = await db.select().from(users).where(eq(users.email, token.email as string)).limit(1);
        if (existingUser.length > 0) {
          token.role = existingUser[0].role ?? 'PARTICIPANT';
          token.id = existingUser[0].id;
        } else {
          token.role = 'PARTICIPANT';
        }
      } else if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id && token.role) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  session: { strategy: 'jwt' },
});
