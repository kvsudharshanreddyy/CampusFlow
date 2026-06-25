import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname === p)) {
    return NextResponse.next();
  }

  // Check for token in cookies or Authorization header
  const token =
    request.cookies.get("cf_token")?.value ||
    request.headers.get("Authorization")?.replace("Bearer ", "");

  // Redirect unauthenticated users to login
  if (!token && pathname.startsWith("/dashboard") || 
      !token && pathname.startsWith("/tasks") ||
      !token && pathname.startsWith("/calendar") ||
      !token && pathname.startsWith("/subjects") ||
      !token && pathname.startsWith("/attendance") ||
      !token && pathname.startsWith("/placement") ||
      !token && pathname.startsWith("/flashcards") ||
      !token && pathname.startsWith("/ai-chat") ||
      !token && pathname.startsWith("/settings") ||
      !token && pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default proxy;

