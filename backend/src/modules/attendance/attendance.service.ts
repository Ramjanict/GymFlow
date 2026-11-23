import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async checkIn(bookingId: string, checkedInBy?: string) {
    const booking = await this.prisma.classBooking.findUnique({
      where: { id: bookingId },
      include: { session: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'CONFIRMED') {
      throw new BadRequestException('Cannot check in a non-confirmed booking');
    }

    const attendance = await this.prisma.attendance.upsert({
      where: { bookingId },
      create: {
        organizationId: booking.organizationId,
        bookingId,
        status: 'PRESENT',
        checkedInAt: new Date(),
        checkedInBy,
      },
      update: {
        status: 'PRESENT',
        checkedInAt: new Date(),
        checkedInBy,
      },
      include: {
        booking: {
          include: {
            member: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
              },
            },
            session: {
              include: {
                fitnessClass: true,
              },
            },
          },
        },
      },
    });

    // Also update booking status to ATTENDED
    await this.prisma.classBooking.update({
      where: { id: bookingId },
      data: { status: 'ATTENDED' },
    });

    return attendance;
  }

  async markNoShow(bookingId: string) {
    const booking = await this.prisma.classBooking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    await this.prisma.attendance.upsert({
      where: { bookingId },
      create: {
        organizationId: booking.organizationId,
        bookingId,
        status: 'ABSENT',
      },
      update: {
        status: 'ABSENT',
      },
    });

    return this.prisma.classBooking.update({
      where: { id: bookingId },
      data: { status: 'NO_SHOW' },
    });
  }

  async getAttendanceRecords(organizationId: string, sessionId?: string) {
    return this.prisma.attendance.findMany({
      where: {
        organizationId,
        ...(sessionId ? { booking: { sessionId } } : {}),
      },
      include: {
        booking: {
          include: {
            member: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true,
                  },
                },
              },
            },
            session: {
              include: {
                fitnessClass: true,
                branch: true,
              },
            },
          },
        },
      },
      orderBy: { checkedInAt: 'desc' },
      take: 100,
    });
  }
}
