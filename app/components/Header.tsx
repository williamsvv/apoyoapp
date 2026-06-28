"use client";

import React from "react";
import { HeartHandshake } from "lucide-react";
import { useApp } from "./AppContext";
import content from "../data/content.json";

export default function Header() {
  const { currentUser, setIsAuthModalOpen } = useApp();

  return (
    <header className="md:hidden bg-slate-900 text-white px-4 py-4 border-b border-slate-800 flex items-center justify-between sticky top-[44px] z-30">
      <div className="flex items-center gap-2">
        <HeartHandshake className="h-5 w-5 text-emerald-400" />
        <span className="font-extrabold tracking-tight text-base">PsicoAyudaVE</span>
      </div>
      
      <div className="flex items-center gap-2">
        {currentUser ? (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 text-white px-2.5 py-1 text-xs font-semibold border border-slate-700"
          >
            <span className={`h-2 w-2 rounded-full ${currentUser.guardiaActiva ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
            Panel
          </button>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg px-2.5 py-1.5 transition-all"
          >
            {content.general.volunteerButton.login}
          </button>
        )}
      </div>
    </header>
  );
}
