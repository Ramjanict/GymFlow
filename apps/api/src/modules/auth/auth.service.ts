import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    let orgId = dto.organizationId;
    if (!orgId && dto.organizationName) {
      const slug = dto.organizationName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      const org = await this.prisma.organization.create({
        data: {
          name: dto.organizationName,
          slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
          email: dto.email.toLowerCase(),
          status: 'ACTIVE',
        },
      });
      orgId = org.id;
    }

    const roleName = dto.role || (dto.organizationName ? 'GYM_OWNER' : 'MEMBER');

    // Find or create role
    let role = await this.prisma.role.findFirst({
      where: {
        name: roleName,
        organizationId: orgId || null,
      },
    });

    if (!role) {
      role = await this.prisma.role.findFirst({
        where: { name: roleName },
      });
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        organizationId: orgId,
        status: 'ACTIVE',
        ...(role
          ? {
              userRoles: {
                create: {
                  roleId: role.id,
                },
              },
            }
          : {}),
        ...(roleName === 'MEMBER'
          ? {
              member: {
                create: {},
              },
            }
          : {}),
        ...(roleName === 'TRAINER'
          ? {
              trainer: {
                create: {
                  specialties: ['General Fitness'],
                },
              },
            }
          : {}),
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        trainer: true,
        member: true,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, orgId);
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organizationId: user.organizationId,
        roles: user.userRoles.map((ur) => ur.role.name),
      },
      tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
        organization: true,
        trainer: true,
        member: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === 'BLOCKED' || user.status === 'INACTIVE') {
      throw new UnauthorizedException('Account suspended or inactive');
    }

    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissions = Array.from(
      new Set(
        user.userRoles.flatMap((ur) =>
          ur.role.rolePermissions.map((rp) => rp.permission.key),
        ),
      ),
    );

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.organizationId,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        organizationId: user.organizationId,
        organizationName: user.organization?.name,
        roles,
        permissions,
        trainerId: user.trainer?.id,
        memberId: user.member?.id,
      },
      tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret:
          process.env.JWT_REFRESH_SECRET ||
          'gymflow_enterprise_refresh_jwt_secret_token_2026',
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        userId: payload.sub,
        revokedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Session expired or revoked');
    }

    // Revoke old token and rotate
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.generateTokens(user.id, user.email, user.organizationId);
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { success: true, message: 'Logged out successfully' };
  }

  private async generateTokens(
    userId: string,
    email: string,
    organizationId?: string | null,
  ) {
    const payload = { sub: userId, email, organizationId };

    const accessToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_SECRET ||
        'gymflow_enterprise_access_jwt_secret_token_2026',
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_REFRESH_SECRET ||
        'gymflow_enterprise_refresh_jwt_secret_token_2026',
      expiresIn: '7d',
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const tokenHash = await bcrypt.hash(refreshToken, 8);
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    };
  }
}
