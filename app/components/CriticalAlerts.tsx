"use client";

import React from "react";
import { X, ShieldAlert } from "lucide-react";
import contentData from "../data/content.json";

export default function CriticalAlerts() {
  const { levels, protocol } = contentData.alertasCriticas;

  return (
    <div className="space-y-8 flex-1 animate-fadeIn">
      {/* Severity Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {levels.map((lvl, idx) => (
          <div 
            key={idx} 
            className={`bg-white border rounded-2xl p-6 shadow-sm dark:bg-slate-900 ${
              lvl.color === "red" 
                ? "border-red-200 dark:border-red-950 border-t-4 border-t-red-600" 
                : "border-amber-200 dark:border-amber-950 border-t-4 border-t-amber-500"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className={`h-2.5 w-2.5 rounded-full ${lvl.color === "red" ? "bg-red-600" : "bg-amber-500"}`} />
              <h3 className="font-extrabold text-lg text-slate-950 dark:text-white leading-tight">{lvl.status}</h3>
            </div>

            <ul className="space-y-3.5">
              {lvl.signs.map((sign, signIdx) => (
                <li key={signIdx} className="flex gap-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed align-top">
                  <X className={`h-4.5 w-4.5 shrink-0 ${lvl.color === "red" ? "text-red-500" : "text-amber-500"}`} />
                  <span>{sign}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Protocol Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl bg-emerald-600 p-2.5 text-white shadow-lg">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h3 className="font-extrabold text-xl">{protocol.title}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Protocol Steps list */}
          <div className="space-y-4">
            {protocol.steps.slice(0, 3).map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                  {step.startsWith("**") ? (
                    <>
                      <strong className="text-white font-bold">{step.split("**")[1]}</strong>
                      {step.split("**")[2]}
                    </>
                  ) : step}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {protocol.steps.slice(3).map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  {idx + 4}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                  {step.startsWith("**") ? (
                    <>
                      <strong className="text-white font-bold">{step.split("**")[1]}</strong>
                      {step.split("**")[2]}
                    </>
                  ) : step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
