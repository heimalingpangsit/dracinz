import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-neutral-800/80 bg-[#0c0d12] py-8 px-4 md:px-8 text-neutral-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs sm:text-sm">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-red-600">
            Dracin<span className="text-white">Teros</span>
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-neutral-300">
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-red-500 transition-colors">
            Privacy Policy
          </a>
          <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-red-500 transition-colors">
            Terms of Service
          </a>
          <a href="#help" onClick={(e) => e.preventDefault()} className="hover:text-red-500 transition-colors">
            Help Center
          </a>
          <a href="#contact" onClick={(e) => e.preventDefault()} className="hover:text-red-500 transition-colors">
            Contact Us
          </a>
        </div>

        {/* Copyright */}
        <div className="text-neutral-500 text-xs text-center md:text-right">
          © 2024 DracinTeros. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
