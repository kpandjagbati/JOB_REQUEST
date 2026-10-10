export type Role = "CANDIDATE" | "RECRUITER" | "ADMIN";

export type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "REMOTE";

export type JobStatus = "OPEN" | "CLOSED";

export type ApplicationStatus =
  | "PENDING"
  | "REVIEWING"
  | "ACCEPTED"
  | "REJECTED";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  phone?: string | null;
  bio?: string | null;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string | null;
  website?: string | null;
  location?: string | null;
  logo?: string | null;
  ownerId: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string | null;
  location: string;
  type: JobType;
  status: JobStatus;
  salaryMin?: number | null;
  salaryMax?: number | null;
  companyId: string;
  authorId: string;
  createdAt: string;
  company?: Company;
  _count?: { applications: number };
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  coverLetter?: string | null;
  status: ApplicationStatus;
  createdAt: string;
  job?: Job;
  user?: User;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface PaginatedJobs {
  data: Job[];
  total: number;
  page: number;
  limit: number;
}
