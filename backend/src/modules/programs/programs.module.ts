import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { ProgramsAdminController, ProgramsController } from './programs.controller';
import { PracticeService } from './practice.service';
import { ProgramsService } from './programs.service';

@Module({imports:[EmailModule],controllers:[ProgramsController,ProgramsAdminController],providers:[ProgramsService,PracticeService]})
export class ProgramsModule {}
