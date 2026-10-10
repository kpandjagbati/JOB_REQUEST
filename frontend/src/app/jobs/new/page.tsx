"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { jobsApi } from "@/lib/api";
import type { JobType } from "@/lib/types";

export default function NewJobPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    type: "FULL_TIME" as JobType,
    salaryMin: "",
    salaryMax: "",
    companyName: "",
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== "RECRUITER")) {
      router.push("/login?redirect=/jobs/new");
    }
  }, [user, loading, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const job = await jobsApi.create({
        title: form.title,
        description: form.description,
        requirements: form.requirements || undefined,
        location: form.location,
        type: form.type,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        companyName: form.companyName,
      });
      router.push(`/jobs/${job.id}`);
    } catch (err: unknown) {
      const text =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Impossible de créer l'offre.";
      setError(Array.isArray(text) ? text[0] : String(text));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="flex justify-center py-24">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold font-display text-primary mb-6">
        Publier une offre
      </h1>

      <form onSubmit={onSubmit} className="card bg-base-100 border border-base-300">
        <div className="card-body gap-4">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Titre du poste *</span>
            </div>
            <input
              required
              className="input input-bordered w-full"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Entreprise *</span>
            </div>
            <input
              required
              className="input input-bordered w-full"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Lieu *</span>
            </div>
            <input
              required
              className="input input-bordered w-full"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Type de contrat *</span>
            </div>
            <select
              className="select select-bordered w-full"
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value as JobType })
              }
            >
              <option value="FULL_TIME">CDI / Temps plein</option>
              <option value="PART_TIME">Temps partiel</option>
              <option value="CONTRACT">CDD / Contrat</option>
              <option value="INTERNSHIP">Stage</option>
              <option value="REMOTE">Télétravail</option>
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Salaire min (€)</span>
              </div>
              <input
                type="number"
                className="input input-bordered w-full"
                value={form.salaryMin}
                onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Salaire max (€)</span>
              </div>
              <input
                type="number"
                className="input input-bordered w-full"
                value={form.salaryMax}
                onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
              />
            </label>
          </div>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Description *</span>
            </div>
            <textarea
              required
              className="textarea textarea-bordered w-full min-h-32"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Profil recherché</span>
            </div>
            <textarea
              className="textarea textarea-bordered w-full min-h-24"
              value={form.requirements}
              onChange={(e) =>
                setForm({ ...form, requirements: e.target.value })
              }
            />
          </label>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <div className="card-actions justify-end">
            <Link href="/dashboard" className="btn btn-ghost">
              Annuler
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <span className="loading loading-spinner" />
              ) : (
                "Publier"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
