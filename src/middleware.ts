import { NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "@/lib/auth"

const PROTECTED_PATHS = ["/admin"]
const ADMIN_API_PATHS = ["/api/projects"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isAdminPage = PROTECTED_PATHS.some((p) => pathname.startsWith(p))
  const isAdminApi =
    ADMIN_API_PATHS.some((p) => pathname.startsWith(p)) &&
    req.method !== "GET"

  if (!isAdminPage && !isAdminApi) return NextResponse.next()

  // Login page is public
  if (pathname === "/admin/login") return NextResponse.next()

  const token =
    req.cookies.get("admin_token")?.value ??
    req.headers.get("authorization")?.replace("Bearer ", "")

  if (!token) {
    if (isAdminPage) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await verifyJwt(token)
    return NextResponse.next()
  } catch {
    if (isAdminPage) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/projects/:path*"],
}
