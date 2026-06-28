"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Search, BookOpen, Menu } from "lucide-react";
import { useApp } from "./AppContext";

interface BottomNavProps {
  onMoreClick: () => void;
}

export default function BottomNav({ onMoreClick }: BottomNavProps) {
  const pathname = usePathname();
  const { voluntarios } = useApp();

  const guardiasActivas = voluntarios.filter(v => v.guardiaActiva && v.autorizado);
  const hasActiveGuard = guardiasActivas.length > 0;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 text-slate-300 border-t border-slate-800 z-40">
      <div className="grid grid-cols-4 items-center h-16">
        
        <Link 
          href="/"
          className={`flex flex-col items-center justify-center h-full transition-all ${
            pathname === "/" ? "text-emerald-400 font-bold" : "text-slate-400"
          }`}
        >
          <div className="relative">
            <Activity className="h-5 w-5" />
            {hasActiveGuard && (
              <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <span className="text-[9px] mt-1 tracking-tight">Atención</span>
        </Link>

        <Link 
          href="/directorio"
          className={`flex flex-col items-center justify-center h-full transition-all ${
            pathname === "/directorio" ? "text-emerald-400 font-bold" : "text-slate-400"
          }`}
        >
          <Search className="h-5 w-5" />
          <span className="text-[9px] mt-1 tracking-tight">Buscar</span>
        </Link>

        <Link 
          href="/diagnostico"
          className={`flex flex-col items-center justify-center h-full transition-all ${
            pathname === "/diagnostico" ? "text-emerald-400 font-bold" : "text-slate-400"
          }`}
        >
          <BookOpen className="h-5 w-5" />
          <span className="text-[9px] mt-1 tracking-tight">Guías</span>
        </Link>

        <button 
          onClick={onMoreClick}
          className="flex flex-col items-center justify-center h-full text-slate-400"
        >
          <Menu className="h-5 w-5" />
          <span className="text-[9px] mt-1 tracking-tight">Más</span>
        </button>

      </div>
    </div>
  );
}
