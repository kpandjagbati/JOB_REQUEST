"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { applicationsApi, jobsApi, STATUS_LABELS } from "@/lib/api";
import type { Application, ApplicationStatus, Job } from "@/lib/types";

export default function ManageJobPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "RECRUITER")) {
      router.push("/login?redirect=/dashboard");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [jobData, apps] = await Promise.all([
          jobsApi.get(id),
          applicationsApi.forJob(id),
        ]);
        if (!cancelled) {
          setJob(jobData);
          setApplications(apps);
        }
      } catch {
        if (!cancelled) setError("Impossible de charger les candidatures.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [user, id]);

  async function updateStatus(appId: string, status: ApplicationStatus) {
    try {
      const updated = await applicationsApi.updateStatus(appId, status);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? updated : a)),
      );
    } catch {
      setError("Mise à jour du statut impossible.");
    }
  }

  async function toggleStatus() {
    if (!job) return;
    try {
      const updated = await jobsApi.update(job.id, {
        status: job.status === "OPEN" ? "CLOSED" : "OPEN",
      });
      setJob(updated);
    } catch {
      setError("Impossible de modifier le statut de l'offre.");
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-24">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10">
      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li>{job?.title ?? "Offre"}</li>
        </ul>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {job && (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display text-primary">
              {job.title}
            </h1>
            <p className="opacity-70">
              {applications.length} candidature(s)
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/jobs/${job.id}`} className="btn btn-ghost btn-sm">
              Voir l&apos;offre
            </Link>
            <button
              type="button"
              className={`btn btn-sm ${job.status === "OPEN" ? "btn-error" : "btn-success"}`}
              onClick={() => void toggleStatus()}
            >
              {job.status === "OPEN" ? "Fermer l'offre" : "Rouvrir l'offre"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="alert">
            <span>Aucune candidature pour le moment.</span>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className="card bg-base-100 border border-base-300"
            >
              <div className="card-body gap-3">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">
                      {app.user?.firstName} {app.user?.lastName}
                    </h3>
                    <p className="text-sm opacity-70">{app.user?.email}</p>
                    <p className="text-xs opacity-50 mt-1">
                      Postulé le{" "}
                      {new Date(app.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span className="badge badge-outline">
                    {STATUS_LABELS[app.status]}
                  </span>
                </div>
                {app.coverLetter && (
                  <p className="text-sm bg-base-200 rounded-box p-3 whitespace-pre-wrap">
                    {app.coverLetter}
                  </p>
                )}
                <div className="card-actions justify-end">
                  <div className="join">
                    {(
                      [
                        "PENDING",
                        "REVIEWING",
                        "ACCEPTED",
                        "REJECTED",
                      ] as ApplicationStatus[]
                    ).map((status) => (
                      <button
                        key={status}
                        type="button"
                        className={`join-item btn btn-xs ${app.status === status ? "btn-active" : ""}`}
                        onClick={() => void updateStatus(app.id, status)}
                      >
                        {STATUS_LABELS[status]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
