import { NextResponse } from "next/server";
import withAuth from "./middlewares/withAuth";

export async function mainMiddleware() {
  const res = NextResponse.next();
  return res;
}

export default withAuth(mainMiddleware, [
  "/dashboard",
  "/data",
  "/camera",
  "/forum",
  "/message",
  "/profile",
  "/dashboard_admin",
  "/user-management",
  "/inbox",
  "/content",
  "/export",
  "/operational",
  "/dashboard_owner",
]);
