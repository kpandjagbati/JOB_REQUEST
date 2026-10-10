# JobQuest — Plateforme de recherche d'emploi

Full stack : **Next.js + Tailwind + DaisyUI (fantasy)** / **NestJS + Prisma + PostgreSQL**

## Démarrage rapide

```bash
# 1. Base de données (Postgres exposé sur le port 5433)
docker compose up -d

# 2. Backend
cd backend
cp .env.example .env
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
- Postgres : `localhost:5433`

### Comptes de démo

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Recruteur | recruteur@jobquest.fr | password123 |
| Candidat | candidat@jobquest.fr | password123 |

## Pages frontend

- `/` Accueil + recherche
- `/jobs` Liste / filtres
- `/jobs/[id]` Détail + candidature
- `/jobs/new` Publier (recruteur)
- `/login` `/register`
- `/dashboard` Espace candidat / recruteur
- `/dashboard/jobs/[id]` Gestion candidatures
- `/profile` Profil
