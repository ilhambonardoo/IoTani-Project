"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosHome } from "react-icons/io";
import { BsClipboardDataFill } from "react-icons/bs";
import { BiSolidLogIn } from "react-icons/bi";
import { FaPeopleGroup } from "react-icons/fa6";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <>
      <nav className="flex justify-between bg-white py-4 px-5">
        <Link href={"/"}>
          <button className="cursor-pointer">
            <h1 className="text-black text-2xl font-semibold">IoTani</h1>
          </button>
        </Link>
        <div>
          <ul className="flex pt-1">
            <Link href={"/"}>
              <li
                className={`mr-3 ${
                  pathname === "/" ? "text-gray-950" : "text-stone-600"
                } font-semibold cursor-pointer`}
              >
                <IoIosHome size={25} />
              </li>
            </Link>
            <Link href={"/data"}>
              <li
                className={`mr-3 ${
                  pathname === "/data" ? "text-gray-950" : "text-stone-600"
                } font-semibold cursor-pointer`}
              >
                <BsClipboardDataFill size={25} />
              </li>
            </Link>
            <Link href={"/about"}>
              <li
                className={`mr-3 ${
                  pathname === "/about" ? "text-gray-950" : "text-stone-600"
                } font-semibold cursor-pointer`}
              >
                <FaPeopleGroup size={25} />
              </li>
            </Link>
          </ul>
        </div>
        <Link href={"/login"}>
          <div className="flex">
            <BiSolidLogIn size={25} />
            <span className="font-semibold text-stone-600">Login</span>
          </div>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
