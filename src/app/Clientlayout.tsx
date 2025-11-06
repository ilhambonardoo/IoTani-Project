"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useState } from "react";

const disableNavigation = ["/login", "/register", "/", "/about"];

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isOpenSideBar, setIsOpenSideBar] = useState(false);

  const toggleSideBar = () => {
    setIsOpenSideBar(!isOpenSideBar);
  };

  return (
    <>
      {!disableNavigation.includes(pathname) && (
        <Sidebar isOpenSideBar={isOpenSideBar} toggleSideBar={toggleSideBar} />
      )}
      {children}
      {!disableNavigation.includes(pathname) && <Footer />}
    </>
  );
};

export default ClientLayout;
