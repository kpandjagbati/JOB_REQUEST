"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
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

  const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();
  const roleLabel = user.role === "RECRUITER" ? "Recruteur" : "Candidat";
  const memberSince = new Date(user.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-[70vh] bg-base-200/60">
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-10">
        <div className="mb-6">
          <p className="text-sm opacity-60 mb-1">Espace personnel</p>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-primary">
            Mon profil
          </h1>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-box overflow-hidden shadow-sm">
          <div className="bg-primary/10 px-6 py-8 md:px-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="avatar">
                <div className="w-28 h-28 rounded-full bg-primary text-primary-content ring ring-primary ring-offset-base-100 ring-offset-2 flex items-center justify-center">
                  <span className="text-4xl font-bold font-display leading-none">
                    {initials}
                  </span>
                </div>
              </div>

              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl md:text-3xl font-semibold font-display">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="opacity-70 mt-1 inline-flex items-center gap-2 justify-center md:justify-start">
                  <Mail className="h-4 w-4 shrink-0" />
                  {user.email}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="badge badge-primary gap-1">
                    {user.role === "RECRUITER" ? (
                      <BriefcaseBusiness className="h-3.5 w-3.5" />
                    ) : (
                      <UserRound className="h-3.5 w-3.5" />
                    )}
                    {roleLabel}
                  </span>
                  <span className="badge badge-ghost gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Membre depuis {memberSince}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Informations</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 rounded-box bg-base-200/70 px-4 py-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-60">
                      Email
                    </p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-box bg-base-200/70 px-4 py-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-60">
                      Téléphone
                    </p>
                    <p className="font-medium">
                      {user.phone || "Non renseigné"}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-box bg-base-200/70 px-4 py-3">
                  <UserRound className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-60">
                      Bio
                    </p>
                    <p className="font-medium whitespace-pre-wrap">
                      {user.bio || "Aucune bio pour le moment."}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="stats stats-vertical sm:stats-horizontal shadow w-full bg-base-200">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <UserRound className="h-8 w-8" />
                </div>
                <div className="stat-title">Rôle</div>
                <div className="stat-value text-xl">{roleLabel}</div>
              </div>
              <div className="stat">
                <div className="stat-figure text-primary">
                  <CalendarDays className="h-8 w-8" />
                </div>
                <div className="stat-title">Inscription</div>
                <div className="stat-value text-xl">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-end pt-2">
              <Link href="/dashboard" className="btn btn-primary gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Tableau de bord
              </Link>
              <button
                type="button"
                className="btn btn-outline btn-error gap-2"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
