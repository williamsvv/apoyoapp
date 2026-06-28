import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { 
  auth, 
  db, 
  isFirebaseConfigured 
} from "./firebase";
import { getStoredVoluntarios, setStoredVoluntarios } from "./voluntarios";
import { Voluntario } from "../models";

// ==========================================
// MOCK STORAGE GETTERS & SETTERS (Auth / User)
// ==========================================

export const mockAuthListeners: ((user: Voluntario | null) => void)[] = [];

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

if (typeof window !== "undefined") {
  window.addEventListener("psicoayuda_auth_change", () => {
    const user = getStoredUser();
    mockAuthListeners.forEach(listener => listener(user));
  });
}

// ==========================================
// DB OPERATIONS
// ==========================================

// 1. Suscribirse al Estado de Autenticación
export const subscribeToAuth = (callback: (user: Voluntario | null) => void) => {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        callback({
          id: fbUser.uid,
          nombre: fbUser.displayName || fbUser.email?.split("@")[0] || "Voluntario",
          email: fbUser.email || "",
          especialidad: "Psicólogo Voluntario",
          telefono: "",
          whatsapp: "",
          guardiaActiva: false,
          autorizado: true,
        });
      } else {
        callback(null);
      }
    });
  } else {
    // Suscripción Mock
    callback(getStoredUser());
    const handler = (user: Voluntario | null) => {
      callback(user);
    };
    mockAuthListeners.push(handler);
    return () => {
      const idx = mockAuthListeners.indexOf(handler);
      if (idx !== -1) mockAuthListeners.splice(idx, 1);
    };
  }
};

// 2. Iniciar Sesión de Voluntario
export const loginVoluntario = async (email: string, pass: string): Promise<Voluntario> => {
  if (isFirebaseConfigured && auth) {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return {
      id: cred.user.uid,
      nombre: cred.user.displayName || "Voluntario",
      email: cred.user.email || "",
      especialidad: "Psicólogo Voluntario",
      telefono: "",
      whatsapp: "",
      guardiaActiva: false,
      autorizado: true,
    };
  } else {
    // Mock Login
    const vols = getStoredVoluntarios();
    let user = vols.find(v => v.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      user = {
        id: "vol-mock-" + Math.random().toString(36).substr(2, 9),
        nombre: email.split("@")[0].replace(".", " "),
        email: email,
        especialidad: "Psicología General",
        telefono: "+584120000000",
        whatsapp: "584120000000",
        guardiaActiva: false,
        autorizado: true
      };
      const updated = [...vols, user];
      setStoredVoluntarios(updated);
    }
    
    setStoredUser(user);
    return user;
  }
};

// 3. Registrar Voluntario
export const registerVoluntario = async (
  nombre: string,
  email: string,
  pass: string,
  especialidad: string,
  telefono: string,
  whatsapp: string
): Promise<Voluntario> => {
  let cleanWhatsApp = whatsapp.replace(/[+\s-]/g, "");
  if (!cleanWhatsApp.startsWith("58") && cleanWhatsApp.length > 0) {
    if (cleanWhatsApp.startsWith("0")) {
      cleanWhatsApp = "58" + cleanWhatsApp.substring(1);
    } else {
      cleanWhatsApp = "58" + cleanWhatsApp;
    }
  }

  if (isFirebaseConfigured && auth && db) {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const newVol: Voluntario = {
      id: cred.user.uid,
      nombre,
      email,
      especialidad,
      telefono,
      whatsapp: cleanWhatsApp,
      guardiaActiva: false,
      autorizado: true,
    };
    
    await setDoc(doc(db, "voluntarios", cred.user.uid), newVol);
    return newVol;
  } else {
    // Mock Register
    const vols = getStoredVoluntarios();
    if (vols.some(v => v.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("El correo electrónico ya se encuentra registrado.");
    }
    
    const newVol: Voluntario = {
      id: "vol-mock-" + Math.random().toString(36).substr(2, 9),
      nombre,
      email,
      especialidad,
      telefono,
      whatsapp: cleanWhatsApp,
      guardiaActiva: false,
      autorizado: true,
    };
    
    const updated = [...vols, newVol];
    setStoredVoluntarios(updated);
    setStoredUser(newVol);
    return newVol;
  }
};

// 4. Cerrar Sesión
export const logoutVoluntario = async () => {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  } else {
    setStoredUser(null);
  }
};
