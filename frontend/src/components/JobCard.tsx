import Link from "next/link";
import { ArrowRight, Building2, MapPin, Wallet } from "lucide-react";
import { formatSalary, JOB_TYPE_LABELS } from "@/lib/api";
import type { Job } from "@/lib/types";

export function JobCard({ job }: { job: Job }) {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
      <div className="card-body gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="card-title text-lg">
              <Link href={`/jobs/${job.id}`} className="hover:text-primary">
                {job.title}
              </Link>
            </h2>
            <p className="text-sm opacity-70 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              <span className="inline-flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {job.company?.name ?? "Entreprise"}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </span>
            </p>
          </div>
          <div className="badge badge-secondary badge-outline">
            {JOB_TYPE_LABELS[job.type] ?? job.type}
          </div>
        </div>

        <p className="text-sm line-clamp-2 opacity-80">{job.description}</p>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="badge badge-ghost gap-1">
            <Wallet className="h-3 w-3" />
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
          {job.status === "CLOSED" && (
            <span className="badge badge-error">Fermée</span>
          )}
        </div>

        <div className="card-actions justify-end">
          <Link href={`/jobs/${job.id}`} className="btn btn-primary btn-sm gap-1">
            Voir l&apos;offre
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
