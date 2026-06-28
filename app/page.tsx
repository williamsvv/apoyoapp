"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import type { HelpRequest, Professional, SupportGroup, UrgencyLevel } from "@/lib/types";

type Tab = "patient" | "professionals" | "dashboard" | "groups";
type AuthMode = "login" | "register";
type ProfessionalSession = Professional & { email: string };

const seededProfessionals: Professional[] = [
  {
    id: "p1",
    name: "Dra. Laura Medina",
    email: "laura@apoyoapp.demo",
    role: "Psicologo",
    specialty: "Ansiedad, crisis y primeros auxilios psicologicos",
    license: "FPV-1024",
    availability: "En guardia",
    whatsapp: "584120000000"
  },
  {
    id: "p2",
    name: "Dr. Andres Rivas",
    email: "andres@apoyoapp.demo",
    role: "Psiquiatra",
    specialty: "Evaluacion psiquiatrica y seguimiento farmacologico",
    license: "MPPS-8821",
    availability: "Disponible hoy",
    whatsapp: "584140000000"
  },
  {
    id: "p3",
    name: "Lic. Camila Torres",
    email: "camila@apoyoapp.demo",
    role: "Psicologo",
    specialty: "Depresion, duelo y apoyo familiar",
    license: "FPV-3417",
    availability: "En guardia",
    whatsapp: "584240000000"
  }
];

const supportGroups: SupportGroup[] = [
  {
    id: "g1",
    title: "Grupo de apoyo para ansiedad",
    schedule: "Martes, 7:00 PM",
    format: "Online",
    description: "Espacio moderado para compartir herramientas de regulacion emocional."
  },
  {
    id: "g2",
    title: "Familiares y cuidadores",
    schedule: "Jueves, 6:30 PM",
    format: "Online",
    description: "Orientacion para personas que acompanan a alguien en crisis o tratamiento."
  },
  {
    id: "g3",
    title: "Duelo y cambios vitales",
    schedule: "Sabados, 10:00 AM",
    format: "Presencial",
    description: "Acompanamiento grupal con pautas practicas y contencion profesional."
  }
];

const defaultHelpForm = {
  name: "",
  age: "",
  contactMethod: "whatsapp" as HelpRequest["contactMethod"],
  phone: "",
  symptoms: "",
  duration: "",
  urgency: "medium" as UrgencyLevel,
  safetyRisk: false,
  preferredSupport: "either" as HelpRequest["preferredSupport"]
};

const defaultProfessionalForm = {
  name: "",
  email: "",
  password: "",
  role: "Psicologo" as Professional["role"],
  specialty: "",
  license: "",
  whatsapp: "",
  availability: "En guardia" as Professional["availability"]
};

const demoRequestsKey = "apoyoapp_demo_requests";
const demoProfessionalsKey = "apoyoapp_demo_professionals";
const demoSessionKey = "apoyoapp_demo_professional_session";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : fallback;
}

function writeStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function readDemoRequests(): HelpRequest[] {
  return readStorage<HelpRequest[]>(demoRequestsKey, []);
}

function readDemoProfessionals(): ProfessionalSession[] {
  return readStorage<ProfessionalSession[]>(demoProfessionalsKey, []);
}

function writeDemoProfessionals(professionals: ProfessionalSession[]) {
  writeStorage(demoProfessionalsKey, professionals);
}

async function fetchDemoRequests() {
  const response = await fetch("/api/demo/requests", { cache: "no-store" });
  if (!response.ok) throw new Error("No se pudieron cargar las solicitudes demo.");
  return (await response.json()) as HelpRequest[];
}

async function createDemoRequest(payload: Omit<HelpRequest, "id" | "createdAt">) {
  const response = await fetch("/api/demo/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("No se pudo crear la solicitud demo.");
  return (await response.json()) as HelpRequest;
}

async function updateDemoRequest(id: string, payload: Partial<HelpRequest>) {
  const response = await fetch(`/api/demo/requests/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("No se pudo actualizar la solicitud demo.");
  return (await response.json()) as HelpRequest;
}

async function fetchDemoProfessionals() {
  const response = await fetch("/api/demo/professionals", { cache: "no-store" });
  if (!response.ok) throw new Error("No se pudieron cargar los profesionales demo.");
  return (await response.json()) as ProfessionalSession[];
}

async function createDemoProfessional(payload: Omit<ProfessionalSession, "id">) {
  const response = await fetch("/api/demo/professionals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("No se pudo crear el profesional demo.");
  return (await response.json()) as ProfessionalSession;
}

function urgencyLabel(urgency: UrgencyLevel) {
  const labels: Record<UrgencyLevel, string> = {
    low: "Baja",
    medium: "Media",
    high: "Alta",
    critical: "Critica"
  };
  return labels[urgency];
}

function supportLabel(value: HelpRequest["preferredSupport"]) {
  const labels: Record<HelpRequest["preferredSupport"], string> = {
    either: "Cualquier profesional",
    psychologist: "Psicologo",
    psychiatrist: "Psiquiatra"
  };
  return labels[value];
}

function contactLabel(value: HelpRequest["contactMethod"]) {
  const labels: Record<HelpRequest["contactMethod"], string> = {
    whatsapp: "WhatsApp",
    phone: "Telefono",
    in_app: "Solo por la app"
  };
  return labels[value];
}

function whatsappHref(phone?: string, message?: string) {
  if (!phone) return undefined;
  const cleanPhone = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message ?? "")}`;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("patient");
  const [helpForm, setHelpForm] = useState(defaultHelpForm);
  const [professionalForm, setProfessionalForm] = useState(defaultProfessionalForm);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [registeredProfessionals, setRegisteredProfessionals] = useState<ProfessionalSession[]>([]);
  const [professionalSession, setProfessionalSession] = useState<ProfessionalSession | null>(null);
  const [submitState, setSubmitState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [authState, setAuthState] = useState<"idle" | "saving" | "error">("idle");
  const [authError, setAuthError] = useState("");

  async function refreshDemoData() {
    const [nextRequests, nextProfessionals] = await Promise.all([
      fetchDemoRequests().catch(() => readDemoRequests()),
      fetchDemoProfessionals().catch(() => readDemoProfessionals())
    ]);
    setRequests(nextRequests);
    setRegisteredProfessionals(nextProfessionals);
  }

  useEffect(() => {
    if (!db) {
      const timer = window.setTimeout(() => {
        void refreshDemoData();
        setProfessionalSession(readStorage<ProfessionalSession | null>(demoSessionKey, null));
      }, 0);
      return () => window.clearTimeout(timer);
    }

    return onSnapshot(collection(db, "professionals"), (snapshot) => {
      setRegisteredProfessionals(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as Omit<ProfessionalSession, "id">)
        }))
      );
    });
  }, []);

  useEffect(() => {
    if (db) return;

    const refresh = () => {
      void refreshDemoData();
    };

    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  useEffect(() => {
    if (!db) return;
    if (!professionalSession) return;

    const requestsQuery = query(collection(db, "helpRequests"), orderBy("createdAt", "desc"));
    return onSnapshot(requestsQuery, (snapshot) => {
      setRequests(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as Omit<HelpRequest, "id">)
        }))
      );
    });
  }, [professionalSession]);

  useEffect(() => {
    if (!auth || !db) return;
    const firebaseAuth = auth;
    const firestore = db;

    return firebaseAuth.onAuthStateChanged(async (user) => {
      if (!user) {
        setProfessionalSession(null);
        return;
      }

      const profile = await getDoc(doc(firestore, "professionals", user.uid));
      if (!profile.exists()) {
        setProfessionalSession(null);
        return;
      }

      setProfessionalSession({
        id: user.uid,
        email: user.email ?? "",
        ...(profile.data() as Omit<ProfessionalSession, "id" | "email">)
      });
    });
  }, []);

  const professionals = useMemo(
    () => [...seededProfessionals, ...registeredProfessionals],
    [registeredProfessionals]
  );

  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status !== "closed"),
    [requests]
  );

  const criticalRequests = pendingRequests.filter((request) => request.urgency === "critical" || request.safetyRisk);

  async function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("saving");

    const payload = {
      ...helpForm,
      name: helpForm.name.trim() || "Persona sin nombre publico",
      status: "pending" as const
    };

    try {
      if (db) {
        await addDoc(collection(db, "helpRequests"), {
          ...payload,
          createdAt: serverTimestamp()
        });
      } else {
        await createDemoRequest(payload);
        const nextRequests = await fetchDemoRequests();
        setRequests(nextRequests);
      }

      setHelpForm(defaultHelpForm);
      setSubmitState("saved");
      setActiveTab("dashboard");
    } catch (error) {
      console.error(error);
      setSubmitState("error");
    }
  }

  async function handleProfessionalAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthState("saving");
    setAuthError("");

    try {
      const email = professionalForm.email.trim().toLowerCase();

      if (!auth || !db) {
        const existing = await fetchDemoProfessionals().catch(() => readDemoProfessionals());

        if (authMode === "login") {
          const professional = existing.find((item) => item.email.toLowerCase() === email);
          if (!professional) {
            throw new Error("No existe un profesional demo con ese correo. Registralo primero.");
          }
          await refreshDemoData();
          setProfessionalSession(professional);
          writeStorage(demoSessionKey, professional);
          setAuthState("idle");
          return;
        }

        const professional = await createDemoProfessional({
          name: professionalForm.name.trim(),
          email,
          role: professionalForm.role,
          specialty: professionalForm.specialty.trim(),
          license: professionalForm.license.trim(),
          whatsapp: professionalForm.whatsapp.trim(),
          availability: professionalForm.availability
        });
        const nextProfessionals = await fetchDemoProfessionals();
        writeDemoProfessionals(nextProfessionals);
        writeStorage(demoSessionKey, professional);
        setRequests(await fetchDemoRequests());
        setRegisteredProfessionals(nextProfessionals);
        setProfessionalSession(professional);
        setProfessionalForm(defaultProfessionalForm);
        setAuthState("idle");
        return;
      }

      if (authMode === "login") {
        await auth.signInWithEmailAndPassword(email, professionalForm.password);
        setAuthState("idle");
        return;
      }

      const credential = await auth.createUserWithEmailAndPassword(email, professionalForm.password);
      if (!credential.user) {
        throw new Error("Firebase no devolvio el usuario creado.");
      }
      const professionalProfile: Omit<ProfessionalSession, "id" | "email"> = {
        name: professionalForm.name.trim(),
        role: professionalForm.role,
        specialty: professionalForm.specialty.trim(),
        license: professionalForm.license.trim(),
        whatsapp: professionalForm.whatsapp.trim(),
        availability: professionalForm.availability
      };

      await setDoc(doc(db, "professionals", credential.user.uid), {
        email,
        ...professionalProfile,
        createdAt: serverTimestamp()
      });
      setProfessionalSession({
        id: credential.user.uid,
        email,
        ...professionalProfile
      });
      setProfessionalForm(defaultProfessionalForm);
      setAuthState("idle");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo autenticar el profesional.";
      setAuthError(message);
      setAuthState("error");
    }
  }

  async function logoutProfessional() {
    if (auth) {
      await auth.signOut();
      setRequests([]);
      return;
    }
    window.localStorage.removeItem(demoSessionKey);
    setProfessionalSession(null);
  }

  async function acceptRequest(request: HelpRequest) {
    if (!professionalSession) return;

    if (db) {
      await updateDoc(doc(db, "helpRequests", request.id), {
        status: "accepted",
        assignedTo: professionalSession.name,
        assignedProfessionalId: professionalSession.id
      });
      return;
    }

    const nextRequests = readDemoRequests().map((item) =>
      item.id === request.id
        ? {
            ...item,
            status: "accepted" as const,
            assignedTo: professionalSession.name,
            assignedProfessionalId: professionalSession.id
          }
        : item
    );
    await updateDemoRequest(request.id, {
      status: "accepted",
      assignedTo: professionalSession.name,
      assignedProfessionalId: professionalSession.id
    });
    setRequests(await fetchDemoRequests().catch(() => nextRequests));
  }

  async function closeRequest(request: HelpRequest) {
    if (db) {
      await updateDoc(doc(db, "helpRequests", request.id), {
        status: "closed"
      });
      return;
    }

    const fallbackRequests = readDemoRequests().map((item) =>
      item.id === request.id ? { ...item, status: "closed" as const } : item
    );
    await updateDemoRequest(request.id, { status: "closed" });
    setRequests(await fetchDemoRequests().catch(() => fallbackRequests));
  }

  const titleByTab: Record<Tab, string> = {
    patient: "Solicitar apoyo ahora",
    professionals: "Profesionales en guardia",
    dashboard: professionalSession ? "Panel profesional" : "Ingreso profesional",
    groups: "Grupos de apoyo"
  };

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <h1>ApoyoApp</h1>
          <p>Conexion rapida con psicologos, psiquiatras y redes de apoyo.</p>
        </div>

        <nav className="nav" aria-label="Secciones principales">
          <button className={activeTab === "patient" ? "active" : ""} onClick={() => setActiveTab("patient")}>
            Solicitar ayuda
          </button>
          <button
            className={activeTab === "professionals" ? "active" : ""}
            onClick={() => setActiveTab("professionals")}
          >
            Profesionales
          </button>
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Panel profesional
          </button>
          <button className={activeTab === "groups" ? "active" : ""} onClick={() => setActiveTab("groups")}>
            Grupos de apoyo
          </button>
        </nav>

        <p className="sidebar-note">
          Si existe riesgo inmediato para ti o para otra persona, contacta servicios de emergencia locales antes de
          usar la app.
        </p>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <h2>{titleByTab[activeTab]}</h2>
            <p>
              Las personas registran sintomas y datos de contacto. Los profesionales ingresan a un panel privado para
              ver solicitudes abiertas y tomar casos.
            </p>
          </div>
          <span className="status-pill">
            {isFirebaseConfigured ? "Firebase activo" : "Modo demo local"} | {pendingRequests.length} alertas abiertas
          </span>
        </header>

        {activeTab === "patient" && (
          <div className="grid">
            <section className="panel">
              <h3>Cuentanos que esta pasando</h3>
              <form onSubmit={submitRequest} className="form-grid">
                <div className="field">
                  <label htmlFor="name">Nombre o alias</label>
                  <input
                    id="name"
                    value={helpForm.name}
                    onChange={(event) => setHelpForm({ ...helpForm, name: event.target.value })}
                    placeholder="Ej. Maria"
                  />
                </div>
                <div className="field">
                  <label htmlFor="age">Edad</label>
                  <input
                    id="age"
                    value={helpForm.age}
                    onChange={(event) => setHelpForm({ ...helpForm, age: event.target.value })}
                    placeholder="Ej. 29"
                  />
                </div>
                <div className="field">
                  <label htmlFor="contactMethod">Metodo de contacto</label>
                  <select
                    id="contactMethod"
                    value={helpForm.contactMethod}
                    onChange={(event) =>
                      setHelpForm({ ...helpForm, contactMethod: event.target.value as HelpRequest["contactMethod"] })
                    }
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="phone">Telefono</option>
                    <option value="in_app">Solo por la app</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="phone">Telefono o WhatsApp</label>
                  <input
                    id="phone"
                    value={helpForm.phone}
                    onChange={(event) => setHelpForm({ ...helpForm, phone: event.target.value })}
                    placeholder="+58 412 000 0000"
                  />
                </div>
                <div className="field">
                  <label htmlFor="urgency">Intensidad percibida</label>
                  <select
                    id="urgency"
                    value={helpForm.urgency}
                    onChange={(event) => setHelpForm({ ...helpForm, urgency: event.target.value as UrgencyLevel })}
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="critical">Critica</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="preferredSupport">Tipo de profesional</label>
                  <select
                    id="preferredSupport"
                    value={helpForm.preferredSupport}
                    onChange={(event) =>
                      setHelpForm({
                        ...helpForm,
                        preferredSupport: event.target.value as HelpRequest["preferredSupport"]
                      })
                    }
                  >
                    <option value="either">Cualquiera disponible</option>
                    <option value="psychologist">Psicologo</option>
                    <option value="psychiatrist">Psiquiatra</option>
                  </select>
                </div>
                <div className="field full">
                  <label htmlFor="duration">Desde cuando ocurre</label>
                  <input
                    id="duration"
                    value={helpForm.duration}
                    onChange={(event) => setHelpForm({ ...helpForm, duration: event.target.value })}
                    placeholder="Ej. desde hace dos semanas, empeoro hoy"
                    required
                  />
                </div>
                <div className="field full">
                  <label htmlFor="symptoms">Sintomas y contexto</label>
                  <textarea
                    id="symptoms"
                    value={helpForm.symptoms}
                    onChange={(event) => setHelpForm({ ...helpForm, symptoms: event.target.value })}
                    placeholder="Describe sintomas, detonantes, antecedentes relevantes y que tipo de ayuda buscas."
                    required
                  />
                </div>
                <label className="checkbox-row field full">
                  <input
                    type="checkbox"
                    checked={helpForm.safetyRisk}
                    onChange={(event) => setHelpForm({ ...helpForm, safetyRisk: event.target.checked })}
                  />
                  <span>Hay ideas de hacerse dano, dano a otra persona, confusion severa o riesgo inmediato.</span>
                </label>
                {helpForm.safetyRisk && (
                  <div className="alert field full">
                    Esta plataforma no reemplaza una emergencia. Si hay peligro inmediato, llama a emergencias locales o
                    acude al centro de salud mas cercano.
                  </div>
                )}
                {submitState === "saved" && (
                  <div className="alert success field full">
                    Solicitud registrada. Un profesional con sesion iniciada podra verla en el panel.
                  </div>
                )}
                {submitState === "error" && (
                  <div className="alert field full">No se pudo guardar la solicitud. Revisa Firebase o intenta de nuevo.</div>
                )}
                <div className="button-row field full">
                  <button className="btn" disabled={submitState === "saving"} type="submit">
                    {submitState === "saving" ? "Enviando..." : "Solicitar profesional"}
                  </button>
                  <button className="btn secondary" type="button" onClick={() => setActiveTab("dashboard")}>
                    Soy profesional
                  </button>
                </div>
              </form>
            </section>

            <aside className="panel">
              <h3>Informacion que vera el profesional</h3>
              <div className="stack">
                <div className="card">
                  <h4>Datos de contacto</h4>
                  <p>Nombre o alias, edad, telefono y canal preferido para responder.</p>
                </div>
                <div className="card">
                  <h4>Sintomas y duracion</h4>
                  <p>Resumen claro para evaluar prioridad y tipo de apoyo recomendado.</p>
                </div>
                <div className="card">
                  <h4>Riesgo y urgencia</h4>
                  <p>Las solicitudes criticas quedan destacadas en el panel profesional.</p>
                </div>
              </div>
            </aside>
          </div>
        )}

        {activeTab === "professionals" && (
          <section className="directory-grid">
            {professionals.map((professional) => (
              <article className="card" key={professional.id}>
                <div className="card-header">
                  <div>
                    <h4>{professional.name}</h4>
                    <p>{professional.role}</p>
                  </div>
                  <span className="tag">{professional.availability}</span>
                </div>
                <p className="request-body">{professional.specialty}</p>
                <div className="meta">
                  {professional.license && <span className="tag">Matricula: {professional.license}</span>}
                  {professional.email && <span className="tag">{professional.email}</span>}
                </div>
                <div className="button-row">
                  {professional.whatsapp && (
                    <a
                      className="btn secondary"
                      href={whatsappHref(professional.whatsapp, "Hola, vi tu perfil en ApoyoApp.")}
                      target="_blank"
                    >
                      Contactar por WhatsApp
                    </a>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}

        {activeTab === "dashboard" && !professionalSession && (
          <div className="auth-grid">
            <section className="panel">
              <div className="segmented" role="tablist" aria-label="Acceso profesional">
                <button className={authMode === "login" ? "active" : ""} onClick={() => setAuthMode("login")}>
                  Ingresar
                </button>
                <button className={authMode === "register" ? "active" : ""} onClick={() => setAuthMode("register")}>
                  Registrarme
                </button>
              </div>

              <h3>{authMode === "login" ? "Login para profesionales" : "Registro de profesional"}</h3>
              <form onSubmit={handleProfessionalAuth} className="form-grid">
                {authMode === "register" && (
                  <>
                    <div className="field">
                      <label htmlFor="professionalName">Nombre completo</label>
                      <input
                        id="professionalName"
                        value={professionalForm.name}
                        onChange={(event) => setProfessionalForm({ ...professionalForm, name: event.target.value })}
                        placeholder="Ej. Dra. Laura Medina"
                        required
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="professionalRole">Rol</label>
                      <select
                        id="professionalRole"
                        value={professionalForm.role}
                        onChange={(event) =>
                          setProfessionalForm({ ...professionalForm, role: event.target.value as Professional["role"] })
                        }
                      >
                        <option value="Psicologo">Psicologo</option>
                        <option value="Psiquiatra">Psiquiatra</option>
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="license">Matricula o credencial</label>
                      <input
                        id="license"
                        value={professionalForm.license}
                        onChange={(event) => setProfessionalForm({ ...professionalForm, license: event.target.value })}
                        placeholder="Ej. FPV-1024"
                        required
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="professionalWhatsapp">WhatsApp profesional</label>
                      <input
                        id="professionalWhatsapp"
                        value={professionalForm.whatsapp}
                        onChange={(event) =>
                          setProfessionalForm({ ...professionalForm, whatsapp: event.target.value })
                        }
                        placeholder="+58 412 000 0000"
                      />
                    </div>
                    <div className="field full">
                      <label htmlFor="specialty">Especialidad</label>
                      <input
                        id="specialty"
                        value={professionalForm.specialty}
                        onChange={(event) =>
                          setProfessionalForm({ ...professionalForm, specialty: event.target.value })
                        }
                        placeholder="Ej. crisis, ansiedad, depresion, psiquiatria adulta"
                        required
                      />
                    </div>
                  </>
                )}
                <div className="field">
                  <label htmlFor="professionalEmail">Correo</label>
                  <input
                    id="professionalEmail"
                    type="email"
                    value={professionalForm.email}
                    onChange={(event) => setProfessionalForm({ ...professionalForm, email: event.target.value })}
                    placeholder="profesional@correo.com"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="professionalPassword">Clave</label>
                  <input
                    id="professionalPassword"
                    type="password"
                    value={professionalForm.password}
                    onChange={(event) => setProfessionalForm({ ...professionalForm, password: event.target.value })}
                    placeholder="Minimo 6 caracteres"
                    required={Boolean(auth)}
                    minLength={auth ? 6 : undefined}
                  />
                </div>
                {authError && <div className="alert field full">{authError}</div>}
                {!isFirebaseConfigured && (
                  <div className="alert success field full">
                    Modo demo: registra un profesional y luego podras entrar con el mismo correo. La clave no se valida
                    hasta activar Firebase Auth.
                  </div>
                )}
                <div className="button-row field full">
                  <button className="btn" disabled={authState === "saving"} type="submit">
                    {authState === "saving" ? "Procesando..." : authMode === "login" ? "Entrar al panel" : "Crear perfil"}
                  </button>
                </div>
              </form>
            </section>

            <aside className="panel">
              <h3>Que vera al entrar</h3>
              <div className="stack">
                <div className="metric">
                  <strong>{pendingRequests.length}</strong>
                  <span>Solicitudes abiertas</span>
                </div>
                <div className="metric danger">
                  <strong>{criticalRequests.length}</strong>
                  <span>Solicitudes criticas</span>
                </div>
                <div className="card">
                  <h4>Informacion visible</h4>
                  <p>Nombre, edad, sintomas, duracion, urgencia, canal de contacto y telefono si fue compartido.</p>
                </div>
              </div>
            </aside>
          </div>
        )}

        {activeTab === "dashboard" && professionalSession && (
          <div className="grid">
            <section className="panel">
              <div className="dashboard-head">
                <div>
                  <h3>Solicitudes entrantes</h3>
                  <p>
                    Sesion: {professionalSession.name} | {professionalSession.role}
                  </p>
                </div>
                <div className="dashboard-actions">
                  {!isFirebaseConfigured && (
                    <button className="btn secondary" onClick={refreshDemoData}>
                      Actualizar solicitudes
                    </button>
                  )}
                  <button className="btn secondary" onClick={logoutProfessional}>
                    Cerrar sesion
                  </button>
                </div>
              </div>

              <div className="stat-row">
                <div className="metric">
                  <strong>{pendingRequests.length}</strong>
                  <span>Abiertas</span>
                </div>
                <div className="metric danger">
                  <strong>{criticalRequests.length}</strong>
                  <span>Criticas</span>
                </div>
                <div className="metric">
                  <strong>{requests.filter((request) => request.assignedProfessionalId === professionalSession.id).length}</strong>
                  <span>Asignadas a mi</span>
                </div>
              </div>

              <div className="stack" style={{ marginTop: 16 }}>
                {pendingRequests.length === 0 && <div className="empty">No hay solicitudes abiertas por ahora.</div>}
                {pendingRequests.map((request) => (
                  <article className="card request-card" key={request.id}>
                    <div className="card-header">
                      <div>
                        <h4>{request.name}</h4>
                        <p>
                          {request.age ? `${request.age} anos | ` : ""}
                          {request.duration}
                        </p>
                      </div>
                      <span className={`tag ${request.urgency}`}>{urgencyLabel(request.urgency)}</span>
                    </div>

                    <div className="request-detail">
                      <div>
                        <span>Contacto</span>
                        <strong>{contactLabel(request.contactMethod)}</strong>
                        <p>{request.phone || "No compartido"}</p>
                      </div>
                      <div>
                        <span>Profesional solicitado</span>
                        <strong>{supportLabel(request.preferredSupport)}</strong>
                        <p>{request.status}</p>
                      </div>
                    </div>

                    <p className="request-body">{request.symptoms}</p>
                    <div className="meta">
                      {request.safetyRisk && <span className="tag critical">Riesgo inmediato reportado</span>}
                      {request.assignedTo && <span className="tag">Atiende: {request.assignedTo}</span>}
                    </div>
                    <div className="button-row">
                      <button className="btn" onClick={() => acceptRequest(request)}>
                        Atender solicitud
                      </button>
                      {request.phone && (
                        <a
                          className="btn secondary"
                          href={whatsappHref(
                            request.phone,
                            `Hola ${request.name}, soy ${professionalSession.name} de ApoyoApp y vi tu solicitud de apoyo.`
                          )}
                          target="_blank"
                        >
                          Abrir WhatsApp
                        </a>
                      )}
                      <button className="btn secondary" onClick={() => closeRequest(request)}>
                        Cerrar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="panel">
              <h3>Protocolo rapido</h3>
              <div className="stack">
                <div className="alert">
                  Solicitudes criticas o con riesgo deben atenderse con protocolo de emergencia y derivacion inmediata.
                </div>
                <div className="card">
                  <h4>Perfil profesional</h4>
                  <p>{professionalSession.specialty}</p>
                  <div className="meta">
                    {professionalSession.license && <span className="tag">{professionalSession.license}</span>}
                    <span className="tag">{professionalSession.availability}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {activeTab === "groups" && (
          <section className="directory-grid">
            {supportGroups.map((group) => (
              <article className="card" key={group.id}>
                <div className="card-header">
                  <div>
                    <h4>{group.title}</h4>
                    <p>{group.schedule}</p>
                  </div>
                  <span className="tag">{group.format}</span>
                </div>
                <p className="request-body">{group.description}</p>
                <div className="button-row">
                  <button className="btn secondary">Solicitar cupo</button>
                </div>
              </article>
            ))}
          </section>
        )}

        <p className="footer-note">
          MVP orientativo: no emite diagnosticos ni reemplaza atencion medica. La informacion sensible debe protegerse
          con reglas de Firestore, autenticacion y consentimiento informado antes de produccion.
        </p>
      </section>
    </main>
  );
}
