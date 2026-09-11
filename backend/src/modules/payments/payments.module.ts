import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { CashfreeGateway } from './gateways/cashfree.gateway';
import { StripeGateway } from './gateways/stripe.gateway';
import { AdminPaymentsController, PaymentsController, PaymentWebhooksController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({ imports:[EmailModule], controllers: [PaymentsController, PaymentWebhooksController, AdminPaymentsController], providers: [PaymentsService, CashfreeGateway, StripeGateway], exports:[PaymentsService] })
export class PaymentsModule {}
