import { MemberShell } from "@/components/member/MemberShell";
import { Icon } from "@/components/ui/Icon";
import { practiceHistory, weeklyProgress } from "@/data/member";

const progressStats = [
  { label: "Classes attended", value: weeklyProgress.classesAttended, icon: "check" },
  { label: "Minutes practiced", value: weeklyProgress.minutesPracticed.toLocaleString("en-IN"), icon: "clock" },
  { label: "Weekly streak", value: `${weeklyProgress.streakDays} days`, icon: "sparkles" },
  { label: "Sessions this month", value: weeklyProgress.monthlySessions, icon: "calendar" },
] as const;

export default function ProgressPage() {
  const progressPercent = Math.round((weeklyProgress.completedSessions / weeklyProgress.targetSessions) * 100);
  return <MemberShell title="Your progress" subtitle="Small, consistent returns become a lasting practice.">
    <section className="member-stat-grid" aria-label="Practice totals">{progressStats.map((stat) => <article key={stat.label}><span><Icon name={stat.icon} /></span><strong>{stat.value}</strong><p>{stat.label}</p></article>)}</section>
    <div className="member-progress-layout">
      <section className="member-progress-card" aria-labelledby="goal-title"><p className="member-kicker">Current goal</p><h2 id="goal-title">{weeklyProgress.currentGoal}</h2><strong className="member-progress-score">{weeklyProgress.completedSessions} <small>/ {weeklyProgress.targetSessions} this week</small></strong><div className="member-progress-track" role="progressbar" aria-label="Current weekly goal" aria-valuemin={0} aria-valuemax={weeklyProgress.targetSessions} aria-valuenow={weeklyProgress.completedSessions}><span style={{ width: `${progressPercent}%` }} /></div></section>
      <section className="member-list-card" aria-labelledby="history-title"><div className="member-section-heading"><div><p className="member-kicker">Recent rhythm</p><h2 id="history-title">Practice history</h2></div></div><div className="member-history-list">{practiceHistory.map((item) => <article key={`${item.date}-${item.title}`}><time>{item.date}</time><strong>{item.title}</strong><span>{item.duration}</span></article>)}</div></section>
    </div>
  </MemberShell>;
}
