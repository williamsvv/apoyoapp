"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useApp } from "./components/AppContext";
import ActiveGuards from "./components/ActiveGuards";

export default function Page() {
  const router = useRouter();
  const { voluntarios } = useApp();
  
  const guardiasActivas = voluntarios.filter(v => v.guardiaActiva && v.autorizado);

  return (
    <ActiveGuards
      vols={guardiasActivas}
      onNavigateToDirectory={() => router.push("/directorio")}
      onNavigateToDiagnostic={() => router.push("/diagnostico")}
    />
  );
}
