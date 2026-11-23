import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { SchedulesService } from './schedules.service';

@ApiTags('Schedules')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
@Controller('schedules')
export class SchedulesController {
  constructor(private schedulesService: SchedulesService) {}

  @Get()
  @ApiOperation({ summary: 'List all recurring schedules for current organization' })
  async findAll(@CurrentTenant() orgId: string) {
    const list = await this.schedulesService.findByOrganization(orgId);
    return { success: true, data: list };
  }

  @Post()
  @ApiOperation({ summary: 'Create recurring schedule and generate occurrences' })
  async create(
    @CurrentTenant() orgId: string,
    @Body()
    body: {
      fitnessClassId: string;
      branchId: string;
      startTime: string;
      endTime: string;
      startDate: string;
      endDate?: string;
      daysOfWeek: string[];
      trainerId?: string;
    },
  ) {
    const schedule = await this.schedulesService.create(orgId, body);
    return {
      success: true,
      message: 'Schedule created and sessions generated',
      data: schedule,
    };
  }

  @Post(':id/generate')
  @ApiOperation({ summary: 'Manually trigger session generation for a schedule' })
  async generate(@Param('id') id: string) {
    const sessions = await this.schedulesService.generateSessions(id, 30);
    return {
      success: true,
      message: `Generated ${sessions.length} sessions`,
      data: sessions,
    };
  }
}
