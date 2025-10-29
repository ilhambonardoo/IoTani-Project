"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosHome } from "react-icons/io";
import { BsClipboardDataFill } from "react-icons/bs";
import { BiSolidLogOut } from "react-icons/bi";
import { FaPeopleGroup } from "react-icons/fa6";
import { useState } from "react";

// Ganti nama komponen dari Navbar menjadi Sidebar
const Sidebar = () => {
  const pathname = usePathname();
  const [IsOpen, setIsOpen] = useState(false);

  // Helper function untuk styling link agar lebih rapi
  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center p-3 my-1 rounded-lg font-semibold transition-colors duration-200 ${
      isActive
        ? "bg-white/30 text-gray-950"
        : "text-stone-600 hover:bg-white/20"
    }`;
  };

  return (
    <>
      <nav className="fixed left-0 top-0 z-20 flex h-screen w-60 flex-col border-r border-white/30 bg-white/10 p-5 backdrop-blur-md">
        <div className="mb-10">
          <Link href={"/"}>
            <h1 className="cursor-pointer text-black text-3xl font-semibold">
              IoTani
            </h1>
          </Link>
        </div>

        <ul className="flex flex-col">
          <li>
            <Link href={"/dashboard"} className={getLinkClasses("/dashboard")}>
              <IoIosHome size={25} className="mr-4" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href={"/data"} className={getLinkClasses("/data")}>
              <BsClipboardDataFill size={25} className="mr-4" />
              <span>Data</span>
            </Link>
          </li>
          <li>
            <Link href={"/about"} className={getLinkClasses("/about")}>
              <FaPeopleGroup size={25} className="mr-4" />
              <span>About</span>
            </Link>
          </li>
        </ul>

        <ul className="mt-auto">
          {" "}
          <li>
            <Link
              href={"/"}
              className="flex items-center p-3 my-1 rounded-lg font-semibold text-stone-600 hover:bg-white/20 transition-colors duration-200"
            >
              <BiSolidLogOut size={25} className="mr-4" />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
