import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

// Define the auth options
export const authOptions: NextAuthOptions = {
  providers: [

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (credentials?.email === 'user@example.com' && credentials?.password === 'password') {
          return { id: '1', name: 'User', email: 'user@example.com' }; // Mock user
        } else {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt', // Use JWT-based sessions
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, // JWT secret
  },
   pages: {
     signIn: '/SignIn', // Custom sign-in page (optional)
     error: '/auth/error',   // Custom error page (optional)

   },
};

 const handler = NextAuth(authOptions);
export {handler as GET, handler as POST}
