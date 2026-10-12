import React from 'react';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto bg-white border-t border-swasira-mint-border py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold text-swasira-teal">SWASIRA</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-swasira-mint text-swasira-teal font-semibold">
                SWASTH
              </span>
            </div>
            <p className="text-xs text-swasira-muted mt-1 max-w-sm">
              Rooted in "Swasth" — personal well-being that listens, understands your life stage, and never shames.
            </p>
          </div>

          {/* Medical Notice (Required rule) */}
          <div className="flex items-center gap-2.5 px-4 py-2 bg-amber-50 rounded-xl border border-swasira-amber-border text-xs text-swasira-amber-dark max-w-md text-center md:text-left">
            <ShieldCheck className="w-4 h-4 text-swasira-saffron shrink-0" />
            <span>
              <strong>Important Notice:</strong> General nutrition guidance, not medical advice. Always consult certified clinicians for acute therapeutic prescriptions.
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-swasira-mint-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-swasira-muted">
          <p>© {new Date().getFullYear()} SWASIRA. Health That Understands You.</p>
          <div className="flex items-center gap-1.5 text-swasira-muted">
            <span>Crafted with regional wisdom</span>
            <Sparkles className="w-3.5 h-3.5 text-swasira-saffron" />
            <span>& modern nutrition science</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
