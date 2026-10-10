"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { applicationsApi, formatSalary, JOB_TYPE_LABELS, jobsApi } from "@/lib/api";
import type { Job } from "@/lib/types";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await jobsApi.get(id);
        if (!cancelled) setJob(data);
      } catch {
        if (!cancelled) setJob(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function onApply(e: FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push(`/login?redirect=/jobs/${id}`);
      return;
    }
    setApplying(true);
    setMessage(null);
    try {
      await applicationsApi.apply(id, coverLetter || undefined);
      setMessage({ type: "success", text: "Candidature envoyée avec succès !" });
      setCoverLetter("");
    } catch (err: unknown) {
      const text =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Échec de la candidature.";
      setMessage({ type: "error", text: Array.isArray(text) ? text[0] : text });
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="alert alert-warning">
          <span>Offre introuvable.</span>
        </div>
        <Link href="/jobs" className="btn btn-link mt-4">
          Retour aux offres
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10">
      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li>
            <Link href="/">Accueil</Link>
          </li>
          <li>
            <Link href="/jobs">Offres</Link>
          </li>
          <li>{job.title}</li>
        </ul>
      </div>

      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold font-display text-primary">
                {job.title}
              </h1>
              <p className="opacity-70 mt-1">
                {job.company?.name} · {job.location}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-secondary">
                {JOB_TYPE_LABELS[job.type] ?? job.type}
              </span>
              <span className="badge badge-outline">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </span>
            </div>
          </div>

          <div className="divider" />

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="whitespace-pre-wrap opacity-90">{job.description}</p>
          </div>

          {job.requirements && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Profil recherché</h2>
              <p className="whitespace-pre-wrap opacity-90">{job.requirements}</p>
            </div>
          )}

          {job.company && (
            <div className="alert bg-base-200">
              <div>
                <h3 className="font-bold">{job.company.name}</h3>
                <p className="text-sm opacity-80">
                  {job.company.description || "Entreprise partenaire JobQuest"}
                </p>
                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="link link-primary text-sm"
                  >
                    Site web
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {job.status === "OPEN" && user?.role !== "RECRUITER" && (
        <div className="card bg-base-100 border border-base-300 shadow-sm mt-6">
          <div className="card-body">
            <h2 className="card-title">Postuler</h2>
            {!user && (
              <p className="text-sm opacity-70">
                <Link href={`/login?redirect=/jobs/${id}`} className="link link-primary">
                  Connectez-vous
                </Link>{" "}
                pour envoyer votre candidature.
              </p>
            )}
            <form onSubmit={onApply} className="space-y-3">
              <textarea
                className="textarea textarea-bordered w-full min-h-32"
                placeholder="Lettre de motivation (optionnelle)"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
              {message && (
                <div
                  className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}
                >
                  <span>{message.text}</span>
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={applying}
              >
                {applying ? (
                  <span className="loading loading-spinner" />
                ) : (
                  "Envoyer ma candidature"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
