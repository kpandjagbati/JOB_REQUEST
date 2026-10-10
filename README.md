# JobQuest — Plateforme de recherche d'emploi

Full stack : **Next.js + Tailwind + DaisyUI (fantasy)** / **NestJS + Prisma + PostgreSQL**

## Démarrage rapide

```bash
# 1. Base de données
docker compose up -d

# 2. Backend
cd backend
npm install --legacy-peer-deps
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev

# 3. Frontend (autre terminal)
cd frontend
npm install
npm run dev
```

- Frontend : http://localhost:3000  
- API : http://localhost:3001/api  

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
