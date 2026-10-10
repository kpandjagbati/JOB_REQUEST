"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "CANDIDATE" as "CANDIDATE" | "RECRUITER",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form);
      router.push("/dashboard");
    } catch (err: unknown) {
      const text =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Inscription impossible.";
      setError(Array.isArray(text) ? text[0] : String(text));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-lg bg-base-100 border border-base-300 shadow-lg">
        <form onSubmit={onSubmit} className="card-body gap-4">
          <h1 className="card-title text-2xl font-display text-primary justify-center">
            Créer un compte
          </h1>

          <div className="grid grid-cols-2 gap-3">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Prénom</span>
              </div>
              <input
                required
                className="input input-bordered w-full"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Nom</span>
              </div>
              <input
                required
                className="input input-bordered w-full"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </label>
          </div>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <input
              type="email"
              required
              className="input input-bordered w-full"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Mot de passe</span>
            </div>
            <input
              type="password"
              required
              minLength={6}
              className="input input-bordered w-full"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>

          <div className="form-control">
            <div className="label">
              <span className="label-text">Je suis</span>
            </div>
            <div className="flex gap-4">
              <label className="label cursor-pointer gap-2">
                <input
                  type="radio"
                  name="role"
                  className="radio radio-primary"
                  checked={form.role === "CANDIDATE"}
                  onChange={() => setForm({ ...form, role: "CANDIDATE" })}
                />
                <span className="label-text">Candidat</span>
              </label>
              <label className="label cursor-pointer gap-2">
                <input
                  type="radio"
                  name="role"
                  className="radio radio-primary"
                  checked={form.role === "RECRUITER"}
                  onChange={() => setForm({ ...form, role: "RECRUITER" })}
                />
                <span className="label-text">Recruteur</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="alert alert-error text-sm">
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="loading loading-spinner" /> : "S'inscrire"}
          </button>

          <p className="text-center text-sm">
            Déjà un compte ?{" "}
            <Link href="/login" className="link link-primary">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
