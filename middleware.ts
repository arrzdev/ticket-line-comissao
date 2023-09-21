import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "@/app/lib/auth";

const AUTH_PAGES = ["/"];

const isAuthPages = (url:string) => AUTH_PAGES.some((page) => page.startsWith(url));

export async function middleware(request: NextRequest) {
  const { url, nextUrl, cookies } = request;
  const { value: token } = cookies.get("t") ?? { value: null };

  const hasVerifiedToken = token && (await verifyJwtToken(token));
  const isAuthPageRequested = isAuthPages(nextUrl.pathname);

  if (isAuthPageRequested) {
    if (!hasVerifiedToken) {
      const response = NextResponse.next();
      response.cookies.delete("t");
      return response;
    }

    const response = NextResponse.redirect(new URL(`/host`, url));
    return response;
  }

  if (!hasVerifiedToken) {
    const response = NextResponse.redirect(
      new URL(`/`, url)
    );
    response.cookies.delete("t");

    return response;
  }

  return NextResponse.next();
}

export const config = { matcher: ["/", "/host"] };
