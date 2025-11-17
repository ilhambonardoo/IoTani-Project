"use client";
import { usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useState } from "react";
import Navbar from "@/components/Navbar";

const disableNavigation = ["/login", "/register", "/", "/about"];
const showNavigation = ["/"];

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isOpenSideBar, setIsOpenSideBar] = useState(false);

  const toggleSideBar = () => {
    setIsOpenSideBar(!isOpenSideBar);
  };

  return (
    <>
      {showNavigation.includes(pathname) && <Navbar />}
      {!disableNavigation.includes(pathname) && (
        <Sidebar isOpenSideBar={isOpenSideBar} toggleSideBar={toggleSideBar} />
      )}
      {children}
      {!disableNavigation.includes(pathname) && <Footer />}
    </>
  );
};

export default ClientLayout;
