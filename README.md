# JobQuest — Plateforme de recherche d'emploi

Full stack : **Next.js + Tailwind + DaisyUI (fantasy)** / **NestJS + Prisma + PostgreSQL (Neon)**

## URLs de production

- Frontend : https://jobquest-taupe.vercel.app
- API : https://jobquest-api-steel.vercel.app/api

## Démarrage local

```bash
# 1. Base de données (Postgres exposé sur le port 5433)
docker compose up -d

# 2. Backend
cd backend
cp .env.example .env
# Éditer JWT_SECRET avec une valeur forte
npm install --legacy-peer-deps
npx prisma migrate dev
npx prisma db seed
npm run start:dev

# 3. Frontend (autre terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

- Frontend : http://localhost:3000  
- API : http://localhost:3001/api  
- Postgres local : `localhost:5433`

### Comptes de démo (dev / seed uniquement)

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Recruteur | recruteur@jobquest.fr | password123 |
| Candidat | candidat@jobquest.fr | password123 |

> Ne pas réutiliser ces identifiants en production réelle. Changez `JWT_SECRET` et les mots de passe seed avant une mise en ligne publique.

## Sécurité

- Les fichiers `.env` ne sont **pas** versionnés (voir `.gitignore`)
- Utilisez `.env.example` comme modèle
- En production Vercel : `DATABASE_URL` (Neon), `JWT_SECRET`, `FRONTEND_URL`, `NEXT_PUBLIC_API_URL`

## Pages frontend

- `/` Accueil + recherche
- `/jobs` Liste / filtres
- `/jobs/[id]` Détail + candidature
- `/jobs/new` Publier (recruteur)
- `/login` `/register`
- `/dashboard` Espace candidat / recruteur
- `/dashboard/jobs/[id]` Gestion candidatures
- `/profile` Profil

## Déploiement

- **Frontend** : Vercel (projet `jobquest`)
- **Backend** : Vercel serverless (projet `jobquest-api`) + Neon Postgres
- **Option perf** : déployer le backend sur Render (`render.yaml`) avec `DATABASE_URL` Neon pour un process Node plus stable
