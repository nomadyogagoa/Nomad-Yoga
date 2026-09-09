"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useMemberNotifications } from "@/components/member/MemberNotificationState";
import { notificationCategories, type NotificationCategory } from "@/data/member";

type NotificationFilter = "All" | NotificationCategory;

export function NotificationCenter() {
  const [filter, setFilter] = useState<NotificationFilter>("All");
  const { notifications, unreadCount, markAllAsRead, toggleRead } = useMemberNotifications();
  const visibleNotifications = filter === "All" ? notifications : notifications.filter((item) => item.category === filter);

  return <>
    <section className="notification-summary" aria-labelledby="notification-summary-title">
      <div><p className="member-kicker member-kicker-light">Your inbox</p><h2 id="notification-summary-title">{unreadCount ? `${unreadCount} unread` : "You’re all caught up"}</h2><p>Class, booking, and membership updates appear here.</p></div>
      <button type="button" className="member-button member-button-light" onClick={markAllAsRead} disabled={unreadCount === 0}>Mark all as read</button>
    </section>

    <div className="notification-filters" role="tablist" aria-label="Notification categories">
      {notificationCategories.map((category) => <button key={category} id={`notification-tab-${category.toLowerCase()}`} type="button" role="tab" aria-selected={filter === category} aria-controls="notification-panel" className={filter === category ? "active" : undefined} onClick={() => setFilter(category)}>{category}</button>)}
    </div>

    <section className="notification-inbox" id="notification-panel" role="tabpanel" aria-labelledby={`notification-tab-${filter.toLowerCase()}`}>
      <div className="member-section-heading"><div><p className="member-kicker">Latest</p><h2 id="notification-list-title">{filter === "All" ? "All notifications" : filter}</h2></div><span>{visibleNotifications.length}</span></div>
      {visibleNotifications.length ? <ol className="notification-list">{visibleNotifications.map((notification) => <li key={notification.id} className={notification.isRead ? "is-read" : "is-unread"}>
        <span className="notification-state" aria-label={notification.isRead ? "Read" : "Unread"} />
        <div className="notification-copy"><span>{notification.category} · {notification.timestamp}</span><h3>{notification.title}</h3><p>{notification.message}</p><div>{notification.href && notification.actionLabel ? <Link href={notification.href}>{notification.actionLabel} <Icon name="arrow" size={15} /></Link> : null}<button type="button" onClick={() => toggleRead(notification.id)}>{notification.isRead ? "Mark unread" : "Mark read"}</button></div></div>
      </li>)}</ol> : <div className="notification-empty"><span><Icon name="check" size={24} /></span><h3>You’re all caught up.</h3><p>There are no {filter.toLowerCase()} notifications right now.</p></div>}
    </section>
  </>;
}
