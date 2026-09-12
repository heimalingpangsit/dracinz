import React, { useState } from 'react';
import { User, Bookmark, Menu, X } from 'lucide-react';
import { ViewMode } from '../types/index.js';

interface HeaderProps {
  activeView: ViewMode;
  onNavigate: (view: ViewMode, genreSlug?: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  myListCount: number;
  onOpenMyList: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  searchQuery,
  onSearchChange,
  myListCount,
  onOpenMyList,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0c0d12]/95 backdrop-blur-md border-b border-neutral-800/80 px-4 md:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Main Nav */}
        <div className="flex items-center gap-8">
          <button
            id="brand-logo-btn"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <img
              src="/logo.png"
              alt="DracinTeros Logo"
              className="w-9 h-9 object-contain rounded-xl shadow-lg shadow-red-950/50 group-hover:scale-105 transition-transform"
            />
            <span className="text-xl sm:text-2xl font-black tracking-tight text-red-600 group-hover:text-red-500 transition-colors">
              Dracin<span className="text-white">Teros</span>
            </span>
          </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                id="nav-home-btn"
                onClick={() => onNavigate('home')}
                className={`text-sm font-semibold tracking-wide transition-colors relative py-1 ${
                  activeView === 'home'
                    ? 'text-red-500 font-bold'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                Beranda
                {activeView === 'home' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                )}
              </button>

              <button
                id="nav-search-btn"
                onClick={() => onNavigate('search')}
                className={`text-sm font-semibold tracking-wide transition-colors relative py-1 ${
                  activeView === 'search'
                    ? 'text-red-500 font-bold'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                Pencarian
                {activeView === 'search' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                )}
              </button>

              <button
                id="nav-collections-btn"
                onClick={() => onNavigate('collections')}
                className={`text-sm font-semibold tracking-wide transition-colors relative py-1 ${
                  activeView === 'collections'
                    ? 'text-red-500 font-bold'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                Koleksi
                {activeView === 'collections' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                )}
              </button>
            </nav>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* My List Bookmark */}
          <button
            id="my-list-header-btn"
            onClick={onOpenMyList}
            className="relative p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-colors focus:outline-none"
            title="Daftar Saya"
          >
            <Bookmark className="w-5 h-5" />
            {myListCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {myListCount}
              </span>
            )}
          </button>

          {/* User Icon */}
          <div className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hidden sm:flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-300 hover:text-white md:hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-neutral-800 flex flex-col gap-2">
          <button
            id="mobile-nav-home-btn"
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activeView === 'home' ? 'bg-red-600/20 text-red-500' : 'text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            Beranda
          </button>
          <button
            id="mobile-nav-search-btn"
            onClick={() => {
              onNavigate('search');
              setMobileMenuOpen(false);
            }}
            className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activeView === 'search' ? 'bg-red-600/20 text-red-500' : 'text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            Pencarian
          </button>
          <button
            id="mobile-nav-collections-btn"
            onClick={() => {
              onNavigate('collections');
              setMobileMenuOpen(false);
            }}
            className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activeView === 'collections' ? 'bg-red-600/20 text-red-500' : 'text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            Koleksi
          </button>
        </div>
      )}
    </header>
  );
};
