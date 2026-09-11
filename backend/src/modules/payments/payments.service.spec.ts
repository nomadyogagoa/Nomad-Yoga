import { PaymentPurpose, PaymentStatus, Prisma } from '@prisma/client';
import { PaymentsService } from './payments.service';

describe('PaymentsService transactional email hooks', () => {
  const prisma: any = {
    paymentWebhookEvent: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    payment: { findUnique: jest.fn(), update: jest.fn() },
    hostelBooking: { findUnique: jest.fn(), update: jest.fn() },
    order: { findUnique: jest.fn(), update: jest.fn() },
    paymentTransaction: { create: jest.fn() },
    $transaction: jest.fn((fn: any) => fn(prisma)),
  };
  const email = { sendNonBlocking: jest.fn() };
  const service = new PaymentsService(prisma, { get: jest.fn() } as any, {} as any, {} as any, { record: jest.fn() } as any, email as any);

  beforeEach(() => jest.clearAllMocks());

  it('sends payment and hostel confirmation emails once after a captured webhook commits', async () => {
    prisma.paymentWebhookEvent.findUnique.mockResolvedValue(null);
    prisma.paymentWebhookEvent.create.mockResolvedValue({ id: 'event' });
    prisma.payment.findUnique.mockResolvedValue({ id: 'payment', status: PaymentStatus.PENDING, purpose: PaymentPurpose.HOSTEL_BOOKING, relatedEntityId: 'booking', amount: new Prisma.Decimal('100'), user: { email: 'owner@example.com' } });
    prisma.hostelBooking.findUnique.mockResolvedValue({ id: 'booking', status: 'PENDING' });
    prisma.hostelBooking.update.mockResolvedValue({ id: 'booking', bookingNumber: 'HY-1', contactEmail: 'booking@example.com' });
    await service.processWebhook('stripe', { eventId: 'event', paymentReference: 'reference', status: PaymentStatus.CAPTURED, transactionId: 'txn', metadata: {} });
    expect(email.sendNonBlocking).toHaveBeenCalledWith('hostel-booking-confirmed', 'booking@example.com', { bookingNumber: 'HY-1' }, { entityId: 'booking' });
    expect(email.sendNonBlocking).toHaveBeenCalledWith('payment-captured', 'owner@example.com', { amount: '100' }, { entityId: 'payment' });
  });

  it('does not send for a duplicate provider event', async () => {
    prisma.paymentWebhookEvent.findUnique.mockResolvedValue({ id: 'event' });
    await service.processWebhook('stripe', { eventId: 'event', paymentReference: 'reference', status: PaymentStatus.CAPTURED, metadata: {} });
    expect(email.sendNonBlocking).not.toHaveBeenCalled();
  });
});
