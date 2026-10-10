import axios from "axios";
import Cookies from "js-cookie";
import type {
  Application,
  AuthResponse,
  Company,
  Job,
  PaginatedJobs,
  User,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "CANDIDATE" | "RECRUITER";
  }) => api.post<AuthResponse>("/auth/register", data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", data).then((r) => r.data),

  me: () => api.get<User>("/auth/me").then((r) => r.data),
};

export const jobsApi = {
  list: (params?: Record<string, string | number | undefined>) =>
    api.get<PaginatedJobs>("/jobs", { params }).then((r) => r.data),

  get: (id: string) => api.get<Job>(`/jobs/${id}`).then((r) => r.data),

  create: (data: Partial<Job> & { companyName?: string }) =>
    api.post<Job>("/jobs", data).then((r) => r.data),

  update: (id: string, data: Partial<Job>) =>
    api.patch<Job>(`/jobs/${id}`, data).then((r) => r.data),

  remove: (id: string) => api.delete(`/jobs/${id}`),

  mine: () => api.get<Job[]>("/jobs/mine").then((r) => r.data),
};

export const applicationsApi = {
  apply: (jobId: string, coverLetter?: string) =>
    api
      .post<Application>("/applications", { jobId, coverLetter })
      .then((r) => r.data),

  mine: () => api.get<Application[]>("/applications/mine").then((r) => r.data),

  forJob: (jobId: string) =>
    api.get<Application[]>(`/applications/job/${jobId}`).then((r) => r.data),

  updateStatus: (id: string, status: string) =>
    api
      .patch<Application>(`/applications/${id}/status`, { status })
      .then((r) => r.data),
};

export const companiesApi = {
  get: (id: string) => api.get<Company>(`/companies/${id}`).then((r) => r.data),
  mine: () => api.get<Company[]>("/companies/mine").then((r) => r.data),
};

export const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "CDI / Temps plein",
  PART_TIME: "Temps partiel",
  CONTRACT: "CDD / Contrat",
  INTERNSHIP: "Stage",
  REMOTE: "Télétravail",
};

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  REVIEWING: "En cours",
  ACCEPTED: "Acceptée",
  REJECTED: "Refusée",
  OPEN: "Ouverte",
  CLOSED: "Fermée",
};

export function formatSalary(min?: number | null, max?: number | null) {
  if (!min && !max) return "Salaire non précisé";
  const fmt = (n: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(n);
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `À partir de ${fmt(min)}`;
  return `Jusqu'à ${fmt(max!)}`;
}
