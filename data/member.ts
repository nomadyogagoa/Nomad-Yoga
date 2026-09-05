export type ClassStatus = "Available" | "Booked" | "Full";
export type BookingStatus = "Upcoming" | "Completed" | "Cancelled";

export interface MemberProfile {
  name: string;
  firstName: string;
  initials: string;
  email: string;
  membership: string;
  membershipStatus: "Active" | "Paused";
  renewalDate: string;
  preferredClassTime: string;
  favoriteInstructor: string;
  notificationSummary: string;
}

export interface ClassSession {
  id: string;
  day: string;
  date: string;
  time: string;
  title: string;
  instructor: string;
  duration: string;
  type: string;
  status: ClassStatus;
  period: "Today" | "Week";
}

export interface Booking {
  id: string;
  date: string;
  time: string;
  className: string;
  instructor: string;
  status: BookingStatus;
}

export type NotificationCategory = "Classes" | "Bookings" | "Membership" | "Wellness";

export interface MemberNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionLabel?: string;
  href?: string;
}

export type ReminderPreferenceKey =
  | "classReminders"
  | "bookingConfirmations"
  | "scheduleChanges"
  | "membershipReminders"
  | "wellnessUpdates"
  | "weeklyProgressSummary";

export interface ReminderPreference {
  key: ReminderPreferenceKey;
  label: string;
  description: string;
  enabled: boolean;
}

export type NotificationChannelKey = "email" | "sms" | "whatsapp" | "push";

export interface NotificationChannel {
  key: NotificationChannelKey;
  label: string;
  description: string;
  enabled: boolean;
  available: boolean;
}

export const memberProfile: MemberProfile = {
  name: "Dev Mehta", firstName: "Dev", initials: "DM", email: "dev.mehta@example.com",
  membership: "Monthly Ritual", membershipStatus: "Active", renewalDate: "18 September 2026",
  preferredClassTime: "Early mornings", favoriteInstructor: "Ananya Sharma",
  notificationSummary: "Class reminders and schedule changes",
};

export const memberClasses: ClassSession[] = [
  { id: "morning-hatha", day: "Today", date: "4 Sep", time: "7:00 AM", title: "Morning Hatha", instructor: "Ananya Sharma", duration: "45 min", type: "Hatha", status: "Booked", period: "Today" },
  { id: "evening-meditation", day: "Friday", date: "4 Sep", time: "6:30 PM", title: "Meditation", instructor: "Rahul Verma", duration: "40 min", type: "Meditation", status: "Available", period: "Today" },
  { id: "vinyasa-flow", day: "Saturday", date: "5 Sep", time: "7:00 AM", title: "Vinyasa Flow", instructor: "Neha Kapoor", duration: "60 min", type: "Vinyasa", status: "Available", period: "Week" },
  { id: "mobility-breath", day: "Sunday", date: "6 Sep", time: "8:00 AM", title: "Mobility & Breath", instructor: "Ananya Sharma", duration: "50 min", type: "Mobility", status: "Full", period: "Week" },
  { id: "slow-flow", day: "Monday", date: "7 Sep", time: "6:00 PM", title: "Slow Flow Reset", instructor: "Ishita Rao", duration: "55 min", type: "Slow flow", status: "Available", period: "Week" },
  { id: "yin-restore", day: "Wednesday", date: "9 Sep", time: "7:30 PM", title: "Yin & Restore", instructor: "Neha Kapoor", duration: "60 min", type: "Yin", status: "Available", period: "Week" },
];

export const memberBookings: Booking[] = [
  { id: "booking-1", date: "Today · 4 Sep", time: "7:00 AM", className: "Morning Hatha", instructor: "Ananya Sharma", status: "Upcoming" },
  { id: "booking-2", date: "Saturday · 5 Sep", time: "7:00 AM", className: "Vinyasa Flow", instructor: "Neha Kapoor", status: "Upcoming" },
  { id: "booking-3", date: "2 Sep", time: "6:30 PM", className: "Meditation", instructor: "Rahul Verma", status: "Completed" },
  { id: "booking-4", date: "31 Aug", time: "8:00 AM", className: "Mobility & Breath", instructor: "Ananya Sharma", status: "Completed" },
  { id: "booking-5", date: "29 Aug", time: "6:00 PM", className: "Slow Flow Reset", instructor: "Ishita Rao", status: "Cancelled" },
];

export const weeklyProgress = {
  completedSessions: 4, targetSessions: 5, streakDays: 12, classesAttended: 28,
  minutesPracticed: 1_260, monthlySessions: 8,
  currentGoal: "Complete five mindful sessions each week",
};

export const practiceHistory = [
  { date: "2 Sep", title: "Meditation", duration: "40 min" },
  { date: "31 Aug", title: "Mobility & Breath", duration: "50 min" },
  { date: "28 Aug", title: "Morning Hatha", duration: "45 min" },
  { date: "26 Aug", title: "Vinyasa Flow", duration: "60 min" },
];

export const memberNotifications: MemberNotification[] = [
  { id: "class-reminder", category: "Classes", title: "Class reminder", message: "Morning Hatha starts in 30 minutes.", timestamp: "Today · 6:30 AM", isRead: false, actionLabel: "View class", href: "/classes" },
  { id: "booking-confirmed", category: "Bookings", title: "Booking confirmed", message: "Your Saturday Vinyasa session is confirmed.", timestamp: "Today · 8:15 AM", isRead: false, actionLabel: "View booking", href: "/bookings" },
  { id: "schedule-changed", category: "Classes", title: "Schedule changed", message: "Your meditation session has moved to 6:30 PM.", timestamp: "Yesterday", isRead: false, actionLabel: "View schedule", href: "/classes" },
  { id: "membership-renewal", category: "Membership", title: "Membership reminder", message: "Your monthly membership renews in 3 days.", timestamp: "Yesterday", isRead: true, actionLabel: "View membership", href: "/profile#membership" },
  { id: "weekly-goal", category: "Wellness", title: "Your weekly rhythm", message: "Your weekly practice goal is almost complete.", timestamp: "2 days ago", isRead: true, actionLabel: "See progress", href: "/progress" },
];

export const reminderPreferences: ReminderPreference[] = [
  { key: "classReminders", label: "Class reminders", description: "A gentle reminder before an upcoming class.", enabled: true },
  { key: "bookingConfirmations", label: "Booking confirmations", description: "Confirmation when a class is added to your schedule.", enabled: true },
  { key: "scheduleChanges", label: "Schedule changes", description: "Important changes to time, teacher, or location.", enabled: true },
  { key: "membershipReminders", label: "Membership reminders", description: "Renewal and membership status reminders.", enabled: true },
  { key: "wellnessUpdates", label: "Wellness updates", description: "Occasional practice notes from Nomad Yoga.", enabled: false },
  { key: "weeklyProgressSummary", label: "Weekly progress summary", description: "A weekly reflection on your practice rhythm.", enabled: true },
];

export const notificationChannels: NotificationChannel[] = [
  { key: "email", label: "Email", description: memberProfile.email, enabled: true, available: true },
  { key: "sms", label: "SMS", description: "Mobile message", enabled: false, available: true },
  { key: "whatsapp", label: "WhatsApp", description: "WhatsApp message", enabled: true, available: true },
  { key: "push", label: "Push", description: "Coming soon", enabled: false, available: false },
];

export const notificationCategories = ["All", "Classes", "Bookings", "Membership", "Wellness"] as const;
export const classReminderTimings = ["30 minutes before", "1 hour before", "2 hours before", "1 day before"] as const;
