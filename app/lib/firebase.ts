import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";
import { Voluntario, GrupoApoyo } from "../models";

// Configuración de Firebase del proyecto del usuario
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Determina si Firebase está configurado adecuadamente
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

export let app: FirebaseApp | undefined;
export let auth: Auth | undefined;
export let db: Firestore | undefined;
export let analytics: Analytics | undefined;

try {
  if (isFirebaseConfigured) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    if (typeof window !== "undefined" && firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
    }
  }
} catch (error) {
  console.error("Error al inicializar Firebase:", error);
}

// ==========================================
// MOCK DATABASE & AUTHENTICATION (Simulación)
// ==========================================

export const DEFAULT_VOLUNTARIOS: Voluntario[] = [
  {
    id: "vol-1",
    nombre: "Dra. Carolina Mendoza",
    email: "carolina.mendoza@psicoayuda.ve",
    especialidad: "Manejo de Ansiedad y Pánico",
    telefono: "+584141234567",
    whatsapp: "584141234567",
    guardiaActiva: true,
    autorizado: true,
  },
  {
    id: "vol-2",
    nombre: "Dr. Alejandro Silva",
    email: "alejandro.silva@psicoayuda.ve",
    especialidad: "Acompañamiento en Crisis y Trauma",
    telefono: "+584249876543",
    whatsapp: "584249876543",
    guardiaActiva: true,
    autorizado: true,
  },
  {
    id: "vol-3",
    nombre: "Lic. Mariana Gómez",
    email: "mariana.gomez@psicoayuda.ve",
    especialidad: "Apoyo en Procesos de Duelo",
    telefono: "+584125556677",
    whatsapp: "584125556677",
    guardiaActiva: false,
    autorizado: true,
  },
  {
    id: "vol-4",
    nombre: "Dr. Roberto Castillo",
    email: "roberto.castillo@psicoayuda.ve",
    especialidad: "Terapia Cognitivo-Conductual / Insomnio",
    telefono: "+584163334455",
    whatsapp: "584163334455",
    guardiaActiva: false,
    autorizado: true,
  },
  {
    id: "vol-5",
    nombre: "Lic. Andrea Ruiz",
    email: "andrea.ruiz@psicoayuda.ve",
    especialidad: "Psicología Infanto-Juvenil y Familias",
    telefono: "+584242221100",
    whatsapp: "584242221100",
    guardiaActiva: true,
    autorizado: true,
  }
];

export const DEFAULT_GRUPOS: GrupoApoyo[] = [
  {
    id: "grp-1",
    nombre: "Superación del Pánico y Ansiedad",
    descripcion: "Grupo terapéutico semanal enfocado en compartir experiencias y practicar técnicas cognitivo-conductuales de autorregulación.",
    modalidad: "online",
    lugarOrEnlace: "Sala de Zoom (Enlace enviado previo registro)",
    horario: "Todos los martes a las 6:30 PM (VET)",
    facilitador: "Dra. Carolina Mendoza",
  },
  {
    id: "grp-2",
    nombre: "Resiliencia post-desastres",
    descripcion: "Grupo de apoyo comunitario presencial enfocado en el manejo de emociones adaptativas y reducción del estrés post-traumático.",
    modalidad: "presencial",
    lugarOrEnlace: "Sede de la Cruz Roja, Av. Andrés Bello, Caracas",
    horario: "Sábados alternos a las 10:00 AM (VET)",
    facilitador: "Dr. Alejandro Silva",
  },
  {
    id: "grp-3",
    nombre: "Abrazando la Ausencia (Grupo de Duelo)",
    descripcion: "Un espacio seguro y confidencial para transitar las distintas dimensiones físicas y emocionales de la pérdida de seres queridos.",
    modalidad: "online",
    lugarOrEnlace: "Google Meet",
    horario: "Jueves quincenales a las 7:00 PM (VET)",
    facilitador: "Lic. Mariana Gómez",
  }
];

export const getStoredVoluntarios = (): Voluntario[] => {
  if (typeof window === "undefined") return DEFAULT_VOLUNTARIOS;
  const stored = localStorage.getItem("psicoayuda_voluntarios");
  if (!stored) {
    localStorage.setItem("psicoayuda_voluntarios", JSON.stringify(DEFAULT_VOLUNTARIOS));
    return DEFAULT_VOLUNTARIOS;
  }
  return JSON.parse(stored);
};

export const setStoredVoluntarios = (vols: Voluntario[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("psicoayuda_voluntarios", JSON.stringify(vols));
    window.dispatchEvent(new Event("psicoayuda_storage_change"));
  }
};

export const getStoredGrupos = (): GrupoApoyo[] => {
  if (typeof window === "undefined") return DEFAULT_GRUPOS;
  const stored = localStorage.getItem("psicoayuda_grupos");
  if (!stored) {
    localStorage.setItem("psicoayuda_grupos", JSON.stringify(DEFAULT_GRUPOS));
    return DEFAULT_GRUPOS;
  }
  return JSON.parse(stored);
};

export const getStoredUser = (): Voluntario | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("psicoayuda_current_user");
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user: Voluntario | null) => {
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("psicoayuda_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("psicoayuda_current_user");
    }
    window.dispatchEvent(new Event("psicoayuda_auth_change"));
  }
};

export const mockAuthListeners: ((user: Voluntario | null) => void)[] = [];
export const mockVolListeners: ((vols: Voluntario[]) => void)[] = [];

if (typeof window !== "undefined") {
  window.addEventListener("psicoayuda_auth_change", () => {
    const user = getStoredUser();
    mockAuthListeners.forEach(listener => listener(user));
  });
  window.addEventListener("psicoayuda_storage_change", () => {
    const vols = getStoredVoluntarios();
    mockVolListeners.forEach(listener => listener(vols));
  });
}

export const isFirebaseActive = () => {
  return isFirebaseConfigured;
};
