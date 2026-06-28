"use client";

import React, { useState, useEffect } from "react";
import { 
  X, Mail, Lock, User, Phone, Shield, 
  HeartHandshake, Edit2, LogOut, Check, Activity 
} from "lucide-react";
import { 
  loginVoluntario, 
  registerVoluntario, 
  logoutVoluntario, 
  subscribeToAuth
} from "../lib/auth";
import { updateVoluntarioData } from "../lib/voluntarios";
import { Voluntario } from "../models";

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function VolunteerModal({ isOpen, onClose }: VolunteerModalProps) {
  const [currentUser, setCurrentUser] = useState<Voluntario | null>(null);
  const [isRegister, setIsRegister] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  
  // Dashboard fields
  const [editEspecialidad, setEditEspecialidad] = useState("");
  const [editTelefono, setEditTelefono] = useState("");
  const [editWhatsapp, setEditWhatsapp] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Subscribe to Auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user);
      if (user) {
        setEditEspecialidad(user.especialidad);
        setEditTelefono(user.telefono);
        setEditWhatsapp(user.whatsapp);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginVoluntario(email, password);
      setSuccess("¡Sesión iniciada con éxito!");
      setTimeout(() => {
        setSuccess(null);
      }, 2000);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Credenciales incorrectas. Inténtalo de nuevo."));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !email || !password || !especialidad || !telefono || !whatsapp) {
      setError("Por favor, rellene todos los campos obligatorios.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await registerVoluntario(
        nombre,
        email,
        password,
        especialidad,
        telefono,
        whatsapp
      );
      setSuccess("¡Registro exitoso! Ya eres parte de los voluntarios.");
      setTimeout(() => {
        setSuccess(null);
      }, 2000);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Error al registrar el voluntario."));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutVoluntario();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGuard = async () => {
    if (!currentUser) return;
    try {
      const newStatus = !currentUser.guardiaActiva;
      await updateVoluntarioData(currentUser.id, { guardiaActiva: newStatus });
      setSuccess(`Estado actualizado a: ${newStatus ? 'En Guardia' : 'Fuera de Guardia'}`);
      setTimeout(() => setSuccess(null), 1500);
    } catch {
      setError("Error al cambiar el estado de guardia.");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      await updateVoluntarioData(currentUser.id, {
        especialidad: editEspecialidad,
        telefono: editTelefono,
        whatsapp: editWhatsapp,
      });
      setIsEditing(false);
      setSuccess("¡Perfil actualizado correctamente!");
      setTimeout(() => setSuccess(null), 2000);
    } catch {
      setError("Error al actualizar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-8 text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/10 p-2">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              {currentUser ? "Panel del Voluntario" : isRegister ? "Registro de Voluntario" : "Acceso Voluntarios"}
            </h2>
          </div>
          <p className="mt-2 text-emerald-50/90 text-sm">
            {currentUser 
              ? "Gestiona tu estado de guardia y mantén tus datos actualizados."
              : "Forma parte del equipo de apoyo gratuito para los venezolanos."}
          </p>
        </div>

        {/* Modal Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400 flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0" />
              {success}
            </div>
          )}

          {currentUser ? (
            /* ==========================================
               DASHBOARD DEL VOLUNTARIO INICIADO
               ========================================== */
            <div className="space-y-6">
              {/* Guardia Toggle Container */}
              <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className={`relative flex h-3.5 w-3.5 ${currentUser.guardiaActiva ? "block" : "hidden"}`}>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                    </span>
                    Guardia Activa (En Línea)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {currentUser.guardiaActiva 
                      ? "Estás apareciendo en la sección 'Guardias Activas' y los usuarios pueden llamarte."
                      : "Tu estado está fuera de línea. No aparecerás en atención inmediata."}
                  </p>
                </div>
                
                {/* Switch button */}
                <button
                  onClick={handleToggleGuard}
                  className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    currentUser.guardiaActiva ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      currentUser.guardiaActiva ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Volunteer Info Display & Edit */}
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-base">Mis Datos Profesionales</h4>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Editar Datos
                    </button>
                  )}
                </div>

                {isEditing ? (
                  /* Profile Edit Form */
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Especialidad / Enfoque
                      </label>
                      <input
                        type="text"
                        value={editEspecialidad}
                        onChange={(e) => setEditEspecialidad(e.target.value)}
                        placeholder="Ej. Terapeuta Familiar, Manejo de Estrés"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Teléfono de Llamada
                        </label>
                        <input
                          type="text"
                          value={editTelefono}
                          onChange={(e) => setEditTelefono(e.target.value)}
                          placeholder="Ej. +584121112233"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          WhatsApp (Código País 58)
                        </label>
                        <input
                          type="text"
                          value={editWhatsapp}
                          onChange={(e) => setEditWhatsapp(e.target.value)}
                          placeholder="Ej. 584121112233"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                          required
                        />
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Sin símbolos (+), ej. 584141234567</p>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditEspecialidad(currentUser.especialidad);
                          setEditTelefono(currentUser.telefono);
                          setEditWhatsapp(currentUser.whatsapp);
                        }}
                        className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                      >
                        {loading ? "Guardando..." : "Guardar Cambios"}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Profile Details Static View */
                  <div className="space-y-3.5 bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 text-sm">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-400 dark:text-slate-500 font-medium">Nombre:</span>
                      <span className="col-span-2 font-semibold text-slate-800 dark:text-slate-200">{currentUser.nombre}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-400 dark:text-slate-500 font-medium">Correo:</span>
                      <span className="col-span-2 text-slate-800 dark:text-slate-300">{currentUser.email}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-400 dark:text-slate-500 font-medium">Especialidad:</span>
                      <span className="col-span-2 text-slate-800 dark:text-slate-300">{currentUser.especialidad}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-400 dark:text-slate-500 font-medium">Teléfono:</span>
                      <span className="col-span-2 text-slate-800 dark:text-slate-300">{currentUser.telefono || "No especificado"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-400 dark:text-slate-500 font-medium">WhatsApp:</span>
                      <span className="col-span-2 text-slate-800 dark:text-slate-300">+{currentUser.whatsapp || "No especificado"}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 font-semibold text-sm transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          ) : isRegister ? (
            /* ==========================================
               REGISTRO DE VOLUNTARIO
               ========================================== */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nombre y Apellido
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Lic. Valeria Díaz"
                    className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Correo Electrónico Profesional
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="valeria.diaz@ejemplo.com"
                    className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Contraseña de Acceso
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Especialidad Principal / Enfoque Clínico
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={especialidad}
                    onChange={(e) => setEspecialidad(e.target.value)}
                    placeholder="Ej. Especialista en Duelo y Pérdidas"
                    className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Teléfono Celular
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="text"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="Ej. +584241234567"
                      className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    WhatsApp (Ej: 584241234567)
                  </label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="Ej. 584241234567"
                      className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 py-3 font-semibold text-white hover:from-emerald-700 hover:to-teal-800 focus:outline-none disabled:opacity-50 transition-all shadow-md shadow-emerald-500/10"
              >
                {loading ? "Procesando Registro..." : "Completar Registro"}
              </button>

              <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
                ¿Ya estás registrado?{" "}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  Inicia Sesión aquí
                </button>
              </p>
            </form>
          ) : (
            /* ==========================================
               INICIO DE SESIÓN
               ========================================== */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="valeria.diaz@ejemplo.com"
                    className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 py-3 font-semibold text-white hover:from-emerald-700 hover:to-teal-800 focus:outline-none disabled:opacity-50 transition-all shadow-md shadow-emerald-500/10"
              >
                {loading ? "Iniciando Sesión..." : "Iniciar Sesión"}
              </button>

              <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
                ¿Aún no formas parte del equipo?{" "}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  Regístrate como voluntario
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
