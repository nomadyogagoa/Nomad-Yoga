import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { emailTemplate } from './email.templates';
import { EmailKind, EmailPayload, EmailSendResult } from './email.types';
import { ResendEmailProvider, SmtpEmailProvider } from './providers';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  constructor(private c: ConfigService, private resend: ResendEmailProvider, private smtp: SmtpEmailProvider) {}
  private provider() { const value = this.c.get<string>('EMAIL_PROVIDER') ?? 'resend'; if (value === 'resend') return this.resend; if (value === 'smtp') return this.smtp; throw new ServiceUnavailableException({ code: 'INVALID_EMAIL_PROVIDER', message: 'Email provider is invalid.' }); }
  status() { try { const p = this.provider(); return { provider: p.name, configured: p.configured() }; } catch { return { provider: this.c.get<string>('EMAIL_PROVIDER') ?? 'resend', configured: false }; } }
  async send(kind: EmailKind, to: string, values: Record<string, unknown> = {}, metadata?: Record<string, string>): Promise<EmailSendResult | undefined> { const template = emailTemplate(kind, values); const payload: EmailPayload = { to, kind, ...template, replyTo: this.c.get<string>('EMAIL_REPLY_TO') || undefined, metadata }; const provider = this.provider(); if (!provider.configured()) { if (this.c.get<string>('NODE_ENV') === 'development' && (kind === 'verification' || kind === 'password-reset')) { this.logger.log(`Email ${kind} URL for local testing: ${String(values.url)}`); return undefined; } throw new ServiceUnavailableException({ code: 'EMAIL_PROVIDER_NOT_CONFIGURED', message: 'Email delivery is not configured.' }); } try { const result = await provider.send(payload); this.logger.log(`Email delivered provider=${result.provider} type=${kind}${result.messageId ? ` messageId=${result.messageId}` : ''}`); return result; } catch { this.logger.warn(`Email delivery failed provider=${provider.name} type=${kind}`); throw new ServiceUnavailableException({ code: 'EMAIL_DELIVERY_FAILED', message: 'Email delivery failed.' }); } }
  async sendNonBlocking(kind: EmailKind, to: string | null | undefined, values: Record<string, unknown> = {}, metadata?: Record<string, string>) { if (!to) { this.logger.warn(`Transactional email skipped type=${kind}: no recipient`); return undefined; } try { return await this.send(kind, to, values, metadata); } catch { this.logger.warn(`Transactional email skipped type=${kind}${metadata?.entityId ? ` entityId=${metadata.entityId}` : ''}`); return undefined; } }
  async sendEmailVerification(email: string, url: string) { await this.send('verification', email, { url }); }
  async sendPasswordReset(email: string, url: string) { await this.send('password-reset', email, { url }); }
  sendWelcomeEmail(email: string, firstName?: string) { return this.send('welcome', email, { firstName }); }
  sendBookingEmail(kind: 'hostel-booking-created' | 'hostel-booking-confirmed' | 'hostel-booking-cancelled', email: string, bookingNumber: string) { return this.send(kind, email, { bookingNumber }); }
  sendOrderEmail(kind: 'order-created' | 'order-confirmed' | 'order-shipped' | 'order-cancelled', email: string, orderNumber: string, amount?: string) { return this.send(kind, email, { orderNumber, amount }); }
  sendCourseEmail(kind: 'course-confirmed' | 'course-cancelled', email: string) { return this.send(kind, email); }
  sendPaymentEmail(kind: 'payment-captured' | 'payment-failed' | 'refund-processed', email: string, amount: string) { return this.send(kind, email, { amount }); }
  sendContactAcknowledgement(email: string, firstName: string) { return this.send('contact-acknowledgement', email, { firstName }); }
  sendNewsletterEmail(email: string, subject: string, content: string) { return this.send('newsletter', email, { subject, content }); }
  sendTest(email: string) { return this.send('test', email).then(() => ({ sent: true })); }
}
