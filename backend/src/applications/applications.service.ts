import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationStatus, JobStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async apply(userId: string, dto: CreateApplicationDto) {
    const job = await this.prisma.job.findUnique({ where: { id: dto.jobId } });
    if (!job || job.status !== JobStatus.OPEN) {
      throw new NotFoundException('Offre indisponible.');
    }

    const existing = await this.prisma.application.findUnique({
      where: { jobId_userId: { jobId: dto.jobId, userId } },
    });
    if (existing) {
      throw new ConflictException('Vous avez déjà postulé à cette offre.');
    }

    return this.prisma.application.create({
      data: {
        jobId: dto.jobId,
        userId,
        coverLetter: dto.coverLetter,
      },
      include: {
        job: { include: { company: true } },
      },
    });
  }

  async findMine(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      include: { job: { include: { company: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findForJob(jobId: string, userId: string, role: Role) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Offre introuvable.');
    if (job.authorId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('Accès refusé.');
    }
    return this.prisma.application.findMany({
      where: { jobId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            bio: true,
            createdAt: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(
    id: string,
    userId: string,
    role: Role,
    status: ApplicationStatus,
  ) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { job: true },
    });
    if (!application) throw new NotFoundException('Candidature introuvable.');
    if (application.job.authorId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('Accès refusé.');
    }
    return this.prisma.application.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            bio: true,
            createdAt: true,
            role: true,
          },
        },
        job: { include: { company: true } },
      },
    });
  }
}
