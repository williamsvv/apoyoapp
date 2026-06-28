"use client";

import React from "react";
import { Activity, HeartHandshake, Brain, Users, Info } from "lucide-react";
import contentData from "../data/content.json";

export default function SismoReactions() {
  const getQuadrantIcon = (iconName: string) => {
    switch (iconName) {
      case "Activity": return Activity;
      case "HeartHandshake": return HeartHandshake;
      case "Brain": return Brain;
      case "Users": return Users;
      default: return Info;
    }
  };

  const { quadrants } = contentData.reaccionesSismo;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fadeIn">
      {quadrants.map((quad, idx) => {
        const QuadIcon = getQuadrantIcon(quad.icon);
        return (
          <div 
            key={idx} 
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800"
          >
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 p-2.5 text-emerald-600 dark:text-emerald-400">
                <QuadIcon className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-950 dark:text-white leading-tight">
                {quad.area}
              </h3>
            </div>

            <ul className="space-y-3">
              {quad.items.map((it, itemIdx) => (
                <li key={itemIdx} className="flex gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed align-top">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
