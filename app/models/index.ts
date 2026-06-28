import { ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps } from "lucide-react";

export interface Voluntario {
  id: string;
  nombre: string;
  email: string;
  especialidad: string;
  telefono: string;
  whatsapp: string;
  guardiaActiva: boolean;
  autorizado: boolean;
}

export interface GrupoApoyo {
  id: string;
  nombre: string;
  descripcion: string;
  modalidad: "online" | "presencial";
  lugarOrEnlace: string;
  horario: string;
  facilitador: string;
}

export type SectionType = 
  | "guardia" 
  | "directorio" 
  | "grupos" 
  | "diagnostico" 
  | "reacciones" 
  | "alertas" 
  | "duelo" 
  | "habitos";

export interface NavigationItem {
  id: SectionType;
  label: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  description: string;
  badge?: string | null;
  alert?: boolean;
}
