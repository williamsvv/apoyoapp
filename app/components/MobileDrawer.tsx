"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartHandshake, X } from "lucide-react";
import { useApp } from "./AppContext";
import { getNavigationItems } from "../routes";
import content from "../data/content.json";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const { voluntarios, grupos, currentUser, setIsAuthModalOpen } = useApp();

  if (!isOpen) return null;

  const guardiasActivas = voluntarios.filter(v => v.guardiaActiva && v.autorizado);
  const hasActiveGuard = guardiasActivas.length > 0;
  
  const navigationItems = getNavigationItems(hasActiveGuard, grupos.length);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 md:hidden flex justify-end">
      <div className="w-80 bg-slate-900 text-white h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideIn">
        
        <div className="space-y-6">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <Link href="/" onClick={onClose} className="flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-emerald-400" />
              <span className="font-extrabold text-base">PsicoAyudaVE</span>
            </Link>
            <button 
              onClick={onClose}
              className="rounded-full p-1.5 hover:bg-slate-800 text-slate-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Links */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  onClick={onClose}
                  className={`w-full flex items-center justify-between px-3 py-3.5 rounded-xl text-left text-sm font-semibold transition-all duration-150 ${
                    isActive 
                      ? "bg-emerald-600 text-white" 
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0 text-slate-400" />
                    <span>{item.label}</span>
                  </div>
                  
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                      item.id === "guardia" 
                        ? "bg-emerald-500 text-slate-900" 
                        : "bg-slate-700 text-slate-200"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.alert && (
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Portal Acceso Voluntarios in Drawer */}
        <div className="border-t border-slate-800 pt-6 mt-6">
          {currentUser ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold truncate max-w-[150px]">
                  {currentUser.nombre}
                </span>
                <span className={`inline-flex h-2 w-2 rounded-full ${currentUser.guardiaActiva ? "bg-emerald-400" : "bg-slate-500"}`} />
              </div>
              <button
                onClick={() => {
                  onClose();
                  setIsAuthModalOpen(true);
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Ver Panel de Voluntario
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                setIsAuthModalOpen(true);
              }}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md shadow-emerald-950/20"
            >
              {content.general.volunteerButton.register}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
