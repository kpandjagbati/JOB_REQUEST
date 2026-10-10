"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  applicationsApi,
  JOB_TYPE_LABELS,
  jobsApi,
  STATUS_LABELS,
} from "@/lib/api";
import type { Application, Job } from "@/lib/types";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login?redirect=/dashboard");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        if (user!.role === "RECRUITER") {
          const data = await jobsApi.mine();
          if (!cancelled) setJobs(data);
        } else {
          const data = await applicationsApi.mine();
          if (!cancelled) setApplications(data);
        }
      } catch {
        if (!cancelled) setError("Impossible de charger le tableau de bord.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="flex justify-center py-24">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-primary">
            Bonjour, {user.firstName}
          </h1>
          <p className="opacity-70">
            {user.role === "RECRUITER"
              ? "Gérez vos offres publiées"
              : "Suivez vos candidatures"}
          </p>
        </div>
        {user.role === "RECRUITER" && (
          <Link href="/jobs/new" className="btn btn-primary">
            Nouvelle offre
          </Link>
        )}
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      )}

      {!loading && user.role === "RECRUITER" && (
        <div className="overflow-x-auto bg-base-100 border border-base-300 rounded-box">
          <table className="table">
            <thead>
              <tr>
                <th>Poste</th>
                <th>Type</th>
                <th>Lieu</th>
                <th>Statut</th>
                <th>Candidatures</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center opacity-70 py-10">
                    Aucune offre publiée.{" "}
                    <Link href="/jobs/new" className="link link-primary">
                      Créer la première
                    </Link>
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover">
                    <td className="font-medium">{job.title}</td>
                    <td>
                      <span className="badge badge-ghost badge-sm">
                        {JOB_TYPE_LABELS[job.type]}
                      </span>
                    </td>
                    <td>{job.location}</td>
                    <td>
                      <span
                        className={`badge badge-sm ${job.status === "OPEN" ? "badge-success" : "badge-error"}`}
                      >
                        {STATUS_LABELS[job.status]}
                      </span>
                    </td>
                    <td>{job._count?.applications ?? 0}</td>
                    <td>
                      <Link
                        href={`/dashboard/jobs/${job.id}`}
                        className="btn btn-ghost btn-xs"
                      >
                        Gérer
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && user.role !== "RECRUITER" && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="alert">
              <span>
                Vous n&apos;avez pas encore postulé.{" "}
                <Link href="/jobs" className="link link-primary">
                  Explorer les offres
                </Link>
              </span>
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="card bg-base-100 border border-base-300"
              >
                <div className="card-body flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {app.job?.title ?? "Offre"}
                    </h3>
                    <p className="text-sm opacity-70">
                      {app.job?.company?.name} ·{" "}
                      {new Date(app.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`badge ${
                        app.status === "ACCEPTED"
                          ? "badge-success"
                          : app.status === "REJECTED"
                            ? "badge-error"
                            : "badge-warning"
                      }`}
                    >
                      {STATUS_LABELS[app.status]}
                    </span>
                    {app.jobId && (
                      <Link
                        href={`/jobs/${app.jobId}`}
                        className="btn btn-ghost btn-sm"
                      >
                        Voir
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
