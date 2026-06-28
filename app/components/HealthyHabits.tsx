"use client";

import React from "react";
import contentData from "../data/content.json";

export default function HealthyHabits() {
  const { items } = contentData.habitosSaludables;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
      {items.map((item, idx) => (
        <div 
          key={idx} 
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between hover:scale-[1.01] transition-transform"
        >
          <div className="space-y-3">
            <span className="inline-block text-[10px] font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
              {item.category}
            </span>
            <h3 className="font-extrabold text-base text-slate-950 dark:text-white leading-tight">
              {item.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
