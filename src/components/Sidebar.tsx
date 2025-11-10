"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosHome } from "react-icons/io";
import { BiSolidLogOut } from "react-icons/bi";
import {
  FaPeopleGroup,
  FaUser,
  FaCamera,
  FaComments,
  FaEnvelope,
} from "react-icons/fa6";
import { MdAdminPanelSettings, MdContentCopy, MdInbox } from "react-icons/md";
import { HiOutlineChartBar } from "react-icons/hi";
import { FaRobot, FaFileExport } from "react-icons/fa";
import Image from "next/legacy/image";
import { GiHamburgerMenu } from "react-icons/gi";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";

interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  roles: string[];
}

const Sidebar = ({
  toggleSideBar,
  isOpenSideBar,
}: {
  toggleSideBar: () => void;
  isOpenSideBar: boolean;
}) => {
  const { data: session }: { data: any } = useSession();
  const userRole = session?.user?.role || "user";
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    // Common items
    {
      href:
        userRole === "admin"
          ? "/dashboardAdmin"
          : userRole === "owner"
          ? "/dashboard"
          : "/dashboard",
      icon: <IoIosHome size={24} />,
      label: "Dashboard",
      roles: ["user", "admin", "owner"],
    },
    // User items
    {
      href: "/data",
      icon: <HiOutlineChartBar size={24} />,
      label: "Grafik Real-time",
      roles: ["user", "owner"],
    },
    {
      href: "/camera",
      icon: <FaCamera size={24} />,
      label: "Kamera",
      roles: ["user", "owner"],
    },
    {
      href: "/forum",
      icon: <FaComments size={24} />,
      label: "Forum QnA",
      roles: ["user"],
    },
    {
      href: "/message",
      icon: <FaEnvelope size={24} />,
      label: "Pesan",
      roles: ["user", "owner"],
    },
    // Admin items
    {
      href: "/user-management",
      icon: <MdAdminPanelSettings size={24} />,
      label: "Manajemen User",
      roles: ["admin"],
    },
    {
      href: "/content",
      icon: <MdContentCopy size={24} />,
      label: "Manajemen Konten",
      roles: ["admin"],
    },
    {
      href: "/inbox",
      icon: <MdInbox size={24} />,
      label: "Inbox",
      roles: ["admin"],
    },
    // Owner items
    {
      href: "/export",
      icon: <FaFileExport size={24} />,
      label: "Export Database",
      roles: ["owner"],
    },
    {
      href: "/operational",
      icon: <FaRobot size={24} />,
      label: "Status Operasional",
      roles: ["owner"],
    },
    // Common items
    {
      href: "/about",
      icon: <FaPeopleGroup size={24} />,
      label: "About",
      roles: ["user", "admin", "owner"],
    },
    {
      href: "/profile",
      icon: <FaUser size={24} />,
      label: "Profile",
      roles: ["user", "admin", "owner"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path || pathname.startsWith(path + "/");
    return `flex items-center p-3 my-1 rounded-lg font-semibold transition-all duration-200 ${
      isActive
        ? "bg-green-500/20 text-green-600 border-l-4 border-green-500"
        : "text-neutral-700 hover:bg-green-50 hover:text-green-600"
    }`;
  };

  return (
    <>
      <nav
        className={`fixed left-0 top-0 z-20 flex h-screen ${
          isOpenSideBar
            ? "w-64 transition-all duration-300 bg-white shadow-xl border-r border-neutral-200"
            : "w-20 transition-all duration-300 bg-white shadow-xl border-r border-neutral-200"
        } flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <GiHamburgerMenu
            size={24}
            className="text-neutral-700 cursor-pointer hover:text-green-600 transition-colors"
            onClick={toggleSideBar}
          />
          {isOpenSideBar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-green-600"
            >
              IoTani
            </motion.div>
          )}
        </div>

        <Link
          href={isOpenSideBar ? "/dashboard" : "/dashboard"}
          className="p-4 border-b border-neutral-200"
        >
          <div className="flex items-center justify-center">
            <Image
              src={"/logo/logo.png"}
              width={isOpenSideBar ? 120 : 40}
              height={isOpenSideBar ? 120 : 40}
              alt={"logo"}
              className="object-contain"
            />
          </div>
        </Link>

        <ul className="flex flex-col flex-1 overflow-y-auto p-2">
          {filteredMenuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={getLinkClasses(item.href)}>
                <span className="flex-shrink-0">{item.icon}</span>
                {isOpenSideBar && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-3"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t border-neutral-200 p-4">
          <button
            onClick={() => {
              signOut({ callbackUrl: "/" });
            }}
            className={`flex items-center w-full p-3 rounded-lg font-semibold transition-all duration-200 ${
              isOpenSideBar
                ? "bg-red-50 text-red-600 hover:bg-red-100 justify-start"
                : "bg-red-50 text-red-600 hover:bg-red-100 justify-center"
            }`}
          >
            <BiSolidLogOut size={24} />
            {isOpenSideBar && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-3"
              >
                Logout
              </motion.span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
