"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LuMail, 
  LuPhone, 
  LuMapPin, 
  LuFacebook, 
  LuTwitter, 
  LuInstagram, 
  LuLinkedin,
  LuLeaf,
  LuArrowRight
} from "react-icons/lu";

const Footer = () => {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const footerLinks = {
    platform: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Tentang Kami", href: "/about" },
      { name: "Fitur", href: "/#features" },
      { name: "Panduan", href: "/about" },
    ],
    resources: [
      { name: "Dokumentasi", href: "/about" },
      { name: "Blog", href: "/about" },
      { name: "Forum", href: "/forum" },
      { name: "Kontak", href: "/about" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", icon: LuFacebook, href: "#" },
    { name: "Twitter", icon: LuTwitter, href: "#" },
    { name: "Instagram", icon: LuInstagram, href: "#" },
    { name: "LinkedIn", icon: LuLinkedin, href: "#" },
  ];

  return (
    <footer className="bg-gradient-to-b from-neutral-50 to-green-50 border-t border-green-200/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
                <LuLeaf size={24} />
              </div>
              <h3 className="text-2xl font-bold text-neutral-800">
                IoTani<span className="text-green-500">.</span>
              </h3>
            </div>
            <p className="text-neutral-600 mb-4 leading-relaxed">
              Platform IoT untuk pertanian modern dengan monitoring, otomatisasi, dan AI untuk hasil panen optimal.
            </p>
            <div className="flex flex-col gap-2 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <LuMail className="text-green-600" size={18} />
                <span>info@iotani.com</span>
              </div>
              <div className="flex items-center gap-2">
                <LuPhone className="text-green-600" size={18} />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-start gap-2">
                <LuMapPin className="text-green-600 mt-1" size={18} />
                <span>Indonesia</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-lg font-semibold text-neutral-800 mb-4">
              Platform
            </h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-neutral-600 hover:text-green-600 transition-colors duration-200 group"
                  >
                    <LuArrowRight 
                      size={16} 
                      className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" 
                    />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-lg font-semibold text-neutral-800 mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-neutral-600 hover:text-green-600 transition-colors duration-200 group"
                  >
                    <LuArrowRight 
                      size={16} 
                      className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" 
                    />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h4 className="text-lg font-semibold text-neutral-800 mb-4">
              Tetap Terhubung
            </h4>
            <p className="text-neutral-600 text-sm mb-4">
              Ikuti kami untuk mendapatkan update terbaru tentang teknologi pertanian.
            </p>
            <div className="flex gap-3 mb-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-600 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-200/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-600 text-center md:text-left">
              &copy; {year ?? "2024"} <span className="font-semibold text-green-600">IoTani</span>. Semua Hak Cipta Dilindungi.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-neutral-600">
              <Link
                href="/about"
                className="hover:text-green-600 transition-colors duration-200"
              >
                Kebijakan Privasi
              </Link>
              <Link
                href="/about"
                className="hover:text-green-600 transition-colors duration-200"
              >
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
