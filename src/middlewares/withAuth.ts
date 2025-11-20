import { getToken } from "next-auth/jwt";
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

const onlyAdminPage = [
  "/dashboard_admin",
  "/user-management",
  "/content",
  "/admin-message",
  "/templates",
  "/chilies",
];
const onlyOwnerPage = [
  "/dashboard_owner",
  "/export",
  "/operational",
  "/owner-message",
];
const onlyUserPage = ["/message", "/edukasi"];
const guestPages = ["/", "/login", "/register"];

export default function withAuth(
  middleware: NextMiddleware,
  requireAuth: string[] = []
) {
  return async (req: NextRequest, next: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname;
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const isAuth = !!token;
    const userRole = token?.role || "";

    if (requireAuth.includes(pathname)) {
      if (!isAuth) {
        const url = new URL("/login", req.url);
        url.searchParams.set("callbackUrl", encodeURI(req.url));
        return NextResponse.redirect(url);
      }

      // Redirect jika user mencoba akses page yang bukan untuk role mereka
      if (onlyAdminPage.includes(pathname) && userRole !== "admin") {
        if (userRole === "owner") {
          return NextResponse.redirect(new URL("/dashboard_owner", req.url));
        }
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      if (onlyOwnerPage.includes(pathname) && userRole !== "owner") {
        if (userRole === "admin") {
          return NextResponse.redirect(new URL("/dashboard_admin", req.url));
        }
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      if (onlyUserPage.includes(pathname) && userRole !== "user") {
        if (userRole === "admin") {
          return NextResponse.redirect(new URL("/dashboard_admin", req.url));
        }
        if (userRole === "owner") {
          return NextResponse.redirect(new URL("/dashboard_owner", req.url));
        }
      }
    }

    if (guestPages.includes(pathname)) {
      if (isAuth) {
        if (token.role == "admin") {
          return NextResponse.redirect(new URL("/dashboard_admin", req.url));
        }
        if (token.role == "owner") {
          return NextResponse.redirect(new URL("/dashboard_owner", req.url));
        }
        if (token.role == "user") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }
    }
    return middleware(req, next);
  };
}
