ALTER TABLE "ProgramSession"
  ADD CONSTRAINT "chk_program_session_capacity_positive" CHECK ("capacity" > 0),
  ADD CONSTRAINT "chk_program_session_end_after_start" CHECK ("endAt" > "startAt");

ALTER TABLE "PracticeSession"
  ADD CONSTRAINT "chk_practice_session_duration_nonnegative" CHECK ("durationMinutes" >= 0);

ALTER TABLE "RoomType"
  ADD CONSTRAINT "chk_room_type_capacity_positive" CHECK ("capacity" > 0),
  ADD CONSTRAINT "chk_room_type_base_price_nonnegative" CHECK ("basePrice" >= 0);

ALTER TABLE "HostelBooking"
  ADD CONSTRAINT "chk_hostel_booking_checkout_after_checkin" CHECK ("checkOutDate" > "checkInDate"),
  ADD CONSTRAINT "chk_hostel_booking_adults_positive" CHECK ("adults" > 0),
  ADD CONSTRAINT "chk_hostel_booking_children_nonnegative" CHECK ("children" >= 0),
  ADD CONSTRAINT "chk_hostel_booking_subtotal_nonnegative" CHECK ("subtotal" >= 0),
  ADD CONSTRAINT "chk_hostel_booking_tax_amount_nonnegative" CHECK ("taxAmount" >= 0),
  ADD CONSTRAINT "chk_hostel_booking_discount_amount_nonnegative" CHECK ("discountAmount" >= 0),
  ADD CONSTRAINT "chk_hostel_booking_total_amount_nonnegative" CHECK ("totalAmount" >= 0);

ALTER TABLE "HostelBookingUnit"
  ADD CONSTRAINT "chk_hostel_booking_unit_nights_positive" CHECK ("nights" > 0);

ALTER TABLE "RoomPriceRule"
  ADD CONSTRAINT "chk_room_price_rule_end_on_or_after_start" CHECK ("endsOn" >= "startsOn"),
  ADD CONSTRAINT "chk_room_price_rule_nightly_rate_nonnegative" CHECK ("nightlyRate" >= 0),
  ADD CONSTRAINT "chk_room_price_rule_min_nights_positive" CHECK ("minNights" IS NULL OR "minNights" > 0);

ALTER TABLE "Cart"
  ADD CONSTRAINT "chk_cart_user_or_session_present" CHECK ("userId" IS NOT NULL OR "sessionId" IS NOT NULL);

ALTER TABLE "CartItem"
  ADD CONSTRAINT "chk_cart_item_quantity_positive" CHECK ("quantity" > 0);

ALTER TABLE "Inventory"
  ADD CONSTRAINT "chk_inventory_quantity_on_hand_nonnegative" CHECK ("quantityOnHand" >= 0),
  ADD CONSTRAINT "chk_inventory_quantity_reserved_nonnegative" CHECK ("quantityReserved" >= 0);

ALTER TABLE "ProductVariant"
  ADD CONSTRAINT "chk_product_variant_price_nonnegative" CHECK ("price" >= 0);

ALTER TABLE "Order"
  ADD CONSTRAINT "chk_order_subtotal_nonnegative" CHECK ("subtotal" >= 0),
  ADD CONSTRAINT "chk_order_tax_amount_nonnegative" CHECK ("taxAmount" >= 0),
  ADD CONSTRAINT "chk_order_discount_amount_nonnegative" CHECK ("discountAmount" >= 0),
  ADD CONSTRAINT "chk_order_shipping_amount_nonnegative" CHECK ("shippingAmount" >= 0),
  ADD CONSTRAINT "chk_order_total_amount_nonnegative" CHECK ("totalAmount" >= 0);

ALTER TABLE "OrderItem"
  ADD CONSTRAINT "chk_order_item_quantity_positive" CHECK ("quantity" > 0),
  ADD CONSTRAINT "chk_order_item_unit_price_nonnegative" CHECK ("unitPrice" >= 0),
  ADD CONSTRAINT "chk_order_item_total_nonnegative" CHECK ("total" >= 0);

ALTER TABLE "Payment"
  ADD CONSTRAINT "chk_payment_amount_nonnegative" CHECK ("amount" >= 0);

ALTER TABLE "PaymentTransaction"
  ADD CONSTRAINT "chk_payment_transaction_amount_nonnegative" CHECK ("amount" >= 0);

ALTER TABLE "Refund"
  ADD CONSTRAINT "chk_refund_amount_nonnegative" CHECK ("amount" >= 0);

ALTER TABLE "MembershipPlan"
  ADD CONSTRAINT "chk_membership_plan_price_nonnegative" CHECK ("price" >= 0);

ALTER TABLE "Subscription"
  ADD CONSTRAINT "chk_subscription_end_after_start" CHECK ("endsAt" > "startsAt");
