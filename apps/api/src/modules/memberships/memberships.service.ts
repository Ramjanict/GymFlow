import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MembershipsService {
  constructor(private prisma: PrismaService) {}

  async findPlans(organizationId?: string) {
    return this.prisma.membershipPlan.findMany({
      where: {
        ...(organizationId ? { organizationId } : {}),
        isActive: true,
      },
      include: {
        branches: {
          include: {
            branch: true,
          },
        },
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
      orderBy: { price: 'asc' },
    });
  }

  async createPlan(organizationId: string, data: {
    name: string;
    description?: string;
    price: number;
    durationDays: number;
    bookingLimit?: number;
    branchIds?: string[];
  }) {
    return this.prisma.membershipPlan.create({
      data: {
        organizationId,
        name: data.name,
        description: data.description,
        price: data.price,
        durationDays: Number(data.durationDays),
        bookingLimit: data.bookingLimit ? Number(data.bookingLimit) : null,
        isActive: true,
        ...(data.branchIds && data.branchIds.length > 0
          ? {
              branches: {
                create: data.branchIds.map((branchId) => ({ branchId })),
              },
            }
          : {}),
      },
      include: {
        branches: {
          include: {
            branch: true,
          },
        },
      },
    });
  }

  async subscribe(userId: string, planId: string) {
    const member = await this.prisma.memberProfile.findUnique({
      where: { userId },
    });
    if (!member) throw new BadRequestException('Member profile not found');

    const plan = await this.prisma.membershipPlan.findUnique({
      where: { id: planId },
    });
    if (!plan) throw new NotFoundException('Membership plan not found');

    const startsAt = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(startsAt.getDate() + plan.durationDays);

    return this.prisma.$transaction(async (tx) => {
      // Create subscription
      const subscription = await tx.subscription.create({
        data: {
          organizationId: plan.organizationId,
          memberId: member.id,
          planId: plan.id,
          startsAt,
          expiresAt,
          status: 'ACTIVE',
        },
      });

      // Create payment record
      const payment = await tx.payment.create({
        data: {
          organizationId: plan.organizationId,
          subscriptionId: subscription.id,
          amount: plan.price,
          currency: 'BDT',
          provider: 'BKASH',
          transactionId: `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'PAID',
        },
      });

      // Generate invoice
      await tx.invoice.create({
        data: {
          organizationId: plan.organizationId,
          paymentId: payment.id,
          invoiceNumber: `INV-${Date.now()}`,
          amount: plan.price,
        },
      });

      return {
        subscription,
        payment,
      };
    });
  }

  async getMemberSubscription(userId: string) {
    const member = await this.prisma.memberProfile.findUnique({
      where: { userId },
    });
    if (!member) return null;

    return this.prisma.subscription.findFirst({
      where: {
        memberId: member.id,
        status: 'ACTIVE',
        expiresAt: { gte: new Date() },
      },
      include: {
        plan: true,
      },
      orderBy: { expiresAt: 'desc' },
    });
  }
}
