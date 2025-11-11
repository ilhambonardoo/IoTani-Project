import { signIn } from "next-auth/react";
import Link from "next/link";
import { HiOutlineLogin } from "react-icons/hi";
import { HiMenu } from "react-icons/hi";

const Navbar = () => {
  return (
    <nav className="w-full h-16 fixed z-20 bg-linear-to-r from-green-500/20 to-green-600/20 shadow-2xl text-white backdrop-blur-2xl">
      <div className="container mx-auto h-full flex items-center justify-between px-6">
        {/* 1. Logo */}
        <Link
          href="/"
          className="text-3xl hover:text-green-700 text-green-900 font-bold"
        >
          IoTani<span className="text-green-950">.</span>
        </Link>

        {/* 2. Link Navigasi (Desktop) */}
        <ul className="hidden md:flex items-center gap-x-8 text-lg">
          <li>
            <Link
              href="/dashboard"
              className="hover:text-green-700 text-green-900 font-semibold transition-colors duration-200"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/data"
              className="hover:text-green-700 text-green-900 font-semibold transition-colors duration-200"
            >
              Monitoring
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="hover:text-green-700 text-green-900 font-semibold transition-colors duration-200"
            >
              Tentang Kami
            </Link>
          </li>
        </ul>

        {/* 3. Tombol CTA (Desktop) */}
        <div className="hidden md:block">
          <button
            onClick={() => signIn()}
            className="flex items-center gap-2 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-green-600 shadow transition-all duration-300 hover:bg-green-50 hover:shadow-md cursor-pointer"
          >
            <HiOutlineLogin size={18} />
            <span>Login</span>
          </button>
        </div>

        {/* 4. Tombol Hamburger (Mobile) */}
        <div className="md:hidden">
          <button className="text-white focus:outline-none">
            <HiMenu size={26} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
