import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { db } from '@/db';
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

        const userSnapshot = await db.collection('users').where('email', '==', credentials.email).limit(1).get();
        if (userSnapshot.empty) return null;
        const userDoc = userSnapshot.docs[0];
        const user = { id: userDoc.id, ...userDoc.data() } as any;

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
        const userSnapshot = await db.collection('users').where('email', '==', user.email).limit(1).get();
        if (userSnapshot.empty) {
          try {
            await db.collection('users').add({
              name: user.name as string,
              email: user.email as string,
              role: 'PARTICIPANT',
              createdAt: new Date().toISOString(),
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
        const userSnapshot = await db.collection('users').where('email', '==', token.email).limit(1).get();
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();
          token.role = userData.role ?? 'PARTICIPANT';
          token.id = userDoc.id;
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
