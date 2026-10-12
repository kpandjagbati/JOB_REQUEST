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
import { Illustration } from "@/components/Illustration";

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
      <section className="hero min-h-[75vh] bg-base-200">
        <div className="hero-content max-w-6xl w-full flex-col lg:flex-row gap-10 py-14 px-4">
          <div className="text-center lg:text-left flex-1">
            <p className="badge badge-primary badge-outline mb-4">JobQuest</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-primary">
              Trouvez votre prochaine aventure pro
            </h1>
            <p className="py-4 text-lg opacity-80 max-w-xl mx-auto lg:mx-0">
              Des milliers d&apos;offres pour candidats ambitieux et recruteurs
              exigeants. Recherchez, postulez, recrutez.
            </p>

            <form
              onSubmit={onSearch}
              className="w-full max-w-xl bg-base-100 shadow-lg rounded-box p-4 flex flex-col sm:flex-row gap-3 mx-auto lg:mx-0"
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

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-5">
              <Link href="/jobs" className="btn btn-outline gap-2">
                <BriefcaseBusiness className="h-4 w-4" />
                Voir toutes les offres
              </Link>
              <Link href="/register" className="btn btn-secondary">
                Créer un compte
              </Link>
            </div>
          </div>

          <div className="flex-1 max-w-md lg:max-w-lg w-full">
            <Illustration
              name="job-hunt"
              alt="Illustration Undraw — recherche d'emploi"
              priority
            />
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
              image: "job-offers" as const,
            },
            {
              title: "Candidature simple",
              desc: "Postulez en un clic et suivez le statut de vos candidatures.",
              Icon: ClipboardList,
              image: "interview" as const,
            },
            {
              title: "Espace recruteur",
              desc: "Publiez vos offres et gérez les candidatures depuis un dashboard clair.",
              Icon: Building2,
              image: "hiring" as const,
            },
          ].map(({ title, desc, Icon, image }) => (
            <div key={title} className="card bg-base-100 border border-base-300">
              <figure className="px-6 pt-6">
                <Illustration name={image} alt={title} className="max-h-40 object-contain" />
              </figure>
              <div className="card-body items-center text-center pt-2">
                <div className="bg-primary/10 text-primary rounded-full p-2">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="card-title justify-center text-lg">{title}</h3>
                <p className="opacity-80 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-base-200 py-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 max-w-sm">
            <Illustration
              name="career-development"
              alt="Illustration Undraw — évolution de carrière"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold font-display text-primary mb-3">
              Boostez votre carrière
            </h2>
            <p className="opacity-80 mb-6">
              Créez votre compte en quelques secondes et accédez aux offres qui
              correspondent à votre profil.
            </p>
            <Link href="/register" className="btn btn-primary">
              Commencer maintenant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
