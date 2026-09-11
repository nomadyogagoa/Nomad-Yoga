import { Module } from '@nestjs/common';
import { ContactAdminController, ContactController } from './contact.controller'; import { ContactService } from './contact.service'; import { EmailModule } from '../email/email.module';

@Module({imports:[EmailModule],controllers:[ContactController,ContactAdminController],providers:[ContactService]})
export class ContactModule {}
