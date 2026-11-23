import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  async findByOrganization(organizationId: string) {
    return this.prisma.branch.findMany({
      where: { organizationId, isActive: true },
      include: {
        rooms: true,
        _count: {
          select: {
            sessions: true,
            staff: true,
            trainers: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string, organizationId?: string) {
    const branch = await this.prisma.branch.findFirst({
      where: {
        id,
        ...(organizationId ? { organizationId } : {}),
      },
      include: {
        rooms: true,
        staff: {
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
      },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }
    return branch;
  }

  async create(organizationId: string, data: {
    name: string;
    address: string;
    city: string;
    timezone?: string;
  }) {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    return this.prisma.branch.create({
      data: {
        organizationId,
        name: data.name,
        slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
        address: data.address,
        city: data.city,
        timezone: data.timezone || 'Asia/Dhaka',
        isActive: true,
      },
    });
  }

  async update(id: string, organizationId: string, data: any) {
    await this.findOne(id, organizationId);
    return this.prisma.branch.update({
      where: { id },
      data,
    });
  }

  async addRoom(branchId: string, name: string, capacity: number) {
    return this.prisma.room.create({
      data: {
        branchId,
        name,
        capacity,
      },
    });
  }

  async assignTrainer(branchId: string, trainerId: string) {
    return this.prisma.trainerBranch.upsert({
      where: {
        trainerId_branchId: {
          branchId,
          trainerId,
        },
      },
      create: {
        branchId,
        trainerId,
      },
      update: {},
    });
  }
}
