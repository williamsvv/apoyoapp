"use client";

import React from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";

interface EmergencyBannerProps {
  bannerText: string;
  actionText: string;
  onAction: () => void;
}

export default function EmergencyBanner({ bannerText, actionText, onAction }: EmergencyBannerProps) {
  return (
    <div className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white text-xs sm:text-sm py-3 px-4 shadow-md sticky top-0 z-40 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 max-w-4xl mx-auto flex-1 justify-center sm:justify-start">
        <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-red-100 animate-bounce" />
        <p className="font-medium text-center sm:text-left leading-relaxed">
          {bannerText}
        </p>
      </div>
      <button 
        onClick={onAction}
        className="shrink-0 bg-white text-red-700 hover:bg-red-50 text-xs font-bold rounded-lg px-3 py-1.5 transition-all shadow-sm flex items-center gap-1 uppercase tracking-wide"
      >
        {actionText}
        <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}
