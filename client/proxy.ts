import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/types";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  let isAuthenticated = false;

  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp > currentTime) {
        isAuthenticated = true;
      } else {
        const response = NextResponse.next();
        response.cookies.delete("access_token");
        return response;
      }
    } catch (error) {
      console.error("Token decoding failed:", error);
      isAuthenticated = false;
    }
  }

  const guestOnlyRoutes = ["/login", "/register"];

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (guestOnlyRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
