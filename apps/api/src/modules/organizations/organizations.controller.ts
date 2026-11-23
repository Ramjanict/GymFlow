import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { OrganizationsService } from './organizations.service';

@ApiTags('Organizations')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
@Controller('organizations')
export class OrganizationsController {
  constructor(private orgsService: OrganizationsService) {}

  @Get()
  @ApiOperation({ summary: 'List all organizations (Super Admin or directory)' })
  async findAll() {
    const list = await this.orgsService.findAll();
    return { success: true, data: list };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization details by ID' })
  async findOne(@Param('id') id: string) {
    const org = await this.orgsService.findOne(id);
    return { success: true, data: org };
  }

  @Post()
  @ApiOperation({ summary: 'Register a new gym organization' })
  async create(
    @Body() body: { name: string; email: string; phone?: string; logo?: string },
  ) {
    const created = await this.orgsService.create(body);
    return { success: true, message: 'Organization created', data: created };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update organization details' })
  async update(@Param('id') id: string, @Body() body: any) {
    const updated = await this.orgsService.update(id, body);
    return { success: true, message: 'Organization updated', data: updated };
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'List staff and trainers of this gym' })
  async getMembers(@Param('id') id: string) {
    const staff = await this.orgsService.getStaff(id);
    return { success: true, data: staff };
  }
}
