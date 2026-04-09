import React from "react";
import { Link, useLocation } from "react-router-dom";
import logoImage from "../assets/logo.png";

const Header = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="bg-white shadow-sm pt-5 pb-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center relative mb-2">
          {/* Tombol Back */}
          {!isHome && (
            <Link
              to="/"
              className="absolute left-0 text-gray-500 font-medium hover:text-gray-800 transition-colors flex items-center gap-2 z-10"
            >
              <span className="text-xl">←</span> Back
            </Link>
          )}

          {/* 2. GANTI TEKS JADI GAMBAR LOGO DI SINI */}
          <Link to="/">
            <img
              src={logoImage}
              alt="Stane Logo"
              // h-8 itu tinggi gambarnya, lu bisa ganti jadi h-10 atau h-12 kalau ngerasa kekecilan
              className="h-8 md:h-10 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>

        {/* Tempat Tombol Kategori */}
        {children && (
          <div className="mt-5 border-t border-gray-50 pt-2">{children}</div>
        )}
      </div>
    </header>
  );
};

export default Header;
