import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Get the auth cookie/token
  // Note: For this to work with your Gateway, ensure your login API sets a cookie
  // If you only use LocalStorage, middleware cannot see it. You would need to set
  // a 'is_logged_in' cookie during login.
  const authCookie = request.cookies.get("is_logged_in")?.value;
  const { pathname } = request.nextUrl;

  const userStore = request.cookies.get("gusto-auth-storage")?.value;
  const userData = userStore ? JSON.parse(userStore).state.user : null;

  if (
    pathname.startsWith("/admin") &&
    (!userData || !userData.roles.includes("admin"))
  ) {
    return NextResponse.redirect(new URL("/menu", request.url));
  }

  // 2. Define your route groups
  const authRoutes = ["/login", "/register"];
  const protectedRoutes = ["/profile", "/orders", "/notifications"];

  // 3. Logic for logged-in users
  if (authCookie && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/menu", request.url));
  }

  // 4. Logic for guests (not logged in)
  if (!authCookie && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// 5. Only run middleware on specific paths
export const config = {
  matcher: ["/login", "/register", "/profile", "/orders", "/notifications"],
};
