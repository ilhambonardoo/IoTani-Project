"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useState } from "react";
import Navbar from "./Navbar";

const disableSidebar = ["/login", "/register", "/", "/about"];
const showNavbar = ["/"];

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isOpenSideBar, setIsOpenSideBar] = useState(false);

  const toggleSideBar = () => {
    setIsOpenSideBar(!isOpenSideBar);
  };

  return (
    <>
      {!disableSidebar.includes(pathname) && (
        <Sidebar isOpenSideBar={isOpenSideBar} toggleSideBar={toggleSideBar} />
      )}
      {showNavbar.includes(pathname) && <Navbar />}
      {children}
      {!disableSidebar.includes(pathname) && <Footer />}
    </>
  );
};

export default ClientLayout;
