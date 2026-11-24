import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ramjan',
      api_key: process.env.CLOUDINARY_API_KEY || '839226347835865',
      api_secret: process.env.CLOUDINARY_API_SECRET || '',
    });
  }

  async uploadBase64(base64Data: string, folder: string = 'gymflow') {
    try {
      const uploadOptions: Record<string, any> = {
        folder,
      };
      if (process.env.CLOUDINARY_UPLOAD_PRESET) {
        uploadOptions.upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET;
      }
      const result = await cloudinary.uploader.upload(base64Data, uploadOptions);
      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
      };
    } catch (error: any) {
      // Fallback: If cloudinary fails, return the base64 or placeholder
      return {
        url: base64Data.startsWith('data:')
          ? base64Data
          : `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop`,
        publicId: 'local-fallback',
      };
    }
  }
}
