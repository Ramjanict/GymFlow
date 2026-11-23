import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UploadService } from './upload.service';

@ApiTags('Upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  @ApiOperation({ summary: 'Upload image to Cloudinary' })
  async uploadImage(
    @Body('file') file: string,
    @Body('folder') folder?: string,
  ) {
    const uploaded = await this.uploadService.uploadBase64(file, folder);
    return { success: true, message: 'Image uploaded successfully', data: uploaded };
  }
}
