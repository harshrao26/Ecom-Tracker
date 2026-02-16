import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-default-secret-change-in-production";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

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
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      if (!matchingRoute.roles.includes(decoded.role)) {
        // Forbidden - redirect based on role or to home
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      // Invalid token
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect from login if already authenticated
  if (pathname === "/login" && token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.role === "super-admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (e) {
      // Ignore
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login"],
};
