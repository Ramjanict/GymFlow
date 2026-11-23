import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async findByOrganization(organizationId: string) {
    return this.prisma.classSchedule.findMany({
      where: { organizationId },
      include: {
        fitnessClass: true,
        branch: true,
        _count: {
          select: {
            sessions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(organizationId: string, data: {
    fitnessClassId: string;
    branchId: string;
    startTime: string; // e.g. "10:00"
    endTime: string;   // e.g. "11:00"
    startDate: string;
    endDate?: string;
    daysOfWeek: string[]; // ['MONDAY', 'WEDNESDAY']
    timezone?: string;
    trainerId?: string;
  }) {
    const fitnessClass = await this.prisma.fitnessClass.findUnique({
      where: { id: data.fitnessClassId },
    });
    if (!fitnessClass) throw new NotFoundException('Class not found');

    const schedule = await this.prisma.classSchedule.create({
      data: {
        organizationId,
        fitnessClassId: data.fitnessClassId,
        branchId: data.branchId,
        startTime: data.startTime,
        endTime: data.endTime,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        daysOfWeek: data.daysOfWeek as any,
        timezone: data.timezone || 'Asia/Dhaka',
      },
    });

    // Auto-generate upcoming sessions for next 30 days
    await this.generateSessions(schedule.id, 30, data.trainerId);

    return schedule;
  }

  async generateSessions(scheduleId: string, daysAhead: number = 30, trainerId?: string) {
    const schedule = await this.prisma.classSchedule.findUnique({
      where: { id: scheduleId },
      include: {
        fitnessClass: true,
      },
    });
    if (!schedule) throw new NotFoundException('Schedule not found');

    const dayMap: Record<string, number> = {
      SUNDAY: 0,
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
    };

    const targetDayNumbers = schedule.daysOfWeek.map((d) => dayMap[d]);
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + daysAhead);

    const createdSessions = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (targetDayNumbers.includes(d.getDay())) {
        const [startHours, startMinutes] = schedule.startTime.split(':').map(Number);
        const [endHours, endMinutes] = schedule.endTime.split(':').map(Number);

        const sessionStart = new Date(d);
        sessionStart.setHours(startHours, startMinutes, 0, 0);

        const sessionEnd = new Date(d);
        sessionEnd.setHours(endHours, endMinutes, 0, 0);

        // Check if session already generated for this timestamp
        const existing = await this.prisma.classSession.findFirst({
          where: {
            scheduleId: schedule.id,
            startsAt: sessionStart,
          },
        });

        if (!existing) {
          const session = await this.prisma.classSession.create({
            data: {
              organizationId: schedule.organizationId,
              branchId: schedule.branchId,
              scheduleId: schedule.id,
              fitnessClassId: schedule.fitnessClassId,
              startsAt: sessionStart,
              endsAt: sessionEnd,
              capacity: schedule.fitnessClass.capacity,
              bookedCount: 0,
              status: 'SCHEDULED',
              ...(trainerId
                ? {
                    trainers: {
                      create: {
                        trainerId,
                      },
                    },
                  }
                : {}),
            },
          });
          createdSessions.push(session);
        }
      }
    }

    return createdSessions;
  }
}
