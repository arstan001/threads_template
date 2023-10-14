// Resource: https://clerk.com/docs/nextjs/middleware#auth-middleware

import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({

  publicRoutes: ["/api/webhook/clerk"],
  ignoredRoutes: ["/api/webhook/clerk"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};