import { NextResponse, NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/types";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
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
        response.cookies.delete("accessToken");
        return response;
      }
    } catch (error) {
      console.error("Token decoding failed:", error);
      isAuthenticated = false;
    }
  }

  const isPublicPath = pathname === "/";

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
