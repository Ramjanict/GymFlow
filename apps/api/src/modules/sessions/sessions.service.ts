import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    organizationId?: string;
    branchId?: string;
    trainerId?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }) {
    const where: any = {
      ...(query.organizationId ? { organizationId: query.organizationId } : {}),
      ...(query.branchId ? { branchId: query.branchId } : {}),
      status: (query.status as any) || 'SCHEDULED',
    };

    if (query.date) {
      const startOfDay = new Date(query.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(query.date);
      endOfDay.setHours(23, 59, 59, 999);
      where.startsAt = { gte: startOfDay, lte: endOfDay };
    } else if (query.startDate && query.endDate) {
      where.startsAt = {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate),
      };
    } else {
      // Default: today onwards
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      where.startsAt = { gte: now };
    }

    if (query.trainerId) {
      where.trainers = {
        some: {
          trainerId: query.trainerId,
        },
      };
    }

    return this.prisma.classSession.findMany({
      where,
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
        _count: {
          select: {
            bookings: true,
            waitlist: true,
          },
        },
      },
      orderBy: { startsAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const session = await this.prisma.classSession.findUnique({
      where: { id },
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
                    email: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
        bookings: {
          where: { status: 'CONFIRMED' },
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
            attendance: true,
          },
        },
        waitlist: {
          orderBy: { position: 'asc' },
          include: {
            member: {
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
    });

    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  async cancelSession(id: string) {
    const session = await this.findOne(id);
    return this.prisma.classSession.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async assignTrainer(sessionId: string, trainerId: string) {
    const session = await this.findOne(sessionId);

    // Conflict detection: does trainer have overlapping session?
    const conflict = await this.prisma.sessionTrainer.findFirst({
      where: {
        trainerId,
        session: {
          id: { not: sessionId },
          status: 'SCHEDULED',
          startsAt: { lt: session.endsAt },
          endsAt: { gt: session.startsAt },
        },
      },
      include: { session: { include: { fitnessClass: true } } },
    });

    if (conflict) {
      throw new BadRequestException(
        `Trainer already scheduled for ${conflict.session.fitnessClass.name} at this time`,
      );
    }

    return this.prisma.sessionTrainer.upsert({
      where: {
        sessionId_trainerId: {
          sessionId,
          trainerId,
        },
      },
      create: {
        sessionId,
        trainerId,
      },
      update: {},
    });
  }
}
