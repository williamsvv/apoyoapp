"use client";

import React from "react";
import { ShieldAlert, HelpCircle, Smile, MessageSquare, Heart } from "lucide-react";
import contentData from "../data/content.json";

export default function GriefManifestations() {
  const getDueloIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldAlert": return ShieldAlert;
      case "HelpCircle": return HelpCircle;
      case "Smile": return Smile;
      case "MessageSquare": return MessageSquare;
      default: return Heart;
    }
  };

  const { cards } = contentData.manifestacionesDuelo;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
      {cards.map((card, idx) => {
        const CardIcon = getDueloIcon(card.icon);
        return (
          <div 
            key={idx} 
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800 flex items-start gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-3 text-emerald-600 dark:text-emerald-400 shrink-0">
              <CardIcon className="h-6 w-6" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-base text-slate-950 dark:text-white leading-tight">
                {card.dimension}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {card.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
