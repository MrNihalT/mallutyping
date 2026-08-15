import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

export async function middleware(request: NextRequest) {
    const response = await updateSession(request);
    const hasSession =
        request.cookies.get("sb-access-token") ||
        request.cookies.get("sb-refresh-token");

    const { pathname, search } = request.nextUrl;
    const protectedPaths = ["/dashboard"];
    const authPaths = ["/login", "/register"];

    if (protectedPaths.some((path) => pathname.startsWith(path)) && !hasSession) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", `${pathname}${search}`);
        return NextResponse.redirect(loginUrl);
    }

    if (authPaths.some((path) => pathname.startsWith(path)) && hasSession) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
