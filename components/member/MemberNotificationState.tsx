"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { memberNotifications, type MemberNotification } from "@/data/member";

interface MemberNotificationState {
  notifications: MemberNotification[];
  unreadCount: number;
  markAllAsRead(): void;
  toggleRead(id: string): void;
}

const MemberNotificationContext = createContext<MemberNotificationState | null>(null);

export function MemberNotificationProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [notifications, setNotifications] = useState<MemberNotification[]>(memberNotifications);
  const markAllAsRead = useCallback(() => setNotifications((items) => items.map((item) => ({ ...item, isRead: true }))), []);
  const toggleRead = useCallback((id: string) => setNotifications((items) => items.map((item) => item.id === id ? { ...item, isRead: !item.isRead } : item)), []);
  const unreadCount = notifications.reduce((count, item) => count + Number(!item.isRead), 0);
  const value = useMemo(() => ({ notifications, unreadCount, markAllAsRead, toggleRead }), [markAllAsRead, notifications, toggleRead, unreadCount]);
  return <MemberNotificationContext.Provider value={value}>{children}</MemberNotificationContext.Provider>;
}

export function useMemberNotifications() {
  const context = useContext(MemberNotificationContext);
  if (!context) throw new Error("useMemberNotifications must be used within MemberNotificationProvider");
  return context;
}
