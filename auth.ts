import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

/**
 * Full Auth.js config (Node runtime — route handlers & server actions only,
 * never imported by middleware.ts). Single hardcoded admin account, sourced
 * entirely from environment variables — there is no user database and no
 * signup flow by design.
 *
 * Required env vars (see .env.local.example):
 *   AUTH_SECRET          — random string used to sign session JWTs
 *   ADMIN_EMAIL           — the one admin's login email
 *   ADMIN_PASSWORD_HASH   — bcrypt hash of the admin's password
 *                            (generate with `node scripts/generate-admin-hash.mjs`)
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : undefined;
        const password = typeof credentials?.password === "string" ? credentials.password : undefined;

        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!email || !password || !adminEmail || !adminPasswordHash) {
          return null;
        }
        if (email !== adminEmail) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(password, adminPasswordHash);
        if (!isValidPassword) {
          return null;
        }

        // Single static admin identity — no database record to return.
        return { id: "admin", email: adminEmail, name: "Admin" };
      },
    }),
  ],
});
