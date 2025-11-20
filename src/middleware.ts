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
  "/edukasi",
  "/templates",
  "/message",
  "/profile",
  "/dashboard_admin",
  "/user-management",
  "/admin-message",
  "/content",
  "/export",
  "/operational",
  "/dashboard_owner",
  "/owner-message",
]);
