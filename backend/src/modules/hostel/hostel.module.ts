import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { HostelAdminController, HostelController } from './hostel.controller';
import { HostelService } from './hostel.service';

@Module({ imports: [EmailModule], controllers: [HostelController, HostelAdminController], providers: [HostelService] })
export class HostelModule {}
