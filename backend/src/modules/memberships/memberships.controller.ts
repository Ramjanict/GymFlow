import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { MembershipsService } from './memberships.service';

@ApiTags('Memberships')
@Controller('memberships')
export class MembershipsController {
  constructor(private membershipsService: MembershipsService) {}

  @Public()
  @Get('plans')
  @ApiOperation({ summary: 'Browse membership plans' })
  async getPlans(@Query('organizationId') orgId?: string) {
    const plans = await this.membershipsService.findPlans(orgId);
    return { success: true, data: plans };
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @ApiBearerAuth()
  @Post('plans')
  @ApiOperation({ summary: 'Create new membership plan for gym' })
  async createPlan(
    @CurrentTenant() orgId: string,
    @Body()
    body: {
      name: string;
      description?: string;
      price: number;
      durationDays: number;
      bookingLimit?: number;
      branchIds?: string[];
    },
  ) {
    const plan = await this.membershipsService.createPlan(orgId, body);
    return { success: true, message: 'Plan created', data: plan };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe / Purchase membership plan' })
  async subscribe(
    @CurrentUser('id') userId: string,
    @Body('planId') planId: string,
  ) {
    const result = await this.membershipsService.subscribe(userId, planId);
    return { success: true, message: 'Subscribed successfully', data: result };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('my-subscription')
  @ApiOperation({ summary: 'Get current member active subscription' })
  async mySubscription(@CurrentUser('id') userId: string) {
    const sub = await this.membershipsService.getMemberSubscription(userId);
    return { success: true, data: sub };
  }
}
