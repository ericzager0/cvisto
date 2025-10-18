import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth: middleware } = NextAuth(authConfig);

export default middleware((req) => {
  if (!req.auth) {
    return Response.redirect(new URL("/sign-in", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/profile", "/job-scanner", "/cvs"],
};
