import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { ClassesService } from './classes.service';

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Browse all active fitness classes' })
  async findAll(
    @Query('organizationId') orgId?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const list = await this.classesService.findAll(orgId, categoryId);
    return { success: true, data: list };
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get class categories' })
  async getCategories(@Query('organizationId') orgId?: string) {
    const categories = await this.classesService.getCategories(orgId);
    return { success: true, data: categories };
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @ApiBearerAuth()
  @Post('categories')
  @ApiOperation({ summary: 'Create class category' })
  async createCategory(
    @CurrentTenant() orgId: string,
    @Body() body: { name: string; description?: string },
  ) {
    const category = await this.classesService.createCategory(
      orgId,
      body.name,
      body.description,
    );
    return { success: true, message: 'Category created', data: category };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get fitness class details with upcoming sessions' })
  async findOne(@Param('id') id: string) {
    const item = await this.classesService.findOne(id);
    return { success: true, data: item };
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create new fitness class' })
  async create(
    @CurrentTenant() orgId: string,
    @Body()
    body: {
      name: string;
      description?: string;
      duration: number;
      capacity: number;
      level?: string;
      image?: string;
      categoryId?: string;
    },
  ) {
    const created = await this.classesService.create(orgId, body);
    return { success: true, message: 'Class created successfully', data: created };
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update fitness class' })
  async update(
    @Param('id') id: string,
    @CurrentTenant() orgId: string,
    @Body() body: any,
  ) {
    const updated = await this.classesService.update(id, orgId, body);
    return { success: true, message: 'Class updated', data: updated };
  }
}
