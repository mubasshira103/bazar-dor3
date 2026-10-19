// 'use client';
// import { createAuthClient } from 'better-auth/react';
// export const authClient = createAuthClient({
//   baseURL:
//     typeof window !== 'undefined'
//       ? window.location.origin
//       : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
// });
// export const { signIn, signUp, signOut, useSession } = authClient;
import { createAuthClient } from 'better-auth/react';
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.BETTER_AUTH_URL,
});
export const { signIn, signUp, signOut, useSession } = createAuthClient();
