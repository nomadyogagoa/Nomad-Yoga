import { Module } from '@nestjs/common'; import { EmailModule } from '../email/email.module';
import { NewsletterAdminController, NewsletterController } from './newsletter.controller'; import { NewsletterService } from './newsletter.service';

@Module({imports:[EmailModule],controllers:[NewsletterController,NewsletterAdminController],providers:[NewsletterService]})
export class NewsletterModule {}
