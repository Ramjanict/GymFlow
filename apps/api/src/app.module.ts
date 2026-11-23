import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { BranchesModule } from './modules/branches/branches.module';
import { ClassesModule } from './modules/classes/classes.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    OrganizationsModule,
    BranchesModule,
    ClassesModule,
    SchedulesModule,
    SessionsModule,
    BookingsModule,
    MembershipsModule,
    AttendanceModule,
    DashboardModule,
    UploadModule,
  ],
})
export class AppModule {}
