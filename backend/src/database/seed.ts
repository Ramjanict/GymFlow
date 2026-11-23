import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding GymFlow Multi-Tenant Platform Database...');

  // 1. Permissions
  const permissionsList = [
    { key: 'organization.read', description: 'Read organization details' },
    { key: 'organization.update', description: 'Update organization details' },
    { key: 'branch.create', description: 'Create branch' },
    { key: 'branch.read', description: 'Read branches' },
    { key: 'branch.update', description: 'Update branch' },
    { key: 'trainer.create', description: 'Add trainer' },
    { key: 'trainer.read', description: 'Read trainers' },
    { key: 'class.create', description: 'Create class' },
    { key: 'class.read', description: 'Read classes' },
    { key: 'class.update', description: 'Update class' },
    { key: 'schedule.create', description: 'Create schedule' },
    { key: 'schedule.update', description: 'Update schedule' },
    { key: 'booking.create', description: 'Create booking' },
    { key: 'booking.read', description: 'Read bookings' },
    { key: 'booking.cancel', description: 'Cancel booking' },
    { key: 'membership.read', description: 'Read memberships' },
    { key: 'membership.create', description: 'Create membership plan' },
    { key: 'attendance.create', description: 'Check-in member' },
    { key: 'attendance.read', description: 'Read attendance records' },
    { key: 'report.read', description: 'View analytics and revenue' },
  ];

  for (const perm of permissionsList) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      create: perm,
      update: {},
    });
  }

  // 2. Platform Roles
  const roles = [
    { name: 'SUPER_ADMIN', type: 'PLATFORM' },
    { name: 'GYM_OWNER', type: 'ORGANIZATION' },
    { name: 'GYM_ADMIN', type: 'ORGANIZATION' },
    { name: 'BRANCH_MANAGER', type: 'ORGANIZATION' },
    { name: 'TRAINER', type: 'ORGANIZATION' },
    { name: 'RECEPTIONIST', type: 'ORGANIZATION' },
    { name: 'MEMBER', type: 'ORGANIZATION' },
  ];

  const dbRoles: Record<string, any> = {};
  for (const r of roles) {
    let createdRole = await prisma.role.findFirst({
      where: {
        name: r.name,
        organizationId: null,
      },
    });
    if (!createdRole) {
      createdRole = await prisma.role.create({
        data: {
          name: r.name,
          type: r.type as any,
        },
      });
    }
    dbRoles[r.name] = createdRole;
  }

  // 3. Platform Plans (SaaS tiers)
  const platformPlans = [
    { name: 'STARTER', price: 49.0, maxBranches: 1, maxMembers: 100, maxTrainers: 5 },
    { name: 'PROFESSIONAL', price: 149.0, maxBranches: 5, maxMembers: 1000, maxTrainers: 30 },
    { name: 'ENTERPRISE', price: 399.0, maxBranches: 50, maxMembers: 10000, maxTrainers: 200 },
  ];
  for (const plan of platformPlans) {
    await prisma.platformPlan.upsert({
      where: { name: plan.name },
      create: plan,
      update: {},
    });
  }

  // 4. Demo Organization: FitZone
  const fitzoneOrg = await prisma.organization.upsert({
    where: { slug: 'fitzone' },
    create: {
      name: 'FitZone Global Fitness',
      slug: 'fitzone',
      email: 'contact@fitzone.com',
      phone: '+8801711223344',
      logo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop',
      status: 'ACTIVE',
    },
    update: {},
  });

  // 5. Branches for FitZone
  const branchMirpur = await prisma.branch.upsert({
    where: {
      organizationId_slug: {
        organizationId: fitzoneOrg.id,
        slug: 'mirpur',
      },
    },
    create: {
      organizationId: fitzoneOrg.id,
      name: 'FitZone Mirpur Center',
      slug: 'mirpur',
      address: 'Plot 12, Main Road, Section 2',
      city: 'Dhaka',
      timezone: 'Asia/Dhaka',
      isActive: true,
      rooms: {
        create: [
          { name: 'Studio A - Yoga Sanctuary', capacity: 25 },
          { name: 'Studio B - HIIT Arena', capacity: 20 },
        ],
      },
    },
    update: {},
  });

  const branchGulshan = await prisma.branch.upsert({
    where: {
      organizationId_slug: {
        organizationId: fitzoneOrg.id,
        slug: 'gulshan',
      },
    },
    create: {
      organizationId: fitzoneOrg.id,
      name: 'FitZone Gulshan Elite',
      slug: 'gulshan',
      address: 'Road 45, Gulshan-2',
      city: 'Dhaka',
      timezone: 'Asia/Dhaka',
      isActive: true,
      rooms: {
        create: [
          { name: 'Reformer Studio', capacity: 15 },
          { name: 'Strength Zone', capacity: 30 },
        ],
      },
    },
    update: {},
  });

  // 6. Users
  const defaultPassword = await bcrypt.hash('123456', 10);
  const adminPassword = await bcrypt.hash('Admin12345!', 10);

  // Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@gymflow.com' },
    create: {
      email: 'admin@gymflow.com',
      password: adminPassword,
      firstName: 'Md Ramjan',
      lastName: 'Ali (Super Admin)',
      status: 'ACTIVE',
      userRoles: {
        create: {
          roleId: dbRoles['SUPER_ADMIN'].id,
        },
      },
    },
    update: {},
  });

  // Gym Owner
  const gymOwner = await prisma.user.upsert({
    where: { email: 'owner@fitzone.com' },
    create: {
      email: 'owner@fitzone.com',
      password: defaultPassword,
      firstName: 'Alex',
      lastName: 'Kareem',
      organizationId: fitzoneOrg.id,
      status: 'ACTIVE',
      userRoles: {
        create: {
          roleId: dbRoles['GYM_OWNER'].id,
        },
      },
    },
    update: {},
  });

  // Trainer
  const trainerUser = await prisma.user.upsert({
    where: { email: 'trainer@fitzone.com' },
    create: {
      email: 'trainer@fitzone.com',
      password: defaultPassword,
      firstName: 'Marcus',
      lastName: 'Vance',
      organizationId: fitzoneOrg.id,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop',
      status: 'ACTIVE',
      userRoles: {
        create: {
          roleId: dbRoles['TRAINER'].id,
        },
      },
      trainer: {
        create: {
          bio: 'Certified strength & conditioning coach with 8+ years experience in high performance training.',
          specialties: ['HIIT', 'Hypertrophy', 'Olympic Weightlifting'],
          hourlyRate: 1500,
        },
      },
    },
    update: {},
    include: { trainer: true },
  });

  if (trainerUser.trainer) {
    await prisma.trainerBranch.upsert({
      where: {
        trainerId_branchId: {
          trainerId: trainerUser.trainer.id,
          branchId: branchMirpur.id,
        },
      },
      create: {
        trainerId: trainerUser.trainer.id,
        branchId: branchMirpur.id,
      },
      update: {},
    });
  }

  // Member
  const memberUser = await prisma.user.upsert({
    where: { email: 'member@fitzone.com' },
    create: {
      email: 'member@fitzone.com',
      password: defaultPassword,
      firstName: 'Sarah',
      lastName: 'Hossain',
      organizationId: fitzoneOrg.id,
      status: 'ACTIVE',
      userRoles: {
        create: {
          roleId: dbRoles['MEMBER'].id,
        },
      },
      member: {
        create: {
          emergencyContact: '+8801799887766',
        },
      },
    },
    update: {},
    include: { member: true },
  });

  // 7. Categories & Classes
  const catYoga = await prisma.classCategory.upsert({
    where: { organizationId_slug: { organizationId: fitzoneOrg.id, slug: 'yoga' } },
    create: {
      organizationId: fitzoneOrg.id,
      name: 'Yoga & Flexibility',
      slug: 'yoga',
      description: 'Mindful breathing, alignment, and deep flexibility training',
    },
    update: {},
  });

  const catHiit = await prisma.classCategory.upsert({
    where: { organizationId_slug: { organizationId: fitzoneOrg.id, slug: 'hiit' } },
    create: {
      organizationId: fitzoneOrg.id,
      name: 'HIIT & Conditioning',
      slug: 'hiit',
      description: 'Maximum calorie burn with interval training',
    },
    update: {},
  });

  const classYoga = await prisma.fitnessClass.upsert({
    where: { id_organizationId: { id: 'class-yoga-101', organizationId: fitzoneOrg.id } },
    create: {
      id: 'class-yoga-101',
      organizationId: fitzoneOrg.id,
      categoryId: catYoga.id,
      name: 'Sunrise Flow Yoga',
      description: 'Vinyasa flow designed to energize and ground your day.',
      duration: 60,
      capacity: 20,
      level: 'All Levels',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop',
      status: 'ACTIVE',
    },
    update: {},
  });

  const classHiit = await prisma.fitnessClass.upsert({
    where: { id_organizationId: { id: 'class-hiit-101', organizationId: fitzoneOrg.id } },
    create: {
      id: 'class-hiit-101',
      organizationId: fitzoneOrg.id,
      categoryId: catHiit.id,
      name: 'Metabolic Inferno HIIT',
      description: 'High octane intervals, kettlebells, and bodyweight conditioning.',
      duration: 45,
      capacity: 16,
      level: 'Intermediate - Advanced',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop',
      status: 'ACTIVE',
    },
    update: {},
  });

  // 8. Membership Plans
  const basicPlan = await prisma.membershipPlan.create({
    data: {
      organizationId: fitzoneOrg.id,
      name: 'Standard Membership',
      description: 'Access to Mirpur Branch and up to 12 classes per month.',
      price: 2500.0,
      durationDays: 30,
      bookingLimit: 12,
      isActive: true,
      branches: {
        create: {
          branchId: branchMirpur.id,
        },
      },
    },
  });

  const vipPlan = await prisma.membershipPlan.create({
    data: {
      organizationId: fitzoneOrg.id,
      name: 'All-Access VIP Pass',
      description: 'Unlimited access across all FitZone branches and classes.',
      price: 4500.0,
      durationDays: 30,
      bookingLimit: null,
      isActive: true,
      branches: {
        create: [
          { branchId: branchMirpur.id },
          { branchId: branchGulshan.id },
        ],
      },
    },
  });

  // Active subscription for demo member
  if (memberUser.member) {
    const sub = await prisma.subscription.create({
      data: {
        organizationId: fitzoneOrg.id,
        memberId: memberUser.member.id,
        planId: vipPlan.id,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'ACTIVE',
      },
    });

    await prisma.payment.create({
      data: {
        organizationId: fitzoneOrg.id,
        subscriptionId: sub.id,
        amount: vipPlan.price,
        currency: 'BDT',
        provider: 'BKASH',
        transactionId: `TXN-${Date.now()}`,
        status: 'PAID',
      },
    });
  }

  // 9. Create upcoming sessions
  const tomorrowMorning = new Date();
  tomorrowMorning.setDate(tomorrowMorning.getDate() + 1);
  tomorrowMorning.setHours(9, 0, 0, 0);

  const tomorrowEnd = new Date(tomorrowMorning);
  tomorrowEnd.setHours(10, 0, 0, 0);

  const session1 = await prisma.classSession.create({
    data: {
      organizationId: fitzoneOrg.id,
      branchId: branchMirpur.id,
      fitnessClassId: classYoga.id,
      startsAt: tomorrowMorning,
      endsAt: tomorrowEnd,
      capacity: classYoga.capacity,
      bookedCount: 1,
      status: 'SCHEDULED',
      trainers: trainerUser.trainer
        ? {
            create: {
              trainerId: trainerUser.trainer.id,
            },
          }
        : undefined,
    },
  });

  if (memberUser.member) {
    await prisma.classBooking.create({
      data: {
        organizationId: fitzoneOrg.id,
        sessionId: session1.id,
        memberId: memberUser.member.id,
        status: 'CONFIRMED',
      },
    });
  }

  console.log('Seeding completed successfully!');
  console.log('Demo Credentials:');
  console.log(' - Super Admin: admin@gymflow.com / Admin12345!');
  console.log(' - Gym Owner:   owner@fitzone.com / 123456');
  console.log(' - Trainer:     trainer@fitzone.com / 123456');
  console.log(' - Member:      member@fitzone.com / 123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
