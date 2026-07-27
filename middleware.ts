import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/** Protects every /admin route (see authConfig.callbacks.authorized). Edge runtime — no bcrypt here. */
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*"],
};
