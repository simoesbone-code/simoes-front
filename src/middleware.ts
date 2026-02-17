import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loginURL = new URL("/auth?auth=login", request.url);

  const adminToken = request.cookies.get("nextauth.token")?.value;
  const adminUserId = request.cookies.get("nextauth.userId")?.value;

  const clientToken = request.cookies.get("nextauth.token.client")?.value;
  const clientUserId = request.cookies.get("nextauth.userId.client")?.value;

  // Verifica se está acessando rota de admin ou client
  const pathParts = pathname.split("/");

  const isAdminRoute = pathname.startsWith("/dashboard/admin/");
  const isClientRoute = pathname.startsWith("/dashboard/client/");

  const routeId = pathParts[3];

  // ADMIN
  if (isAdminRoute) {
    if (!adminToken || !adminUserId || adminUserId !== routeId) {
      return NextResponse.redirect(loginURL);
    }
    return NextResponse.next();
  }

  // CLIENT
  if (isClientRoute) {
    if (!clientToken || !clientUserId || clientUserId !== routeId) {
      return NextResponse.redirect(loginURL);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/admin/:id*"],
};
