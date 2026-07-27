import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

/**
 * Edge-safe auth config — used by middleware.ts (which runs on the Edge
 * runtime and cannot use bcrypt). The actual Credentials provider + bcrypt
 * password check lives in auth.ts (Node runtime only) and is merged with
 * this config there. Keep this file free of any Node-only dependencies.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [], // populated in auth.ts
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      const isAdminRoute = pathname.startsWith("/admin");
      const isLoginPage = pathname === "/admin/login";

      if (isAdminRoute && !isLoginPage) {
        // Protect every /admin route except the login page itself.
        return isLoggedIn;
      }

      if (isLoginPage && isLoggedIn) {
        // Already signed in — skip the login form.
        return NextResponse.redirect(new URL("/admin/dashboard", request.nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
