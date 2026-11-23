import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.organization.findMany({
      include: {
        _count: {
          select: {
            branches: true,
            users: true,
            classes: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        branches: {
          include: {
            rooms: true,
          },
        },
        _count: {
          select: {
            users: true,
            classes: true,
            plans: true,
          },
        },
      },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }
    return org;
  }

  async create(data: { name: string; email: string; phone?: string; logo?: string }) {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    return this.prisma.organization.create({
      data: {
        name: data.name,
        slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
        email: data.email,
        phone: data.phone,
        logo: data.logo,
        status: 'ACTIVE',
      },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.organization.update({
      where: { id },
      data,
    });
  }

  async getStaff(organizationId: string) {
    return this.prisma.user.findMany({
      where: {
        organizationId,
        userRoles: {
          some: {
            role: {
              name: {
                in: ['GYM_OWNER', 'GYM_ADMIN', 'BRANCH_MANAGER', 'TRAINER', 'RECEPTIONIST'],
              },
            },
          },
        },
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        trainer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
