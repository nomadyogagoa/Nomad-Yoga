import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SettingsController } from './settings.controller';
import { MediaStorageService } from './media-storage.service';

@Module({ controllers: [AdminController, SettingsController], providers: [AdminService, MediaStorageService] })
export class AdminModule {}
