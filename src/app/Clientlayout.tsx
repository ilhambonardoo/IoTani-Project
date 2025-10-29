"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const disableNavigation = ["/login", "/register", "/"];

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  return (
    <>
      {!disableNavigation.includes(pathname) && <Sidebar />}
      {children}
      {!disableNavigation.includes(pathname) && <Footer />}
    </>
  );
};

export default ClientLayout;
