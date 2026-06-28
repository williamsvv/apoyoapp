import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./components/AppContext";
import HomePage from "./components/HomePage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PsicoAyudaVenezuela | Soporte Psicológico Gratuito y Profesional",
  description: "Plataforma de soporte y orientación psicológica gratuita y confidencial para todos los venezolanos en momentos de crisis, duelo, pánico y ansiedad.",
  keywords: ["psicologia", "ayuda gratis", "venezuela", "salud mental", "ansiedad", "ataque de panico", "duelo", "sismo", "emergencia psicologica"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
        <AppProvider>
          <HomePage>{children}</HomePage>
        </AppProvider>
      </body>
    </html>
  );
}


