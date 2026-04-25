import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => Boolean(token),
  },
  pages: {
    signIn: "/auth/sign-in",
  },
});

export const config = {
  matcher: ["/user/:path*"],
};

