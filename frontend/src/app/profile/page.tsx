"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login?redirect=/profile");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex justify-center py-24">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold font-display text-primary mb-6">
        Mon profil
      </h1>

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body items-center text-center gap-4">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content w-24 rounded-full">
              <span className="text-3xl">
                {user.firstName[0]}
                {user.lastName[0]}
              </span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="opacity-70">{user.email}</p>
            <div className="badge badge-secondary mt-2">
              {user.role === "RECRUITER" ? "Recruteur" : "Candidat"}
            </div>
          </div>

          {user.bio && <p className="opacity-80">{user.bio}</p>}
          {user.phone && (
            <p className="text-sm">
              Téléphone : <span className="font-medium">{user.phone}</span>
            </p>
          )}

          <div className="stats shadow bg-base-200 w-full">
            <div className="stat place-items-center">
              <div className="stat-title">Membre depuis</div>
              <div className="stat-value text-lg">
                {new Date(user.createdAt).toLocaleDateString("fr-FR")}
              </div>
            </div>
          </div>

          <div className="card-actions">
            <Link href="/dashboard" className="btn btn-primary">
              Tableau de bord
            </Link>
            <button type="button" className="btn btn-ghost" onClick={logout}>
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
