"use client";
import { usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useState, useEffect, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

const disableNavigation = ["/login", "/register", "/", "/about", "/forgot-password", "/reset-password"];

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isOpenSideBar, setIsOpenSideBar] = useState(false);
  const [isNotFoundPage, setIsNotFoundPage] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Check if this is a not-found page
  useEffect(() => {
    const checkNotFound = () => {
      if (mainRef.current) {
        const notFoundElement = mainRef.current.querySelector('[data-not-found="true"]');
        setIsNotFoundPage(!!notFoundElement);
      }
    };
    
    // Use MutationObserver to watch for DOM changes
    const observer = new MutationObserver(checkNotFound);
    
    if (mainRef.current) {
      observer.observe(mainRef.current, {
        childList: true,
        subtree: true,
      });
      checkNotFound();
    }
    
    // Also check after a short delay
    const timer = setTimeout(checkNotFound, 100);
    
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [pathname]);
  
  const showSidebar = !disableNavigation.includes(pathname) && !isNotFoundPage;

  const toggleSideBar = () => {
    setIsOpenSideBar(!isOpenSideBar);
  };

  return (
    <>
      {showSidebar && (
        <>
          <Sidebar isOpenSideBar={isOpenSideBar} toggleSideBar={toggleSideBar} />
          {/* Mobile Menu Button - Always visible on mobile */}
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
          showSidebar
            ? "md:ml-20"
            : ""
        }`}
      >
        {children}
      </main>
      {showSidebar && <Footer />}
    </>
  );
};

export default ClientLayout;
