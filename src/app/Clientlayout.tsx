"use client";
import { usePathname } from "next/navigation";
import { Sidebar, Footer } from "@/components/layout";
import { useState, useEffect, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { DISABLE_NAVIGATION_ROUTES } from "@/constants";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isOpenSideBar, setIsOpenSideBar] = useState(false);
  const [isNotFoundPage, setIsNotFoundPage] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkNotFound = () => {
      if (mainRef.current) {
        const notFoundElement = mainRef.current.querySelector(
          '[data-not-found="true"]'
        );
        setIsNotFoundPage(!!notFoundElement);
      }
    };

    const observer = new MutationObserver(checkNotFound);

    if (mainRef.current) {
      observer.observe(mainRef.current, {
        childList: true,
        subtree: true,
      });
      checkNotFound();
    }

    const timer = setTimeout(checkNotFound, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [pathname]);

  const showSidebar =
    !(DISABLE_NAVIGATION_ROUTES as readonly string[]).includes(pathname) &&
    !isNotFoundPage;

  const toggleSideBar = () => {
    setIsOpenSideBar(!isOpenSideBar);
  };

  return (
    <>
      {showSidebar && (
        <>
          <Sidebar
            isOpenSideBar={isOpenSideBar}
            toggleSideBar={toggleSideBar}
          />
          <button
            onClick={toggleSideBar}
            className="fixed top-4 left-4 z-30 md:hidden rounded-lg bg-white p-3 shadow-lg border border-neutral-200 text-neutral-700 hover:text-green-600 hover:bg-green-50 transition-colors"
            aria-label="Toggle menu"
          >
            <GiHamburgerMenu size={24} />
          </button>
        </>
      )}
      <main
        ref={mainRef}
        className={`min-h-screen transition-all duration-300 ${
          showSidebar ? "md:ml-20" : ""
        }`}
      >
        {children}
      </main>
      {showSidebar && <Footer />}
    </>
  );
};

export default ClientLayout;
