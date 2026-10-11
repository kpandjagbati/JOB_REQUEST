"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  UserRound,
} from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, logout, loading } = useAuth();

  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-base-300 px-4 lg:px-8">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <Menu className="h-5 w-5" />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/jobs">
                <BriefcaseBusiness className="h-4 w-4" />
                Offres
              </Link>
            </li>
            {user?.role === "RECRUITER" && (
              <li>
                <Link href="/jobs/new">
                  <PlusCircle className="h-4 w-4" />
                  Publier une offre
                </Link>
              </li>
            )}
            {user && (
              <li>
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  Tableau de bord
                </Link>
              </li>
            )}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl font-bold text-primary gap-2">
          <BriefcaseBusiness className="h-5 w-5" />
          JobQuest
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li>
            <Link href="/jobs" className="gap-2">
              <BriefcaseBusiness className="h-4 w-4" />
              Offres d&apos;emploi
            </Link>
          </li>
          {user?.role === "RECRUITER" && (
            <li>
              <Link href="/jobs/new" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Publier
              </Link>
            </li>
          )}
          {user && (
            <li>
              <Link href="/dashboard" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {loading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <UserAvatar
                firstName={user.firstName}
                lastName={user.lastName}
                size="sm"
              />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-56 p-2 shadow"
            >
              <li className="menu-title">
                <span>
                  {user.firstName} {user.lastName}
                </span>
              </li>
              <li>
                <span className="badge badge-ghost badge-sm mx-2">
                  {user.role === "RECRUITER" ? "Recruteur" : "Candidat"}
                </span>
              </li>
              <li>
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  Mon espace
                </Link>
              </li>
              <li>
                <Link href="/profile">
                  <UserRound className="h-4 w-4" />
                  Profil
                </Link>
              </li>
              <li>
                <button type="button" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost btn-sm">
              Connexion
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm">
              Inscription
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
