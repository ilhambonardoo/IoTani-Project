"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosHome } from "react-icons/io";
import { BsClipboardDataFill } from "react-icons/bs";
import { BiSolidLogOut } from "react-icons/bi";
import { FaPeopleGroup } from "react-icons/fa6";
import Image from "next/image";
import { GiHamburgerMenu } from "react-icons/gi";
import { signOut, useSession } from "next-auth/react";
import { MdAdminPanelSettings } from "react-icons/md";

const Sidebar = ({
  toggleSideBar,
  isOpenSideBar,
}: {
  toggleSideBar: () => void;
  isOpenSideBar: boolean;
}) => {
  const { data: session }: { data: any } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const pathname = usePathname();
  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center p-3 my-1 rounded-lg font-semibold transition-colors duration-200 ${
      isActive ? "bg-black/30 text-white" : "text-stone-100 hover:bg-black/20"
    }`;
  };

  return (
    <>
      <nav
        className={`fixed left-0 top-0 z-20 flex h-screen ${
          isOpenSideBar
            ? "w-60 transition-all duration-300 bg-black/40 backdrop-blur-md border-white/30  border-r "
            : "w-20 transition-all duration-300 bg-transparent "
        }  flex-col`}
      >
        <GiHamburgerMenu
          size={30}
          className="text-white cursor-pointer hover:scale-120 duration-300 ml-5 mt-5"
          onClick={toggleSideBar}
        />
        <Link href={"/dashboard"}>
          <Image src={"/logo/logo.png"} width={200} height={200} alt={"logo"} />
        </Link>
        <ul className="flex flex-col">
          <li>
            <Link href={"/dashboard"} className={getLinkClasses("/dashboard")}>
              {isOpenSideBar ? (
                <>
                  <IoIosHome
                    size={30}
                    className="mr-4 transition-all duration-300"
                  />
                  <span>Dashboard</span>
                </>
              ) : (
                <>
                  <IoIosHome
                    size={30}
                    className="mr-4 transition-all duration-300  mx-auto"
                  />
                </>
              )}
            </Link>
          </li>
          <li>
            <Link href={"/data"} className={getLinkClasses("/data")}>
              {isOpenSideBar ? (
                <>
                  <BsClipboardDataFill
                    size={30}
                    className="mr-4 transition-all duration-300"
                  />
                  <span>Data</span>
                </>
              ) : (
                <>
                  <BsClipboardDataFill
                    size={30}
                    className="mr-4 transition-all duration-300 mx-auto"
                  />
                </>
              )}
            </Link>
          </li>
          <li>
            <Link href={"/about"} className={getLinkClasses("/about")}>
              {isOpenSideBar ? (
                <>
                  <FaPeopleGroup
                    size={25}
                    className="mr-4 transition-all duration-300"
                  />
                  <span>About</span>
                </>
              ) : (
                <>
                  <FaPeopleGroup
                    size={30}
                    className="mr-4 transition-all duration-300 mx-auto"
                  />
                </>
              )}
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link
                href={"/user-management"} // Ganti dengan rute Anda
                className={getLinkClasses("/user-management")}
              >
                {isOpenSideBar ? (
                  <>
                    <MdAdminPanelSettings
                      size={30}
                      className="mr-4 transition-all duration-300"
                    />
                    <span>User Management</span>
                  </>
                ) : (
                  <>
                    <MdAdminPanelSettings
                      size={30}
                      className="mr-4 transition-all duration-300 mx-auto"
                    />
                  </>
                )}
              </Link>
            </li>
          )}
        </ul>

        <ul className="mt-auto">
          {" "}
          <li>
            <button
              onClick={() => {
                signOut({ callbackUrl: "/" });
              }}
              className={`flex justify-center items-center p-3 cursor-pointer ${
                isOpenSideBar ? "px-10" : "px-4"
              } mx-auto rounded-lg font-semibold bg-black/50 hover:bg-black/60 transition-colors duration-200 mb-9`}
            >
              {isOpenSideBar ? (
                <>
                  <div className="flex">
                    <BiSolidLogOut size={30} className=" text-white" />
                    <span className="text-white text-lg">Logout</span>
                  </div>
                </>
              ) : (
                <>
                  <BiSolidLogOut
                    size={30}
                    className=" text-white transition-all duration-300 mx-auto"
                  />
                </>
              )}
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
