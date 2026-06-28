import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  query, 
  where 
} from "firebase/firestore";
import { 
  db, 
  isFirebaseConfigured, 
  DEFAULT_VOLUNTARIOS 
} from "./firebase";
import { getStoredUser, setStoredUser } from "./auth";
import { Voluntario } from "../models";

// ==========================================
// MOCK STORAGE GETTERS & SETTERS (Voluntarios)
// ==========================================

export const mockVolListeners: ((vols: Voluntario[]) => void)[] = [];

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

if (typeof window !== "undefined") {
  window.addEventListener("psicoayuda_storage_change", () => {
    const vols = getStoredVoluntarios();
    mockVolListeners.forEach(listener => listener(vols));
  });
}

// ==========================================
// DB OPERATIONS
// ==========================================

// 1. Suscribirse a Voluntarios
export const subscribeToVoluntarios = (callback: (voluntarios: Voluntario[]) => void) => {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, "voluntarios"), where("autorizado", "==", true));
    return onSnapshot(q, (snapshot) => {
      const vols: Voluntario[] = [];
      snapshot.forEach((doc) => {
        vols.push({ id: doc.id, ...doc.data() } as Voluntario);
      });
      callback(vols);
    }, (error) => {
      console.error("Error en onSnapshot de voluntarios reales:", error);
    });
  } else {
    // Suscripción Mock
    const vols = getStoredVoluntarios();
    callback(vols);
    
    const handler = () => {
      callback(getStoredVoluntarios());
    };
    
    mockVolListeners.push(handler);
    return () => {
      const idx = mockVolListeners.indexOf(handler);
      if (idx !== -1) mockVolListeners.splice(idx, 1);
    };
  }
};

// 2. Cambiar Estado de Guardia Activa y Datos
export const updateVoluntarioData = async (
  id: string, 
  data: Partial<Omit<Voluntario, "id" | "email">>
) => {
  // Limpieza de whatsapp si se provee
  if (data.whatsapp) {
    let cleanWA = data.whatsapp.replace(/[+\s-]/g, "");
    if (!cleanWA.startsWith("58") && cleanWA.length > 0) {
      if (cleanWA.startsWith("0")) {
        cleanWA = "58" + cleanWA.substring(1);
      } else {
        cleanWA = "58" + cleanWA;
      }
    }
    data.whatsapp = cleanWA;
  }

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, "voluntarios", id);
    await updateDoc(docRef, data);
  } else {
    // Mock Update
    const vols = getStoredVoluntarios();
    const updated = vols.map(v => {
      if (v.id === id) {
        const updatedVol = { ...v, ...data };
        // Si el voluntario editado es el usuario actualmente logueado, actualizar su sesión
        const currentUser = getStoredUser();
        if (currentUser && currentUser.id === id) {
          setTimeout(() => setStoredUser(updatedVol), 50);
        }
        return updatedVol;
      }
      return v;
    });
    setStoredVoluntarios(updated);
  }
};
