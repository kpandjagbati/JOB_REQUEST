import { PrismaClient, Role, JobType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const recruiter = await prisma.user.upsert({
    where: { email: 'recruteur@jobquest.fr' },
    update: {},
    create: {
      email: 'recruteur@jobquest.fr',
      password,
      firstName: 'Alice',
      lastName: 'Martin',
      role: Role.RECRUITER,
    },
  });

  const candidate = await prisma.user.upsert({
    where: { email: 'candidat@jobquest.fr' },
    update: {},
    create: {
      email: 'candidat@jobquest.fr',
      password,
      firstName: 'Bob',
      lastName: 'Dupont',
      role: Role.CANDIDATE,
    },
  });

  const company = await prisma.company.upsert({
    where: { id: '00000000-0000-4000-8000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000001',
      name: 'Fantasy Tech',
      description: 'Studio digital spécialisé en produits web modernes.',
      location: 'Paris',
      website: 'https://example.com',
      ownerId: recruiter.id,
    },
  });

  const jobs = [
    {
      title: 'Développeur Full Stack Next.js',
      description:
        'Rejoignez Fantasy Tech pour construire des expériences web magiques avec Next.js, NestJS et Prisma.',
      requirements: 'TypeScript, React, NestJS, PostgreSQL',
      location: 'Paris',
      type: JobType.FULL_TIME,
      salaryMin: 42000,
      salaryMax: 55000,
    },
    {
      title: 'Stage UX / UI Designer',
      description:
        'Stage de 6 mois pour designer des interfaces inspirées du thème fantasy.',
      requirements: 'Figma, sens du détail, portfolio',
      location: 'Remote',
      type: JobType.INTERNSHIP,
      salaryMin: 800,
      salaryMax: 1200,
    },
    {
      title: 'Recruteur IT',
      description:
        'Sourcing et accompagnement des talents tech pour nos clients.',
      requirements: 'Expérience recrutement tech',
      location: 'Lyon',
      type: JobType.CONTRACT,
      salaryMin: 35000,
      salaryMax: 45000,
    },
  ];

  for (const job of jobs) {
    const exists = await prisma.job.findFirst({
      where: { title: job.title, companyId: company.id },
    });
    if (!exists) {
      await prisma.job.create({
        data: { ...job, companyId: company.id, authorId: recruiter.id },
      });
    }
  }

  console.log('Seed OK');
  console.log('Recruteur: recruteur@jobquest.fr / password123');
  console.log('Candidat: candidat@jobquest.fr / password123');
  console.log('Compte candidat créé:', candidate.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
