"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

const disableNavigation = ["/login", "/register"];

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  return (
    <>
      {!disableNavigation.includes(pathname) && <Navbar />}
      {children}
      {!disableNavigation.includes(pathname) && <Footer />}
    </>
  );
};

export default ClientLayout;
