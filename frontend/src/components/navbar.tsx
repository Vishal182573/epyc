"use client"
import React, { useState } from 'react';
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { LOGO } from "../../public";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-sm py-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Image src={LOGO} alt="Logo" width={120} height={26} />
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-600">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <NavLink href="/" mobile>Home</NavLink>
            <NavLink href="/about" mobile>About</NavLink>
            <NavLink href="/contact" mobile>Contact</NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, mobile }) => (
  <a
    href={href}
    className={`text-gray-600 hover:text-purple-600 transition-colors duration-200
      ${mobile ? 'block w-full py-2 px-4 hover:bg-gray-100' : ''}`}
  >
    {children}
  </a>
);