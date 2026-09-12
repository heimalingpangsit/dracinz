import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Drama } from '../types/index.js';
import { DramaCard } from './DramaCard.js';
import { Bookmark, X, Trash2 } from 'lucide-react';

interface MyListModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedDramas: Drama[];
  onSelectDrama: (drama: Drama) => void;
  onRemoveBookmark: (drama: Drama, e: React.MouseEvent) => void;
  onClearAll: () => void;
}

export const MyListModal: React.FC<MyListModalProps> = ({
  isOpen,
  onClose,
  bookmarkedDramas,
  onSelectDrama,
  onRemoveBookmark,
  onClearAll,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center p-4 pt-16 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-4xl bg-[#111218] border border-neutral-800 rounded-2xl shadow-2xl p-6 self-start space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Bookmark className="w-5 h-5 text-red-500 fill-current" />
                <span>Daftar Saya ({bookmarkedDramas.length})</span>
              </div>

              <div className="flex items-center gap-3">
                {bookmarkedDramas.length > 0 && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onClearAll}
                    className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Semua</span>
                  </motion.button>
                )}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            {bookmarkedDramas.length === 0 ? (
              <div className="py-16 text-center text-neutral-400 space-y-2">
                <p className="text-base font-semibold">Daftar simpanan Anda masih kosong.</p>
                <p className="text-xs text-neutral-500">
                  Tekan ikon bookmark pada drama untuk menyimpannya ke daftar ini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                {bookmarkedDramas.map((drama) => (
                  <DramaCard
                    key={drama.id}
                    drama={drama}
                    onSelect={(d) => {
                      onSelectDrama(d);
                      onClose();
                    }}
                    isBookmarked={true}
                    onToggleBookmark={onRemoveBookmark}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

