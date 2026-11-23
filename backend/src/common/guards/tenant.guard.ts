import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return true; // public or unauthenticated

    // Check if user has platform-level SUPER_ADMIN role
    const isSuperAdmin = user.roles?.includes('SUPER_ADMIN');

    // Header hint: X-Organization-Id or body/param
    const headerOrgId =
      request.headers['x-organization-id'] ||
      request.query?.organizationId ||
      request.params?.organizationId ||
      request.body?.organizationId;

    const targetOrgId = headerOrgId || user.organizationId;

    if (!targetOrgId) {
      if (isSuperAdmin) return true;
      // If endpoint requires organization context
      return true;
    }

    if (!isSuperAdmin) {
      if (user.organizationId && user.organizationId !== targetOrgId) {
        throw new ForbiddenException(
          'Cross-tenant access forbidden. You cannot access another gym organization.',
        );
      }
    }

    request.organizationId = targetOrgId;
    return true;
  }
}
