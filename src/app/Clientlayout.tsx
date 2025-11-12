"use client";
import { usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useState } from "react";

const disableNavigation = ["/login", "/register", "/"];

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
