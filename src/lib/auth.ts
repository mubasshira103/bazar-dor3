import { betterAuth } from 'better-auth';
import { MongoClient } from 'mongodb';
import { mongodbAdapter } from '@better-auth/mongo-adapter';

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db('bazar-dor33');

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),
});

// import { betterAuth } from 'better-auth';
// import { mongodbAdapter } from 'better-auth/adapters/mongodb';
// import { MongoClient } from 'mongodb';

// const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bazardor';
// const client = new MongoClient(uri);
// const dbName = (() => {
//   try {
//     return new URL(uri).pathname.replace(/^\//, '').split('?')[0] || 'bazardor';
//   } catch {
//     return 'bazardor';
//   }
// })();
// const db = client.db(dbName);
// export const auth = betterAuth({
//   appName: 'বাজার দর',
//   baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
//   secret:
//     process.env.BETTER_AUTH_SECRET || 'development-only-change-this-secret-before-deploying-123456',
//   database: mongodbAdapter(db, { client }),
//   emailAndPassword: { enabled: true },
//   socialProviders: {
//     ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
//       ? {
//           google: {
//             clientId: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//           },
//         }
//       : {}),
//     ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
//       ? {
//           github: {
//             clientId: process.env.GITHUB_CLIENT_ID,
//             clientSecret: process.env.GITHUB_CLIENT_SECRET,
//           },
//         }
//       : {}),
//   },
//   user: { changeEmail: { enabled: false } },
// });
