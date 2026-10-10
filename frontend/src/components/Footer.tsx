import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";

export function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content p-10 mt-auto">
      <aside>
        <span className="text-2xl font-bold text-primary inline-flex items-center gap-2">
          <BriefcaseBusiness className="h-6 w-6" />
          JobQuest
        </span>
        <p className="opacity-80 max-w-xs">
          Trouvez le poste de vos rêves ou recrutez les meilleurs talents.
        </p>
      </aside>
      <nav>
        <h6 className="footer-title">Explorer</h6>
        <Link href="/jobs" className="link link-hover">
          Offres d&apos;emploi
        </Link>
        <Link href="/register" className="link link-hover">
          Créer un compte
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">Espace</h6>
        <Link href="/login" className="link link-hover">
          Connexion
        </Link>
        <Link href="/dashboard" className="link link-hover">
          Tableau de bord
        </Link>
      </nav>
    </footer>
  );
}
