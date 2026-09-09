# PostgreSQL constraints for the initial migration

These constraints are documented for a future, approved initial migration only. No migration or database command has been run.

- `ProgramSession.capacity > 0` and `endAt > startAt`.
- `PracticeSession.durationMinutes >= 0`.
- Hostel: `RoomType.capacity > 0`, non-negative prices; `HostelBooking.checkOutDate > checkInDate`, `adults > 0`, `children >= 0`, non-negative money; `HostelBookingUnit.nights > 0`; and `RoomPriceRule.endsOn >= startsOn`, non-negative rates, and a positive supplied `minNights`.
- Store: cart and order quantities must be positive; inventory quantities must be non-negative; product, variant, order, and order-item money must be non-negative.
- Cart: `userId IS NOT NULL OR sessionId IS NOT NULL`.
- Payments and memberships: monetary amounts must be non-negative, `Subscription.endsAt > startsAt`, and a partial unique index should limit each user to one active subscription once statuses are finalized.
