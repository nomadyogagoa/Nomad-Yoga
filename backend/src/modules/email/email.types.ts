export type EmailKind = 'verification' | 'password-reset' | 'welcome' | 'hostel-booking-created' | 'hostel-booking-confirmed' | 'hostel-booking-cancelled' | 'order-created' | 'order-confirmed' | 'order-shipped' | 'order-cancelled' | 'course-confirmed' | 'course-cancelled' | 'payment-captured' | 'payment-failed' | 'refund-processed' | 'contact-acknowledgement' | 'contact-admin' | 'newsletter' | 'test';
export interface EmailPayload { to: string; subject: string; html: string; text: string; replyTo?: string; metadata?: Record<string, string>; kind: EmailKind; }
export interface EmailSendResult { messageId?: string; provider: 'resend' | 'smtp'; }
export interface EmailProvider { readonly name: 'resend' | 'smtp'; configured(): boolean; send(payload: EmailPayload): Promise<EmailSendResult>; }
