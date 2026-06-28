"use client";

import React, { useState } from "react";
import { Search, Phone, MessageSquare } from "lucide-react";
import { Voluntario } from "../models";

interface VolunteersDirectoryProps {
  voluntarios: Voluntario[];
}

export default function VolunteersDirectory({ voluntarios }: VolunteersDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todos");

  // Filter calculations
  const specialties = ["Todos", ...Array.from(new Set(voluntarios.filter(v => v.autorizado).map(v => {
    if (v.especialidad.toLowerCase().includes("ansiedad")) return "Ansiedad";
    if (v.especialidad.toLowerCase().includes("crisis")) return "Crisis";
    if (v.especialidad.toLowerCase().includes("duelo")) return "Duelo";
    if (v.especialidad.toLowerCase().includes("sueño") || v.especialidad.toLowerCase().includes("insomnio")) return "Sueño";
    return v.especialidad;
  })))].slice(0, 7);

  const filteredVoluntarios = voluntarios.filter(v => {
    if (!v.autorizado) return false;
    const matchesSearch = 
      v.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.especialidad.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedSpecialty === "Todos") return matchesSearch;
    
    if (selectedSpecialty === "Ansiedad") return matchesSearch && v.especialidad.toLowerCase().includes("ansiedad");
    if (selectedSpecialty === "Crisis") return matchesSearch && v.especialidad.toLowerCase().includes("crisis");
    if (selectedSpecialty === "Duelo") return matchesSearch && v.especialidad.toLowerCase().includes("duelo");
    if (selectedSpecialty === "Sueño") return matchesSearch && (v.especialidad.toLowerCase().includes("sueño") || v.especialidad.toLowerCase().includes("insomnio"));
    
    return matchesSearch && v.especialidad === selectedSpecialty;
  });

  return (
    <div className="flex-1 flex flex-col space-y-6 animate-fadeIn">
      {/* Search & Specialty Filter Layout */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 dark:bg-slate-900 dark:border-slate-800 shadow-sm space-y-4">
        
        {/* Search text input */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar voluntario por nombre o enfoque..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-emerald-500 focus:outline-none dark:text-white transition-colors"
          />
        </div>

        {/* Specialties scrollable horizontal filter */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Filtrar por especialidad
          </label>
          <div className="flex flex-wrap gap-2">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  selectedSpecialty === spec
                    ? "bg-slate-900 text-white border-slate-900 dark:bg-emerald-600 dark:border-emerald-600"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-950"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Volunteers List count */}
      <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
        Se encontraron {filteredVoluntarios.length} voluntarios autorizados
      </div>

      {/* Directory list of volunteers */}
      {filteredVoluntarios.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-md mx-auto dark:bg-slate-900 dark:border-slate-800">
          <Search className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <h4 className="font-bold text-slate-900 dark:text-white">Sin resultados</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Prueba reestableciendo los filtros o ingresando otro término de búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVoluntarios.map((vol) => (
            <div 
              key={vol.id} 
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-slate-950 dark:text-white leading-tight">{vol.nombre}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Especialista Autorizado</p>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md inline-block mt-2">
                    {vol.especialidad}
                  </p>
                </div>

                {/* Guard indicator status badge */}
                {vol.guardiaActiva ? (
                  <span className="shrink-0 inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    En Guardia
                  </span>
                ) : (
                  <span className="shrink-0 inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    Offline
                  </span>
                )}
              </div>

              {/* Connect buttons */}
              <div className="border-t border-slate-100 dark:border-slate-800 mt-4 pt-3 flex gap-2 justify-end">
                <a
                  href={`tel:${vol.telefono}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Llamar
                </a>
                <a
                  href={`https://wa.me/${vol.whatsapp}?text=Hola%20${encodeURIComponent(vol.nombre)},%20necesito%20orientación%20desde%20la%20plataforma%20PsicoAyuda.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
