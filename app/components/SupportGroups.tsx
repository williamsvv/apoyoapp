"use client";

import React from "react";
import { Globe, ArrowRight } from "lucide-react";
import { GrupoApoyo } from "../models";

interface SupportGroupsProps {
  grupos: GrupoApoyo[];
}

export default function SupportGroups({ grupos }: SupportGroupsProps) {
  const handleRegisterGroup = (groupName: string) => {
    alert(`Gracias por tu interés. En breve habilitaremos el formulario de inscripción automática para el grupo "${groupName}".`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
      {grupos.map((grp) => (
        <div 
          key={grp.id} 
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between hover:scale-[1.01] transition-transform"
        >
          <div className="space-y-4">
            {/* Modality badge */}
            <div className="flex justify-between items-center">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                grp.modalidad === "online"
                  ? "bg-sky-50 text-sky-700 border border-sky-100 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900"
                  : "bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900"
              }`}>
                <Globe className="h-3.5 w-3.5" />
                {grp.modalidad === "online" ? "En Línea (Online)" : "Presencial (Caracas)"}
              </span>
              
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {grp.horario}
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-slate-950 dark:text-white leading-snug">
                {grp.nombre}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {grp.descripcion}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl text-xs space-y-2 border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400 font-semibold block">Facilitador:</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{grp.facilitador}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Lugar / Enlace:</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{grp.lugarOrEnlace}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={() => handleRegisterGroup(grp.nombre)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all"
            >
              Inscribirse al Grupo
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
