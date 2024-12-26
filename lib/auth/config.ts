import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from '@/lib/supabase/config';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;
          
          const { data: { user }, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error || !user) {
            console.error('Auth error:', error);
            return null;
          }

          // Fetch user data including role and batch
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select(`
              id,
              email,
              name,
              role,
              batch_id,
              batches:batch_id (
                id,
                name,
                year
              )
            `)
            .eq('id', user.id)
            .single();

          if (userError) {
            console.error('User data error:', userError);
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: userData?.name,
            role: userData?.role,
            batch: userData?.batches,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.batch = user.batch;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.batch = token.batch as any;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};