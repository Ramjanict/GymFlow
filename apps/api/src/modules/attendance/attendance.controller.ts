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
import { AttendanceService } from './attendance.service';

@ApiTags('Attendance')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('check-in')
  @ApiOperation({ summary: 'Check in a member for their class' })
  async checkIn(
    @Body('bookingId') bookingId: string,
    @CurrentUser('id') staffId: string,
  ) {
    const record = await this.attendanceService.checkIn(bookingId, staffId);
    return { success: true, message: 'Checked in successfully', data: record };
  }

  @Patch(':bookingId/no-show')
  @ApiOperation({ summary: 'Mark booking as no-show / absent' })
  async markNoShow(@Param('bookingId') bookingId: string) {
    const updated = await this.attendanceService.markNoShow(bookingId);
    return { success: true, message: 'Marked as no-show', data: updated };
  }

  @Get()
  @ApiOperation({ summary: 'List attendance history' })
  async getRecords(
    @CurrentTenant() orgId: string,
    @Query('sessionId') sessionId?: string,
  ) {
    const records = await this.attendanceService.getAttendanceRecords(
      orgId,
      sessionId,
    );
    return { success: true, data: records };
  }
}
