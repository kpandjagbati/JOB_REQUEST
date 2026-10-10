"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JobCard } from "@/components/JobCard";
import { jobsApi } from "@/lib/api";
import type { Job } from "@/lib/types";

function JobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [location, setLocation] = useState(searchParams.get("location") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const page = Number(searchParams.get("page") ?? "1");

  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
    setLocation(searchParams.get("location") ?? "");
    setType(searchParams.get("type") ?? "");
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await jobsApi.list({
          q: searchParams.get("q") || undefined,
          location: searchParams.get("location") || undefined,
          type: searchParams.get("type") || undefined,
          page,
          limit: 9,
        });
        if (!cancelled) {
          setJobs(res.data);
          setTotal(res.total);
        }
      } catch {
        if (!cancelled) setError("Impossible de charger les offres.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [searchParams, page]);

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (location.trim()) params.set("location", location.trim());
    if (type) params.set("type", type);
    params.set("page", "1");
    router.push(`/jobs?${params.toString()}`);
  }

  const totalPages = Math.max(1, Math.ceil(total / 9));

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-primary">
          Offres d&apos;emploi
        </h1>
        <p className="opacity-70 mt-1">{total} offre(s) trouvée(s)</p>
      </div>

      <form
        onSubmit={applyFilters}
        className="bg-base-100 border border-base-300 rounded-box p-4 mb-8 grid md:grid-cols-4 gap-3"
      >
        <input
          className="input input-bordered w-full"
          placeholder="Mot-clé"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <input
          className="input input-bordered w-full"
          placeholder="Lieu"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select
          className="select select-bordered w-full"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Tous les types</option>
          <option value="FULL_TIME">CDI / Temps plein</option>
          <option value="PART_TIME">Temps partiel</option>
          <option value="CONTRACT">CDD / Contrat</option>
          <option value="INTERNSHIP">Stage</option>
          <option value="REMOTE">Télétravail</option>
        </select>
        <button type="submit" className="btn btn-primary">
          Filtrer
        </button>
      </form>

      {loading && (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="alert">
          <span>Aucune offre ne correspond à votre recherche.</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="join mt-10 flex justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", String(p));
            return (
              <button
                key={p}
                type="button"
                className={`join-item btn ${p === page ? "btn-active" : ""}`}
                onClick={() => router.push(`/jobs?${params.toString()}`)}
              >
                {p}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      }
    >
      <JobsContent />
    </Suspense>
  );
}
