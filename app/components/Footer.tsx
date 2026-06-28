"use client";

import React from "react";
import { HeartHandshake } from "lucide-react";

interface FooterProps {
  disclaimer: string;
  credits: string;
}

export default function Footer({ disclaimer, credits }: FooterProps) {
  return (
    <footer className="mt-12 bg-white border-t border-slate-200 py-8 px-4 dark:bg-slate-950 dark:border-slate-900">
      <div className="max-w-5xl mx-auto space-y-4 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-emerald-500" />
            <span className="font-extrabold text-sm text-slate-950 dark:text-white tracking-tight">PsicoAyudaVenezuela</span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            {credits}
          </p>
        </div>
        
        <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed border-t border-slate-100 dark:border-slate-900 pt-4">
          {disclaimer}
        </p>
      </div>
    </footer>
  );
}
