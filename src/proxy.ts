import { auth } from "@/auth"
import { canVolunteerAccessPath } from "@/lib/authz";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/auth/adminlogin", nextUrl));
    }
    
    // Admin has full access
    if (role === 'ADMIN') return;

    if (role === 'VOLUNTEER' && !canVolunteerAccessPath(nextUrl.pathname)) {
      return Response.redirect(new URL("/admin/registrations", nextUrl));
    }

    if (role === 'PARTICIPANT') {
      return Response.redirect(new URL("/dashboard", nextUrl));
    }
  }

  if (isDashboardRoute && !isLoggedIn) {
    return Response.redirect(new URL("/auth/register", nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}
