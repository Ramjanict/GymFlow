import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async bookClass(userId: string, sessionId: string) {
    // 1. Resolve member profile
    const member = await this.prisma.memberProfile.findUnique({
      where: { userId },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE',
            expiresAt: { gte: new Date() },
          },
        },
      },
    });

    if (!member) {
      throw new BadRequestException('User does not have an active member profile');
    }

    // 2. High-concurrency transaction with row-level lock
    return this.prisma.$transaction(async (tx) => {
      // PostgreSQL Row-Level Lock: SELECT * FROM "ClassSession" WHERE id = $1 FOR UPDATE
      const lockedSessions: any[] = await tx.$queryRaw`
        SELECT * FROM "ClassSession" WHERE id = ${sessionId} FOR UPDATE
      `;

      if (!lockedSessions || lockedSessions.length === 0) {
        throw new NotFoundException('Class session not found');
      }

      const session = lockedSessions[0];

      if (session.status !== 'SCHEDULED') {
        throw new BadRequestException('Session is not available for booking');
      }

      // Check if already booked
      const existingBooking = await tx.classBooking.findUnique({
        where: {
          sessionId_memberId: {
            sessionId,
            memberId: member.id,
          },
        },
      });

      if (existingBooking) {
        if (existingBooking.status === 'CONFIRMED') {
          throw new ConflictException('You have already booked this class session');
        } else if (existingBooking.status === 'CANCELLED') {
          // Re-activate booking if capacity allows
          if (session.bookedCount < session.capacity) {
            await tx.classSession.update({
              where: { id: sessionId },
              data: { bookedCount: { increment: 1 } },
            });

            return tx.classBooking.update({
              where: { id: existingBooking.id },
              data: {
                status: 'CONFIRMED',
                bookedAt: new Date(),
                cancelledAt: null,
              },
            });
          }
        }
      }

      // Check capacity
      if (session.bookedCount >= session.capacity) {
        // Class is full -> place in waitlist
        const lastWaitlist = await tx.waitlistEntry.findFirst({
          where: { sessionId },
          orderBy: { position: 'desc' },
        });

        const nextPosition = (lastWaitlist?.position || 0) + 1;

        const waitlistEntry = await tx.waitlistEntry.upsert({
          where: {
            sessionId_memberId: {
              sessionId,
              memberId: member.id,
            },
          },
          create: {
            organizationId: session.organizationId,
            sessionId,
            memberId: member.id,
            position: nextPosition,
          },
          update: {
            position: nextPosition,
          },
        });

        return {
          status: 'WAITLISTED',
          message: `Class session is full. You have been placed on the waitlist at position #${nextPosition}.`,
          waitlist: waitlistEntry,
        };
      }

      // Increment booked count atomically
      await tx.classSession.update({
        where: { id: sessionId },
        data: {
          bookedCount: { increment: 1 },
        },
      });

      // Create confirmed booking
      const booking = await tx.classBooking.create({
        data: {
          organizationId: session.organizationId,
          sessionId,
          memberId: member.id,
          status: 'CONFIRMED',
        },
        include: {
          session: {
            include: {
              fitnessClass: true,
              branch: true,
            },
          },
        },
      });

      return {
        status: 'CONFIRMED',
        message: 'Class booked successfully!',
        booking,
      };
    });
  }

  async cancelBooking(userId: string, bookingId: string) {
    const member = await this.prisma.memberProfile.findUnique({
      where: { userId },
    });
    if (!member) throw new BadRequestException('Member profile not found');

    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.classBooking.findFirst({
        where: {
          id: bookingId,
          memberId: member.id,
          status: 'CONFIRMED',
        },
      });

      if (!booking) {
        throw new NotFoundException('Active booking not found or already cancelled');
      }

      // 1. Mark booking as cancelled
      const updatedBooking = await tx.classBooking.update({
        where: { id: bookingId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
        },
      });

      // 2. Decrement session bookedCount
      await tx.classSession.update({
        where: { id: booking.sessionId },
        data: {
          bookedCount: { decrement: 1 },
        },
      });

      // 3. Promote next person on the waitlist (if any)
      const nextWaitlist = await tx.waitlistEntry.findFirst({
        where: { sessionId: booking.sessionId },
        orderBy: { position: 'asc' },
        include: { member: true },
      });

      let promotedBooking = null;
      if (nextWaitlist) {
        // Remove from waitlist
        await tx.waitlistEntry.delete({
          where: { id: nextWaitlist.id },
        });

        // Promote to confirmed booking
        promotedBooking = await tx.classBooking.create({
          data: {
            organizationId: booking.organizationId,
            sessionId: booking.sessionId,
            memberId: nextWaitlist.memberId,
            status: 'CONFIRMED',
          },
        });

        // Increment count back
        await tx.classSession.update({
          where: { id: booking.sessionId },
          data: {
            bookedCount: { increment: 1 },
          },
        });
      }

      return {
        success: true,
        message: 'Booking cancelled successfully',
        booking: updatedBooking,
        promotedMemberId: nextWaitlist?.memberId || null,
      };
    });
  }

  async findMemberBookings(userId: string) {
    const member = await this.prisma.memberProfile.findUnique({
      where: { userId },
    });
    if (!member) return [];

    return this.prisma.classBooking.findMany({
      where: { memberId: member.id },
      include: {
        session: {
          include: {
            fitnessClass: {
              include: {
                category: true,
              },
            },
            branch: true,
            room: true,
            trainers: {
              include: {
                trainer: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        attendance: true,
      },
      orderBy: { bookedAt: 'desc' },
    });
  }

  async findAllForGym(organizationId: string, status?: string) {
    return this.prisma.classBooking.findMany({
      where: {
        organizationId,
        ...(status ? { status: status as any } : {}),
      },
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
        attendance: true,
      },
      orderBy: { bookedAt: 'desc' },
      take: 100,
    });
  }
}
