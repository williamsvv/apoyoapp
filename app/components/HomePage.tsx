"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "./AppContext";
import { getNavigationItems } from "../routes";
import content from "../data/content.json";

// Import UI Components
import EmergencyBanner from "./EmergencyBanner";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import MobileDrawer from "./MobileDrawer";
import VolunteerModal from "./VolunteerModal";

interface HomePageProps {
  children: React.ReactNode;
}

export default function HomePage({ children }: HomePageProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const { voluntarios, grupos, isAuthModalOpen, setIsAuthModalOpen } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const guardiasActivas = voluntarios.filter(v => v.guardiaActiva && v.autorizado);
  const hasActiveGuard = guardiasActivas.length > 0;
  
  const navigationItems = getNavigationItems(hasActiveGuard, grupos.length);
  // Find current tab details based on path
  const activeTabDetails = navigationItems.find(item => item.path === pathname) || navigationItems[0];

  const handleBannerAction = () => {
    router.push("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Determine section titles dynamically based on current path
  const getSectionTitle = () => {
    switch (pathname) {
      case "/":
        return "Guardias Activas (Atención Inmediata)";
      case "/directorio":
        return "Directorio de Voluntarios";
      case "/grupos":
        return "Grupos de Apoyo Mutuo";
      case "/diagnostico":
        return content.diagnosticoRapido.title;
      case "/reacciones":
        return content.reaccionesSismo.title;
      case "/alertas":
        return content.alertasCriticas.title;
      case "/duelo":
        return content.manifestacionesDuelo.title;
      case "/habitos":
        return content.habitosSaludables.title;
      default:
        return activeTabDetails?.label;
    }
  };

  const getSectionSubtitle = () => {
    switch (pathname) {
      case "/":
        return "Profesionales de la salud mental disponibles en este momento para brindarte primeros auxilios psicológicos gratuitos mediante llamada telefónica o WhatsApp.";
      case "/directorio":
        return content.diagnosticoRapido.subtitle;
      case "/grupos":
        return "Encuentra comunidades y círculos guiados por psicólogos especializados, tanto online como presenciales en Venezuela.";
      case "/diagnostico":
        return content.diagnosticoRapido.subtitle;
      case "/reacciones":
        return content.reaccionesSismo.subtitle;
      case "/alertas":
        return content.alertasCriticas.subtitle;
      case "/duelo":
        return content.manifestacionesDuelo.subtitle;
      case "/habitos":
        return content.habitosSaludables.subtitle;
      default:
        return activeTabDetails?.description;
    }
  };

  return (
    <div className="flex flex-1 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. DESKTOP SIDEBAR */}
      <Sidebar />

      {/* 2. MAIN CONTAINER */}
      <div className="flex-1 flex flex-col md:pl-80 pb-20 md:pb-6">
        
        {/* Emergency Alert Banner */}
        <EmergencyBanner
          bannerText={content.general.emergencyBanner.text}
          actionText={content.general.emergencyBanner.action}
          onAction={handleBannerAction}
        />

        {/* Mobile App Header */}
        <Header />

        {/* Central Content Area */}
        <main className="max-w-5xl w-full mx-auto px-4 py-6 flex-1 flex flex-col">
          
          {/* Header Title & Intro info */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
              <span>Sección Activa</span>
              <span className="h-1 w-1 bg-slate-300 rounded-full" />
              <span className="text-emerald-600 dark:text-emerald-400">
                {activeTabDetails?.label}
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              {getSectionTitle()}
            </h2>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              {getSectionSubtitle()}
            </p>
          </div>

          {/* Render nested children route */}
          <div className="flex-1">
            {children}
          </div>

        </main>

        {/* Global Footer */}
        <Footer
          disclaimer={content.general.footer.disclaimer}
          credits={content.general.footer.credits}
        />
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION */}
      <BottomNav onMoreClick={() => setIsMobileMenuOpen(true)} />

      {/* 4. MOBILE SLIDE-UP NAVIGATION DRAWER */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* 5. VOLUNTEER AUTHENTICATION MODAL */}
      <VolunteerModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
}
