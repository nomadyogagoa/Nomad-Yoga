import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

export type UploadResource = 'image' | 'video';
export interface StoredMedia { provider: 'CLOUDINARY'; publicId: string; url: string; resourceType: 'IMAGE' | 'VIDEO'; format?: string; width?: number; height?: number; bytes?: number; mimeType: string; }

@Injectable()
export class MediaStorageService {
  private configured = false;
  constructor(private readonly config: ConfigService) {
    const cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.config.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.config.get<string>('CLOUDINARY_API_SECRET');
    if (cloudName && apiKey && apiSecret) { cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true }); this.configured = true; }
  }
  private ensureConfigured() { if (!this.configured) throw new ServiceUnavailableException({ code: 'MEDIA_PROVIDER_NOT_CONFIGURED', message: 'Media upload is not configured.' }); }
  async upload(buffer: Buffer, resource: UploadResource, mimeType: string, context?: string): Promise<StoredMedia> {
    this.ensureConfigured();
    const folder = `${this.config.get<string>('CLOUDINARY_FOLDER') || 'nomad-yoga'}/${context === 'blog' || context === 'newsletter' ? context : 'media'}`;
    const response = await new Promise<UploadApiResponse>((resolve, reject) => { const stream = cloudinary.uploader.upload_stream({ resource_type: resource, folder, use_filename: false, unique_filename: true, overwrite: false }, (error, result) => error || !result ? reject(error ?? new Error('Upload failed')) : resolve(result)); stream.end(buffer); });
    return { provider: 'CLOUDINARY', publicId: response.public_id, url: response.secure_url, resourceType: resource === 'video' ? 'VIDEO' : 'IMAGE', format: response.format, width: response.width, height: response.height, bytes: response.bytes, mimeType };
  }
  async remove(publicId: string, resourceType: 'IMAGE' | 'VIDEO') { this.ensureConfigured(); try { await cloudinary.uploader.destroy(publicId, { resource_type: resourceType === 'VIDEO' ? 'video' : 'image' }); } catch { throw new ServiceUnavailableException({ code: 'MEDIA_PROVIDER_DELETE_FAILED', message: 'Media provider operation failed.' }); } }
}
