import { collection, onSnapshot } from "firebase/firestore";
import { db, isFirebaseConfigured, DEFAULT_GRUPOS } from "./firebase";
import { GrupoApoyo } from "../models";

// ==========================================
// MOCK STORAGE GETTER (Grupos)
// ==========================================

export const getStoredGrupos = (): GrupoApoyo[] => {
  if (typeof window === "undefined") return DEFAULT_GRUPOS;
  const stored = localStorage.getItem("psicoayuda_grupos");
  if (!stored) {
    localStorage.setItem("psicoayuda_grupos", JSON.stringify(DEFAULT_GRUPOS));
    return DEFAULT_GRUPOS;
  }
  return JSON.parse(stored);
};

// ==========================================
// DB OPERATIONS
// ==========================================

// Suscribirse a Grupos de Apoyo
export const subscribeToGrupos = (callback: (grupos: GrupoApoyo[]) => void) => {
  if (isFirebaseConfigured && db) {
    return onSnapshot(collection(db, "grupos"), (snapshot) => {
      const grps: GrupoApoyo[] = [];
      snapshot.forEach((doc) => {
        grps.push({ id: doc.id, ...doc.data() } as GrupoApoyo);
      });
      callback(grps);
    }, (error) => {
      console.error("Error en onSnapshot de grupos reales:", error);
    });
  } else {
    // Suscripción Mock
    const grps = getStoredGrupos();
    callback(grps);
    return () => {};
  }
};
