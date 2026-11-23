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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { BookingsService } from './bookings.service';

@ApiTags('Bookings')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Book class session or join waitlist (concurrency locked)' })
  async book(
    @CurrentUser('id') userId: string,
    @Body('sessionId') sessionId: string,
  ) {
    const result = await this.bookingsService.bookClass(userId, sessionId);
    return { success: true, ...result };
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel booking and automatically promote waitlist' })
  async cancel(
    @CurrentUser('id') userId: string,
    @Param('id') bookingId: string,
  ) {
    const result = await this.bookingsService.cancelBooking(userId, bookingId);
    return { success: true, ...result };
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current member bookings' })
  async myBookings(@CurrentUser('id') userId: string) {
    const bookings = await this.bookingsService.findMemberBookings(userId);
    return { success: true, data: bookings };
  }

  @Get('gym')
  @ApiOperation({ summary: 'Get all bookings for gym dashboard' })
  async gymBookings(
    @CurrentTenant() orgId: string,
    @Query('status') status?: string,
  ) {
    const bookings = await this.bookingsService.findAllForGym(orgId, status);
    return { success: true, data: bookings };
  }
}
