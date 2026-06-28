"use client";

import React, { useState } from "react";
import { Activity, AlertTriangle, Heart, Moon, BookOpen, ChevronRight, CheckCircle } from "lucide-react";
import contentData from "../data/content.json";

export default function DiagnosticGuide() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getDiagnosticIcon = (iconName: string) => {
    switch (iconName) {
      case "Activity": return Activity;
      case "AlertOctagon": return AlertTriangle;
      case "Heart": return Heart;
      case "Moon": return Moon;
      default: return BookOpen;
    }
  };

  const { items } = contentData.diagnosticoRapido;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
      {items.map((item) => {
        const DiagnosticIcon = getDiagnosticIcon(item.icon);
        const isExpanded = expandedId === item.id;
        return (
          <div 
            key={item.id} 
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950 p-3 text-emerald-600 dark:text-emerald-400">
                  <DiagnosticIcon className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-950 dark:text-white leading-tight">
                  {item.title}
                </h3>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {item.desc}
              </p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              {isExpanded ? (
                <div className="space-y-3.5 animate-fadeIn">
                  <h4 className="font-bold text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4" />
                    {item.tecnicaTitle}
                  </h4>
                  <ol className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed list-decimal pl-4">
                    {item.tecnicaSteps.map((step, idx) => (
                      <li key={idx} className="pl-1">{step}</li>
                    ))}
                  </ol>
                  <button
                    onClick={() => setExpandedId(null)}
                    className="mt-3 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    Ocultar Técnica
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setExpandedId(item.id)}
                  className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors group"
                >
                  <span>{item.tecnicaTitle}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-transform group-hover:translate-x-1" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
