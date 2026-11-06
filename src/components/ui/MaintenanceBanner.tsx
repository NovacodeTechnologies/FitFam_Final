'use client';

import React from 'react';
import { AlertTriangle, Wrench } from 'lucide-react';

interface MaintenanceBannerProps {
  message?: string;
  subtext?: string;
}

export const MaintenanceBanner: React.FC<MaintenanceBannerProps> = ({
  message = 'SYSTEM MAINTENANCE IN PROGRESS — OUR SERVICES ARE CURRENTLY UNDERGOING SCHEDULED UPGRADES.',
  subtext = 'Ordering & some features may be temporarily limited. We appreciate your patience!',
}) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="w-full bg-gradient-to-r from-[#D97706] via-[#B45309] to-[#92400E] text-white shadow-lg border-b border-amber-400/40 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Left Side: Icon badge + Alert details */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Animated Warning Icon */}
          <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/30 border border-white/20 text-white shadow-inner">
            <Wrench className="w-4 h-4 sm:w-4.5 sm:h-4.5 animate-bounce" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-2.5 min-w-0">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="inline-block w-2 h-2 rounded-full bg-white animate-ping" />
              <span className="font-chakra font-bold tracking-[0.18em] uppercase text-black bg-white px-1.5 py-0.5 rounded text-[10px] sm:text-[11px]">
                NOTICE
              </span>
            </div>
            <p className="font-chakra font-semibold tracking-wide text-white text-[12px] sm:text-[13px] leading-tight sm:leading-normal">
              {message}
            </p>
            {subtext && (
              <span className="hidden lg:inline text-amber-100/90 text-xs font-normal">
                {subtext}
              </span>
            )}
          </div>
        </div>

        {/* Right Side: High visibility badge */}
        <div className="flex-shrink-0 hidden sm:flex items-center gap-1.5 bg-black/40 border border-white/25 px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-mono tracking-widest uppercase font-bold text-amber-200">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
          <span>MAINTENANCE</span>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceBanner;
