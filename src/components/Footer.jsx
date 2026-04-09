import React from "react";

const Footer = () => {
  return (
    // mt-auto ini sakti banget buat ngedorong footer biar selalu ada di paling bawah layar
    <footer className="bg-white border-t border-gray-100 py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Branding "stane" yang konsisten */}
        <h2 className="text-2xl font-black text-gray-900 tracking-widest mb-4">
          stane
        </h2>

        {/* Copyright */}
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} stane. All rights reserved. Built
          with 🔥 in Jakarta.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
