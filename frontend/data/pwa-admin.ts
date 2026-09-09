import {
  classReminderTimings,
  reminderPreferences,
  type NotificationChannelKey,
  type ReminderPreferenceKey,
} from "@/data/member";

export type InstallCooldown = "1 day" | "3 days" | "7 days" | "14 days";
export type InstallDelay = "Immediately" | "3 seconds" | "5 seconds" | "10 seconds";
export type ReminderTiming = (typeof classReminderTimings)[number];

export interface PWAConfigurationStatus { label: string; status: string; detail: string; }
export interface InstallPromotionSettings { enabled: boolean; desktop: boolean; android: boolean; iosGuidance: boolean; dismissalCooldown: InstallCooldown; displayDelay: InstallDelay; }
export interface UpdateExperienceSettings { showBanner: boolean; allowLater: boolean; foregroundChecks: boolean; }
export interface OfflineExperienceSettings { enabled: boolean; headline: string; message: string; showTryAgain: boolean; showGoHome: boolean; }
export interface AdminNotificationCategory { key: ReminderPreferenceKey; label: string; description: string; enabled: boolean; }
export interface DeliveryChannelStatus { key: NotificationChannelKey; label: string; status: string; available: false; }
export interface NotificationTemplatePreview { id: string; name: string; title: string; message: string; channels: readonly string[]; }
export interface AdminPWAConfiguration {
  installPromotion: InstallPromotionSettings;
  updates: UpdateExperienceSettings;
  offline: OfflineExperienceSettings;
  notificationCategories: Record<ReminderPreferenceKey, boolean>;
  defaultReminderTiming: ReminderTiming;
}

export const pwaConfigurationStatus: readonly PWAConfigurationStatus[] = [
  { label: "PWA", status: "Active", detail: "Application foundation" },
  { label: "Manifest", status: "Configured", detail: "Install metadata" },
  { label: "Service Worker", status: "Configured", detail: "Production registration" },
  { label: "Offline Fallback", status: "Enabled", detail: "Public fallback route" },
  { label: "App Updates", status: "User controlled", detail: "No forced reloads" },
  { label: "App Icons", status: "Configured", detail: "Install icon set" },
] as const;

export const installCooldownOptions: readonly InstallCooldown[] = ["1 day", "3 days", "7 days", "14 days"];
export const installDelayOptions: readonly InstallDelay[] = ["Immediately", "3 seconds", "5 seconds", "10 seconds"];

const adminCategoryLabels: Record<ReminderPreferenceKey, string> = {
  classReminders: "Classes",
  bookingConfirmations: "Bookings",
  scheduleChanges: "Schedule changes",
  membershipReminders: "Membership",
  wellnessUpdates: "Wellness",
  weeklyProgressSummary: "Weekly progress",
};

export const adminNotificationCategories: readonly AdminNotificationCategory[] = reminderPreferences.map((preference) => ({
  key: preference.key,
  label: adminCategoryLabels[preference.key],
  description: preference.description,
  enabled: preference.enabled,
}));

export const deliveryChannelStatuses: readonly DeliveryChannelStatus[] = [
  { key: "email", label: "Email", status: "Available after backend integration", available: false },
  { key: "sms", label: "SMS", status: "Provider not connected", available: false },
  { key: "whatsapp", label: "WhatsApp", status: "Provider not connected", available: false },
  { key: "push", label: "Web Push", status: "Not configured", available: false },
] as const;

export const notificationTemplatePreviews: readonly NotificationTemplatePreview[] = [
  { id: "class-reminder", name: "Class Reminder", title: "Morning Hatha starts soon", message: "Your class begins in 30 minutes with Ananya Sharma.", channels: ["Email", "WhatsApp"] },
  { id: "booking-confirmation", name: "Booking Confirmation", title: "Your place is reserved", message: "You are booked for Saturday Vinyasa Flow at 7:00 AM.", channels: ["Email", "SMS"] },
  { id: "schedule-changed", name: "Schedule Changed", title: "Your class time has changed", message: "Meditation will now begin at 6:30 PM. Your booking is still confirmed.", channels: ["Email", "WhatsApp"] },
  { id: "membership-renewal", name: "Membership Renewal", title: "Your practice continues soon", message: "Your Monthly Ritual membership renews in three days.", channels: ["Email"] },
] as const;

export const initialAdminPWAConfiguration: AdminPWAConfiguration = {
  installPromotion: { enabled: true, desktop: true, android: true, iosGuidance: true, dismissalCooldown: "7 days", displayDelay: "5 seconds" },
  updates: { showBanner: true, allowLater: true, foregroundChecks: true },
  offline: { enabled: true, headline: "You’re offline", message: "Reconnect to continue your Nomad Yoga journey.", showTryAgain: true, showGoHome: true },
  notificationCategories: Object.fromEntries(adminNotificationCategories.map((category) => [category.key, category.enabled])) as Record<ReminderPreferenceKey, boolean>,
  defaultReminderTiming: classReminderTimings[0],
};

export { classReminderTimings };
