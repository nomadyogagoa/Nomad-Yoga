import { Controller, Get, Version } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { AdminService } from './admin.service';
@Controller('settings') @Public()
export class SettingsController { constructor(private readonly admin: AdminService) {} @Get('public') @Version('1') publicSettings() { return this.admin.publicSettings(); } }
