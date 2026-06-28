export type UrgencyLevel = "low" | "medium" | "high" | "critical";

export type HelpRequest = {
  id: string;
  name: string;
  age?: string;
  contactMethod: "whatsapp" | "phone" | "in_app";
  phone?: string;
  symptoms: string;
  duration: string;
  urgency: UrgencyLevel;
  safetyRisk: boolean;
  preferredSupport: "psychologist" | "psychiatrist" | "either";
  status: "pending" | "accepted" | "closed";
  assignedTo?: string;
  assignedProfessionalId?: string;
  createdAt?: unknown;
};

export type Professional = {
  id: string;
  name: string;
  email?: string;
  role: "Psicologo" | "Psiquiatra";
  specialty: string;
  license?: string;
  availability: "En guardia" | "Disponible hoy" | "No disponible";
  whatsapp?: string;
};

export type SupportGroup = {
  id: string;
  title: string;
  schedule: string;
  format: string;
  description: string;
};
