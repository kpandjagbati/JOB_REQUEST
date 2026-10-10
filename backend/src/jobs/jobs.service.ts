import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JobStatus, JobType, Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateJobDto } from './dto/create-job.dto.js';
import { UpdateJobDto } from './dto/update-job.dto.js';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  private companyInclude = {
    company: true,
    _count: { select: { applications: true } },
  };

  async findAll(query: {
    q?: string;
    location?: string;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 9, 50);
    const where: Prisma.JobWhereInput = { status: JobStatus.OPEN };

    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: 'insensitive' } },
        { description: { contains: query.q, mode: 'insensitive' } },
        { company: { name: { contains: query.q, mode: 'insensitive' } } },
      ];
    }
    if (query.location) {
      where.location = { contains: query.location, mode: 'insensitive' };
    }
    if (query.type && Object.values(JobType).includes(query.type as JobType)) {
      where.type = query.type as JobType;
    }

    const [data, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        include: this.companyInclude,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.job.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: this.companyInclude,
    });
    if (!job) throw new NotFoundException('Offre introuvable.');
    return job;
  }

  async findMine(userId: string) {
    return this.prisma.job.findMany({
      where: { authorId: userId },
      include: this.companyInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(
    userId: string,
    dto: CreateJobDto,
  ) {
    let company = await this.prisma.company.findFirst({
      where: { ownerId: userId, name: dto.companyName },
    });
    if (!company) {
      company = await this.prisma.company.create({
        data: {
          name: dto.companyName,
          ownerId: userId,
        },
      });
    }

    return this.prisma.job.create({
      data: {
        title: dto.title,
        description: dto.description,
        requirements: dto.requirements,
        location: dto.location,
        type: dto.type,
        salaryMin: dto.salaryMin,
        salaryMax: dto.salaryMax,
        companyId: company.id,
        authorId: userId,
      },
      include: this.companyInclude,
    });
  }

  async update(
    id: string,
    userId: string,
    role: Role,
    dto: UpdateJobDto,
  ) {
    const job = await this.findOne(id);
    if (job.authorId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('Vous ne pouvez pas modifier cette offre.');
    }
    return this.prisma.job.update({
      where: { id },
      data: dto,
      include: this.companyInclude,
    });
  }

  async remove(id: string, userId: string, role: Role) {
    const job = await this.findOne(id);
    if (job.authorId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('Vous ne pouvez pas supprimer cette offre.');
    }
    await this.prisma.job.delete({ where: { id } });
    return { deleted: true };
  }
}
