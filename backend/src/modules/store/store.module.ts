import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { PaymentsModule } from '../payments/payments.module';
import { AdminStoreController, StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({ imports:[EmailModule, PaymentsModule], controllers:[StoreController,AdminStoreController], providers:[StoreService] })
export class StoreModule {}
