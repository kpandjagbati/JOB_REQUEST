"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  MapPin,
  Search,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <div>
      <section className="hero min-h-[70vh] bg-base-200">
        <div className="hero-content text-center max-w-3xl flex-col gap-8 py-16">
          <div>
            <p className="badge badge-primary badge-outline mb-4">JobQuest</p>
            <h1 className="text-4xl md:text-6xl font-bold font-display text-primary">
              Trouvez votre prochaine aventure pro
            </h1>
            <p className="py-4 text-lg opacity-80 max-w-xl mx-auto">
              Des milliers d&apos;offres pour candidats ambitieux et recruteurs
              exigeants. Recherchez, postulez, recrutez.
            </p>
          </div>

          <form
            onSubmit={onSearch}
            className="w-full max-w-2xl bg-base-100 shadow-lg rounded-box p-4 flex flex-col md:flex-row gap-3"
          >
            <label className="input input-bordered flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 opacity-70 shrink-0" />
              <input
                type="text"
                className="grow"
                placeholder="Métier, mot-clé..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </label>
            <label className="input input-bordered flex items-center gap-2 flex-1">
              <MapPin className="h-4 w-4 opacity-70 shrink-0" />
              <input
                type="text"
                className="grow"
                placeholder="Ville, remote..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </label>
            <button type="submit" className="btn btn-primary">
              Rechercher
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/jobs" className="btn btn-outline gap-2">
              <BriefcaseBusiness className="h-4 w-4" />
              Voir toutes les offres
            </Link>
            <Link href="/register" className="btn btn-secondary">
              Créer un compte
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 lg:px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 font-display">
          Pourquoi JobQuest ?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Recherche fine",
              desc: "Filtrez par type de contrat, lieu et salaire pour trouver l'offre idéale.",
              Icon: Search,
            },
            {
              title: "Candidature simple",
              desc: "Postulez en un clic et suivez le statut de vos candidatures.",
              Icon: ClipboardList,
            },
            {
              title: "Espace recruteur",
              desc: "Publiez vos offres et gérez les candidatures depuis un dashboard clair.",
              Icon: Building2,
            },
          ].map(({ title, desc, Icon }) => (
            <div key={title} className="card bg-base-100 border border-base-300">
              <div className="card-body items-center text-center">
                <div className="bg-primary/10 text-primary rounded-full p-4 mb-1">
                  <Icon className="h-8 w-8" strokeWidth={1.75} />
                </div>
                <h3 className="card-title justify-center">{title}</h3>
                <p className="opacity-80">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
