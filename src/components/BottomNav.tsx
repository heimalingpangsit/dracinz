import React from 'react';
import { Home, Search, Layers, Bookmark } from 'lucide-react';
import { ViewMode } from '../types/index.js';

interface BottomNavProps {
  activeView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  myListCount: number;
  onOpenMyList: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeView,
  onNavigate,
  myListCount,
  onOpenMyList,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0e]/95 backdrop-blur-lg border-t border-neutral-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {/* Home Button */}
      <button
        id="bottom-nav-home"
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all cursor-pointer ${
          activeView === 'home'
            ? 'text-red-500 font-bold'
            : 'text-neutral-400 hover:text-neutral-200 font-medium'
        }`}
      >
        <Home className={`w-5 h-5 ${activeView === 'home' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
        <span className="text-[10px] mt-1 tracking-tight">Beranda</span>
      </button>

      {/* Search Button */}
      <button
        id="bottom-nav-search"
        onClick={() => onNavigate('search')}
        className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all cursor-pointer ${
          activeView === 'search'
            ? 'text-red-500 font-bold'
            : 'text-neutral-400 hover:text-neutral-200 font-medium'
        }`}
      >
        <Search className={`w-5 h-5 ${activeView === 'search' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
        <span className="text-[10px] mt-1 tracking-tight">Pencarian</span>
      </button>

      {/* Koleksi / Collections Button */}
      <button
        id="bottom-nav-collections"
        onClick={() => onNavigate('collections')}
        className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all cursor-pointer ${
          activeView === 'collections'
            ? 'text-red-500 font-bold'
            : 'text-neutral-400 hover:text-neutral-200 font-medium'
        }`}
      >
        <Layers className={`w-5 h-5 ${activeView === 'collections' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
        <span className="text-[10px] mt-1 tracking-tight">Koleksi</span>
      </button>

      {/* Daftar Saya / Bookmark Button */}
      <button
        id="bottom-nav-mylist"
        onClick={onOpenMyList}
        className="flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all text-neutral-400 hover:text-neutral-200 font-medium relative cursor-pointer"
      >
        <div className="relative">
          <Bookmark className="w-5 h-5 stroke-2" />
          {myListCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow">
              {myListCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-1 tracking-tight">Daftar Saya</span>
      </button>
    </nav>
  );
};

