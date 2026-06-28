"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { subscribeToVoluntarios } from "../lib/voluntarios";
import { subscribeToGrupos } from "../lib/grupos";
import { subscribeToAuth } from "../lib/auth";
import { Voluntario, GrupoApoyo } from "../models";

interface AppContextType {
  voluntarios: Voluntario[];
  grupos: GrupoApoyo[];
  currentUser: Voluntario | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [grupos, setGrupos] = useState<GrupoApoyo[]>([]);
  const [currentUser, setCurrentUser] = useState<Voluntario | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubVols = subscribeToVoluntarios((data) => {
      setVoluntarios(data);
    });
    
    const unsubGrupos = subscribeToGrupos((data) => {
      setGrupos(data);
    });

    const unsubAuth = subscribeToAuth((user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubVols();
      unsubGrupos();
      unsubAuth();
    };
  }, []);

  return (
    <AppContext.Provider value={{
      voluntarios,
      grupos,
      currentUser,
      isAuthModalOpen,
      setIsAuthModalOpen
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp debe utilizarse dentro de un AppProvider");
  }
  return context;
}
