import { apiRequest } from "@/lib/api-client";

export type CourseSession = {
  id: string;
  title: string;
  sessionDate: string;
  startAt: string;
  endAt: string;
  timezone: string;
  level: "BEGINNER" | "ALL_LEVELS" | "INTERMEDIATE" | "ADVANCED";
  capacity: number;
  availableSlots: number;
  location: string | null;
  program: { id: string; title: string; slug: string };
  instructor: { id: string; displayName: string; slug: string } | null;
};

export type CourseBookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "ATTENDED" | "NO_SHOW";

export type CourseBooking = {
  id: string;
  status: CourseBookingStatus;
  cancelledAt: string | null;
  attendedAt: string | null;
  createdAt: string;
  programSession: CourseSession;
};

export type PageResult<T> = { items: T[]; pagination: { page: number; limit: number; total: number; totalPages: number } };

export type PracticeProgress = {
  totalPracticeMinutes: number;
  totalMindfulHours: number;
  sessionsCompleted: number;
  currentWeekMinutes: number;
  currentMonthMinutes: number;
  currentStreak: number;
  longestStreak: number;
  recentPractice: { id: string; activityType: string; startedAt: string; durationMinutes: number }[];
};

export function getCourseSessions() {
  return apiRequest<PageResult<CourseSession>>("/sessions?limit=100", {}, false);
}

export function getCourseBookings() {
  return apiRequest<PageResult<CourseBooking>>("/course-bookings?limit=100");
}

export function createCourseBooking(programSessionId: string) {
  return apiRequest<CourseBooking>("/course-bookings", { method: "POST", body: JSON.stringify({ programSessionId }) });
}

export function cancelCourseBooking(id: string) {
  return apiRequest<CourseBooking>(`/course-bookings/${encodeURIComponent(id)}/cancel`, { method: "POST", body: JSON.stringify({}) });
}

export function getPracticeProgress() {
  return apiRequest<PracticeProgress>("/users/me/progress");
}

export function sessionDateLabel(session: CourseSession): string {
  return new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: session.timezone || "Asia/Kolkata" }).format(new Date(session.startAt));
}

export function sessionTimeLabel(session: CourseSession): string {
  const format = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", timeZone: session.timezone || "Asia/Kolkata" });
  return `${format.format(new Date(session.startAt))} – ${format.format(new Date(session.endAt))}`;
}
