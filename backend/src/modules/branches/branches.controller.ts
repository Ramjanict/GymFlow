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
import { BranchesService } from './branches.service';

@ApiTags('Branches')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
@Controller('branches')
export class BranchesController {
  constructor(private branchesService: BranchesService) {}

  @Get()
  @ApiOperation({ summary: 'List all branches for current organization' })
  async findAll(@CurrentTenant() orgId: string) {
    const list = await this.branchesService.findByOrganization(orgId);
    return { success: true, data: list };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get branch details with rooms and staff' })
  async findOne(@Param('id') id: string, @CurrentTenant() orgId: string) {
    const branch = await this.branchesService.findOne(id, orgId);
    return { success: true, data: branch };
  }

  @Post()
  @ApiOperation({ summary: 'Create new branch location' })
  async create(
    @CurrentTenant() orgId: string,
    @Body()
    body: {
      name: string;
      address: string;
      city: string;
      timezone?: string;
    },
  ) {
    const branch = await this.branchesService.create(orgId, body);
    return { success: true, message: 'Branch created successfully', data: branch };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update branch information' })
  async update(
    @Param('id') id: string,
    @CurrentTenant() orgId: string,
    @Body() body: any,
  ) {
    const updated = await this.branchesService.update(id, orgId, body);
    return { success: true, message: 'Branch updated successfully', data: updated };
  }

  @Post(':id/rooms')
  @ApiOperation({ summary: 'Add a studio room to this branch' })
  async addRoom(
    @Param('id') branchId: string,
    @Body() body: { name: string; capacity: number },
  ) {
    const room = await this.branchesService.addRoom(branchId, body.name, body.capacity);
    return { success: true, message: 'Room added', data: room };
  }

  @Post(':id/trainers')
  @ApiOperation({ summary: 'Assign a trainer to this branch' })
  async assignTrainer(
    @Param('id') branchId: string,
    @Body('trainerId') trainerId: string,
  ) {
    const assigned = await this.branchesService.assignTrainer(branchId, trainerId);
    return { success: true, message: 'Trainer assigned to branch', data: assigned };
  }
}
