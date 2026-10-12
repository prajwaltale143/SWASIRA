import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isAmber = toast.type === 'warning' || toast.type === 'amber' || toast.type === 'error';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 max-w-md"
      >
        <div
          className={`p-4 rounded-2xl shadow-premium border flex items-start gap-3 backdrop-blur-md ${
            isSuccess
              ? 'bg-white/95 border-swasira-sage text-swasira-teal'
              : isAmber
              ? 'bg-amber-50/95 border-swasira-amber-border text-swasira-amber-dark'
              : 'bg-white/95 border-swasira-mint-border text-swasira-charcoal'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {isSuccess ? (
              <CheckCircle2 className="w-5 h-5 text-swasira-sage" />
            ) : isAmber ? (
              <AlertCircle className="w-5 h-5 text-swasira-saffron" />
            ) : (
              <Info className="w-5 h-5 text-swasira-teal" />
            )}
          </div>

          <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
            {toast.message}
          </div>

          <button
            onClick={onClose}
            className="shrink-0 p-1 rounded-lg text-swasira-muted hover:text-swasira-charcoal hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
