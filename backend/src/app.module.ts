import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { ContactModule } from './modules/contact/contact.module';
import { ContentModule } from './modules/content/content.module';
import { HostelModule } from './modules/hostel/hostel.module';
import { InstructorsModule } from './modules/instructors/instructors.module';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PracticeModule } from './modules/practice/practice.module';
import { ProgramsModule } from './modules/programs/programs.module';
import { StoreModule } from './modules/store/store.module';
import { UsersModule } from './modules/users/users.module';
import { validateEnvironment } from './config/environment.validation';
import { PrismaModule } from './database/prisma.module';
import { HealthModule } from './health/health.module';
import { AuditModule } from './common/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, validate: validateEnvironment }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]), AuditModule,
    PrismaModule, HealthModule, AuthModule, UsersModule, InstructorsModule, ProgramsModule, PracticeModule,
    HostelModule, StoreModule, PaymentsModule, BlogModule, NewsletterModule, ContactModule, NotificationsModule,
    MembershipsModule, ContentModule, AdminModule,
  ],
})
export class AppModule {}
