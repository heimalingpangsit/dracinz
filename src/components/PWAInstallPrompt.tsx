import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'pwa_prompt_dismissed';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Don't show again if the user already dismissed it or installed the app
    const alreadyDismissed = sessionStorage.getItem(DISMISSED_KEY);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!alreadyDismissed && !isStandalone) {
        setShowPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem(DISMISSED_KEY, 'true');
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-label="Install DracinTeros"
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -80 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="fixed top-0 inset-x-0 z-[100] flex justify-center px-3 pt-3 sm:pt-4"
      >
        <div className="w-full max-w-md bg-[#111218]/95 border border-red-600/40 rounded-2xl px-4 py-3 shadow-2xl shadow-black/60 backdrop-blur-xl flex items-center gap-3">
          <img
            src="/logo.png"
            alt="DracinTeros"
            className="w-11 h-11 object-contain rounded-xl shadow-md flex-shrink-0"
          />

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-black text-white truncate">DracinTeros</h4>
            <p className="text-[11px] text-neutral-400 truncate">Install aplikasi untuk pengalaman nonton yang lebih cepat</p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-950/80 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </motion.button>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg"
              title="Tutup"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
