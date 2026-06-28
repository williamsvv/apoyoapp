import { 
  Activity, Users, HeartHandshake, BookOpen, Brain, 
  AlertTriangle, Heart, Sparkles 
} from "lucide-react";
import { NavigationItem } from "./models";

export interface RouteItem extends Omit<NavigationItem, "icon"> {
  path: string;
  icon: NavigationItem["icon"];
}

export const getNavigationItems = (hasActiveGuard: boolean, groupCount: number): RouteItem[] => [
  { 
    id: "guardia", 
    path: "/", 
    label: "Guardias Activas", 
    icon: Activity, 
    description: "Atención inmediata en línea", 
    badge: hasActiveGuard ? "En línea" : null 
  },
  { 
    id: "directorio", 
    path: "/directorio", 
    label: "Directorio de Voluntarios", 
    icon: Users, 
    description: "Buscador de especialistas" 
  },
  { 
    id: "grupos", 
    path: "/grupos", 
    label: "Grupos de Apoyo Mutuo", 
    icon: HeartHandshake, 
    description: "Comunidades guiadas", 
    badge: groupCount > 0 ? `${groupCount}` : null 
  },
  { 
    id: "diagnostico", 
    path: "/diagnostico", 
    label: "Guía de Diagnóstico", 
    icon: BookOpen, 
    description: "Ansiedad, Pánico, Duelo..." 
  },
  { 
    id: "reacciones", 
    path: "/reacciones", 
    label: "Reacciones Post-Sismo", 
    icon: Brain, 
    description: "Guía de adaptación emocional" 
  },
  { 
    id: "alertas", 
    path: "/alertas", 
    label: "Señales de Alerta Crítica", 
    icon: AlertTriangle, 
    description: "Protocolo de acción de emergencia", 
    alert: true 
  },
  { 
    id: "duelo", 
    path: "/duelo", 
    label: "Manifestaciones de Duelo", 
    icon: Heart, 
    description: "Dimensiones del dolor emocional" 
  },
  { 
    id: "habitos", 
    path: "/habitos", 
    label: "Hábitos Saludables", 
    icon: Sparkles, 
    description: "Estabilidad y autocuidado" 
  },
];
