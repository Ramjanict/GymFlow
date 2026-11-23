import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getGymOverview(organizationId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalMembers,
      totalTrainers,
      activeClasses,
      todaySessions,
      recentBookings,
      totalRevenue,
      branches,
    ] = await Promise.all([
      this.prisma.user.count({
        where: {
          organizationId,
          userRoles: { some: { role: { name: 'MEMBER' } } },
        },
      }),
      this.prisma.trainerProfile.count({
        where: {
          user: { organizationId },
        },
      }),
      this.prisma.fitnessClass.count({
        where: { organizationId, status: 'ACTIVE' },
      }),
      this.prisma.classSession.count({
        where: {
          organizationId,
          startsAt: { gte: today, lt: tomorrow },
          status: 'SCHEDULED',
        },
      }),
      this.prisma.classBooking.findMany({
        where: { organizationId },
        take: 5,
        orderBy: { bookedAt: 'desc' },
        include: {
          member: {
            include: {
              user: {
                select: {
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
      }),
      this.prisma.payment.aggregate({
        where: { organizationId, status: 'PAID' },
        _sum: { amount: true },
      }),
      this.prisma.branch.findMany({
        where: { organizationId, isActive: true },
        select: {
          id: true,
          name: true,
          city: true,
          _count: {
            select: {
              sessions: true,
              staff: true,
            },
          },
        },
      }),
    ]);

    return {
      metrics: {
        totalMembers,
        totalTrainers,
        activeClasses,
        todaySessions,
        totalRevenue: Number(totalRevenue._sum.amount || 0),
        currency: 'BDT',
      },
      branches,
      recentBookings,
    };
  }

  async getSuperAdminOverview() {
    const [
      totalOrganizations,
      totalBranches,
      totalUsers,
      totalRevenue,
      organizations,
    ] = await Promise.all([
      this.prisma.organization.count(),
      this.prisma.branch.count(),
      this.prisma.user.count(),
      this.prisma.payment.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true },
      }),
      this.prisma.organization.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              branches: true,
              users: true,
              classes: true,
            },
          },
        },
      }),
    ]);

    return {
      totalOrganizations,
      totalBranches,
      totalUsers,
      totalPlatformRevenue: Number(totalRevenue._sum.amount || 0),
      recentOrganizations: organizations,
    };
  }
}
