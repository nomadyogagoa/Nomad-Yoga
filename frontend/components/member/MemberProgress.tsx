"use client";

import { useEffect, useState } from "react";
import { getPracticeProgress, type PracticeProgress } from "@/lib/course-booking-api";
import { Icon } from "@/components/ui/Icon";

export function MemberProgress() {
  const [progress, setProgress] = useState<PracticeProgress | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => { void getPracticeProgress().then(setProgress).catch(() => setError(true)); }, []);
  if (!progress && !error) return <p className="member-list-card" aria-live="polite">Loading your practice progress…</p>;
  if (error || !progress) return <p className="auth-message is-error" role="alert">We couldn’t load your practice progress. Please refresh and try again.</p>;
  const history = progress.recentPractice;
  return <>
    <section className="member-stat-grid" aria-label="Practice totals">
      {([{ label: "Sessions completed", value: progress.sessionsCompleted, icon: "check" }, { label: "Minutes practiced", value: progress.totalPracticeMinutes.toLocaleString("en-IN"), icon: "clock" }, { label: "Current streak", value: `${progress.currentStreak} days`, icon: "sparkles" }, { label: "Minutes this month", value: progress.currentMonthMinutes, icon: "calendar" }] as const).map((stat) => <article key={stat.label}><span><Icon name={stat.icon} /></span><strong>{stat.value}</strong><p>{stat.label}</p></article>)}
    </section>
    <div className="member-progress-layout">
      <section className="member-progress-card" aria-labelledby="goal-title"><p className="member-kicker">Practice totals</p><h2 id="goal-title">Your mindful hours</h2><strong className="member-progress-score">{progress.totalMindfulHours} <small>hours practiced</small></strong><p>{progress.currentWeekMinutes} minutes in the past 7 days · longest streak {progress.longestStreak} days</p></section>
      <section className="member-list-card" aria-labelledby="history-title"><div className="member-section-heading"><div><p className="member-kicker">Recent rhythm</p><h2 id="history-title">Practice history</h2></div></div><div className="member-history-list">{history.length ? history.map((item) => <article key={item.id}><time>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(item.startedAt))}</time><strong>{item.activityType.replace("_", " ")}</strong><span>{item.durationMinutes} min</span></article>) : <p className="member-empty-copy">Attendance will appear here after a class is marked attended.</p>}</div></section>
    </div>
  </>;
}
