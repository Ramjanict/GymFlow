import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get summary metrics and recent activity for Gym Dashboard' })
  async getOverview(@CurrentTenant() orgId: string) {
    const data = await this.dashboardService.getGymOverview(orgId);
    return { success: true, data };
  }

  @Get('superadmin')
  @ApiOperation({ summary: 'Get platform-wide metrics for Super Admin' })
  async getSuperAdminOverview(@CurrentUser() user: any) {
    const data = await this.dashboardService.getSuperAdminOverview();
    return { success: true, data };
  }
}
