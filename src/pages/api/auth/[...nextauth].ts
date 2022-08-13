import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { dbUsers } from '@/database/user';


export default NextAuth({
  // Configure one or more authentication providers
  providers: [

    // ...add more providers here

    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo:', type: 'email', placeholder: 'correo@google.com' },
        password: { label: 'Contraseña:', type: 'password', placeholder: 'Contraseña' },
      },
      async authorize(credentials) {
        // return { name: 'Juan', correo: 'juan@google.com', role: 'admin' };

        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);

      }
    }),


  ],

  // Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  session: {
    maxAge: 2592000, /// 30d
    strategy: 'jwt',
    updateAge: 86400, // cada día

  },


  callbacks: {

    async jwt({ token, account, user }) {

      if (account) {
        token.accessToken = user?.access_token;

        switch (account.type) {

          case 'credentials':
            token.user = user;
            break;
        }

      }

      //console.log(token)

      return token;
    },


    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    }


  }

});