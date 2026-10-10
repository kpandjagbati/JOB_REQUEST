import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { ApplicationsService } from './applications.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';

type AuthUser = { id: string; role: Role };

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  apply(@CurrentUser() user: AuthUser, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.apply(user.id, dto);
  }

  @Get('mine')
  mine(@CurrentUser() user: AuthUser) {
    return this.applicationsService.findMine(user.id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.RECRUITER, Role.ADMIN)
  @Get('job/:jobId')
  forJob(@Param('jobId') jobId: string, @CurrentUser() user: AuthUser) {
    return this.applicationsService.findForJob(jobId, user.id, user.role);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.RECRUITER, Role.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.applicationsService.updateStatus(
      id,
      user.id,
      user.role,
      dto.status,
    );
  }
}
