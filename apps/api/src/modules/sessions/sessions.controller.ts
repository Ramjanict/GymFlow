import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { SessionsService } from './sessions.service';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Browse scheduled class sessions' })
  async findAll(
    @Query('organizationId') orgId?: string,
    @Query('branchId') branchId?: string,
    @Query('trainerId') trainerId?: string,
    @Query('date') date?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const list = await this.sessionsService.findAll({
      organizationId: orgId,
      branchId,
      trainerId,
      date,
      startDate,
      endDate,
    });
    return { success: true, data: list };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get session details, capacity, and enrolled members' })
  async findOne(@Param('id') id: string) {
    const item = await this.sessionsService.findOne(id);
    return { success: true, data: item };
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @ApiBearerAuth()
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel scheduled session' })
  async cancelSession(@Param('id') id: string) {
    const session = await this.sessionsService.cancelSession(id);
    return { success: true, message: 'Session cancelled', data: session };
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @ApiBearerAuth()
  @Post(':id/trainers')
  @ApiOperation({ summary: 'Assign trainer to session with conflict check' })
  async assignTrainer(
    @Param('id') id: string,
    @Body('trainerId') trainerId: string,
  ) {
    const assigned = await this.sessionsService.assignTrainer(id, trainerId);
    return { success: true, message: 'Trainer assigned to session', data: assigned };
  }
}
