"use client";

import React from "react";
import { Activity, Phone, MessageSquare } from "lucide-react";
import { Voluntario } from "../models";

interface ActiveGuardsProps {
  vols: Voluntario[];
  onNavigateToDirectory: () => void;
  onNavigateToDiagnostic: () => void;
}

export default function ActiveGuards({ vols, onNavigateToDirectory, onNavigateToDiagnostic }: ActiveGuardsProps) {
  if (vols.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm max-w-xl mx-auto my-8 dark:bg-slate-900 dark:border-slate-800">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 mb-4">
          <Activity className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sin Guardias Activas en este momento</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Nuestros psicólogos son voluntarios y brindan guardia de forma rotativa. Actualmente todos están fuera de línea.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onNavigateToDirectory}
            className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 text-sm transition-colors dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            Buscar en el Directorio Completo
          </button>
          <button
            onClick={onNavigateToDiagnostic}
            className="px-4 py-2 border border-slate-300 text-slate-700 bg-white font-semibold rounded-lg hover:bg-slate-50 text-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            Ver Guía de Auto-Regulación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vols.map((vol) => (
        <div 
          key={vol.id} 
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800 border-l-4 border-l-emerald-500"
        >
          <div>
            {/* Status badge & Icon */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                En Línea Ahora
              </span>
              <div className="rounded-lg bg-slate-50 p-2 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <Activity className="h-5 w-5 text-emerald-500" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-950 dark:text-white leading-snug">{vol.nombre}</h3>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 uppercase tracking-wider">{vol.especialidad}</p>
            <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">Voluntario Autorizado</p>
          </div>

          {/* Call Action buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <a
              href={`tel:${vol.telefono}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 hover:bg-slate-50 py-2.5 text-sm font-semibold text-slate-800 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <Phone className="h-4 w-4" />
              Llamar
            </a>
            <a
              href={`https://wa.me/${vol.whatsapp}?text=Hola%20${encodeURIComponent(vol.nombre)},%20te%20contacto%20desde%20PsicoAyudaVenezuela.%20Necesito%20soporte%20psicológico.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/10 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
