import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-here-make-it-long-and-random-change-in-production";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;
  const secret = new TextEncoder().encode(JWT_SECRET);

  console.log(`[MIDDLEWARE] Handling request: ${pathname}`);

  // Define protected routes and their required roles
  const protectedRoutes = [
    { path: "/admin", roles: ["super-admin"] },
    { path: "/dashboard", roles: ["user", "admin", "super-admin"] },
  ];

  const matchingRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route.path),
  );

  if (matchingRoute) {
    if (!token) {
      console.log(`[MIDDLEWARE] No token for protected route ${pathname}. Redirecting to login.`);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;

      if (!matchingRoute.roles.includes(role)) {
        console.warn(`[MIDDLEWARE] Access denied for role ${role} on ${pathname}. Required: ${matchingRoute.roles}`);
        return NextResponse.redirect(new URL("/", request.url));
      }
      
      console.log(`[MIDDLEWARE] Authorized: ${pathname} (Role: ${role})`);
    } catch (error: any) {
      console.error(`[MIDDLEWARE] JWT Verification failed for ${pathname}: ${error.message}`);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      // Clear cookie if invalid
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("auth_token");
      return response;
    }
  }

  // Handle redundant login access
  if (pathname === "/login" && token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;
      console.log(`[MIDDLEWARE] Already authenticated (Role: ${role}). Redirecting from login.`);
      
      if (role === "super-admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (e) {
      // Invalid token, allow login page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login"],
};
