import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // in dev it is next-auth and in prod it is __Secure-next-auth
  const isLoggedIn =
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token");
  const currentPathName = request.nextUrl.pathname;

  // Preventing people from manually visiting the sign-in page
  if (isLoggedIn && currentPathName === "/sign-in") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Checking if user is logged out but excluding the signin page to prevent redirect loop
  if (!isLoggedIn && currentPathName !== "/sign-in") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/create-new-project", "/dashboard/:path*", "/sign-in"],
};
