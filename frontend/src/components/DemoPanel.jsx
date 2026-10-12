import React from 'react';
import { demoProfiles } from '../demoProfiles';
import { Sparkles, Info } from 'lucide-react';

export default function DemoPanel({ onSelectProfile, activeProfileId }) {
  const isDemoEnabled = import.meta.env.VITE_ENABLE_DEMO === 'true';

  if (!isDemoEnabled) return null;

  return (
    <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-swasira-amber-border/80 shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-swasira-saffron/20 text-swasira-amber-dark border border-swasira-amber-border">
            <Sparkles className="w-3 h-3 text-swasira-saffron" />
            Quick Fill
          </span>
          <h4 className="text-sm font-semibold text-swasira-charcoal font-serif">
            Demo Mode Presentation Panel
          </h4>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-swasira-muted font-medium">
          <Info className="w-3 h-3 text-swasira-amber-dark shrink-0" />
          <span>For presentation evaluation only</span>
        </div>
      </div>

      <p className="text-xs text-swasira-charcoal/80 mb-3 leading-relaxed">
        Pre-fills strictly team-specified condition details. Diet type & age remain empty until entered live.
      </p>

      {/* Profile Chips */}
      <div className="flex flex-wrap gap-2">
        {demoProfiles.map((profile) => {
          const isSelected = activeProfileId === profile.id;
          const conditionLabel = profile.conditions ? profile.conditions[0] : '';

          return (
            <button
              key={profile.id}
              type="button"
              onClick={() => onSelectProfile(profile)}
              className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-swasira-teal text-white shadow-sm ring-2 ring-swasira-teal/30 scale-105'
                  : 'bg-white text-swasira-charcoal border border-swasira-amber-border hover:border-swasira-saffron hover:bg-amber-100/50'
              }`}
            >
              <span className="font-semibold">{profile.name}</span>
              {conditionLabel && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-amber-100 text-swasira-amber-dark'
                  }`}
                >
                  {conditionLabel.split('/')[0].trim()}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
