import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId?: string, categoryId?: string) {
    return this.prisma.fitnessClass.findMany({
      where: {
        ...(organizationId ? { organizationId } : {}),
        ...(categoryId ? { categoryId } : {}),
        status: 'ACTIVE',
      },
      include: {
        category: true,
        _count: {
          select: {
            sessions: true,
            schedules: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, organizationId?: string) {
    const fitnessClass = await this.prisma.fitnessClass.findFirst({
      where: {
        id,
        ...(organizationId ? { organizationId } : {}),
      },
      include: {
        category: true,
        schedules: {
          include: {
            branch: true,
          },
        },
        sessions: {
          where: {
            startsAt: { gte: new Date() },
          },
          take: 10,
          orderBy: { startsAt: 'asc' },
          include: {
            branch: true,
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
      },
    });

    if (!fitnessClass) {
      throw new NotFoundException('Fitness class not found');
    }
    return fitnessClass;
  }

  async create(organizationId: string, data: {
    name: string;
    description?: string;
    duration: number;
    capacity: number;
    level?: string;
    image?: string;
    categoryId?: string;
  }) {
    return this.prisma.fitnessClass.create({
      data: {
        organizationId,
        name: data.name,
        description: data.description,
        duration: Number(data.duration),
        capacity: Number(data.capacity),
        level: data.level || 'All Levels',
        image: data.image,
        categoryId: data.categoryId,
        status: 'ACTIVE',
      },
      include: {
        category: true,
      },
    });
  }

  async update(id: string, organizationId: string, data: any) {
    await this.findOne(id, organizationId);
    return this.prisma.fitnessClass.update({
      where: { id },
      data: {
        ...data,
        duration: data.duration ? Number(data.duration) : undefined,
        capacity: data.capacity ? Number(data.capacity) : undefined,
      },
      include: {
        category: true,
      },
    });
  }

  async getCategories(organizationId?: string) {
    return this.prisma.classCategory.findMany({
      where: organizationId ? { organizationId } : {},
      include: {
        _count: {
          select: {
            classes: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(organizationId: string, name: string, description?: string) {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    return this.prisma.classCategory.create({
      data: {
        organizationId,
        name,
        slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
        description,
      },
    });
  }
}
