import Link from "next/link";
import { MemberShell } from "@/components/member/MemberShell";
import { Icon } from "@/components/ui/Icon";
import { MindfulRhythmCard } from "@/components/dashboard/MindfulRhythmCard";
import { memberClasses, memberProfile, weeklyProgress } from "@/data/member";

const upcomingClasses = memberClasses.slice(1, 4);
const quickActions = [
  { label: "Book Class", href: "/classes", icon: "plus" },
  { label: "My Schedule", href: "/bookings", icon: "calendar" },
  { label: "Membership", href: "/profile#membership", icon: "wallet" },
  { label: "Notifications", href: "/notifications", icon: "bell", badge: "3" },
] as const;

export default function DashboardPage() {
  const nextClass = memberClasses[0];
  const progressPercent = Math.round((weeklyProgress.completedSessions / weeklyProgress.targetSessions) * 100);

  return <MemberShell title={`Good morning, ${memberProfile.firstName}`} subtitle="A quiet moment to see what is ahead today.">
    <div className="member-dashboard-grid">
      <section className="member-next-practice" aria-labelledby="next-practice-title">
        <div><p className="member-kicker member-kicker-light">Your next practice</p><h2 id="next-practice-title">{nextClass.title}</h2><div className="member-practice-meta"><strong>{nextClass.time}</strong><span>{nextClass.duration}</span><span>Instructor: {nextClass.instructor}</span></div></div>
        <div className="member-practice-actions"><Link className="member-button member-button-light" href="/classes">View Class</Link><Link className="member-text-link member-text-link-light" href="/bookings">View Schedule <Icon name="arrow" size={16} /></Link></div>
      </section>

      <MindfulRhythmCard />

      <section className="member-progress-card" aria-labelledby="weekly-progress-title">
        <div className="member-section-heading"><div><p className="member-kicker">This week</p><h2 id="weekly-progress-title">Weekly progress</h2></div><span>{weeklyProgress.streakDays} day streak</span></div>
        <strong className="member-progress-score">{weeklyProgress.completedSessions} <small>/ {weeklyProgress.targetSessions} sessions</small></strong>
        <div className="member-progress-track" role="progressbar" aria-label="Weekly sessions completed" aria-valuemin={0} aria-valuemax={weeklyProgress.targetSessions} aria-valuenow={weeklyProgress.completedSessions}><span style={{ width: `${progressPercent}%` }} /></div>
        <p>One more practice completes your weekly intention.</p>
      </section>

      <section className="member-list-card member-upcoming-card" aria-labelledby="upcoming-title">
        <div className="member-section-heading"><div><p className="member-kicker">Coming up</p><h2 id="upcoming-title">Upcoming classes</h2></div><Link href="/classes">View all</Link></div>
        <div className="member-upcoming-list">{upcomingClasses.map((item) => <article key={item.id}><div><strong>{item.day}</strong><span>{item.date}</span></div><div><h3>{item.title}</h3><p>{item.instructor}</p></div><time>{item.time}</time></article>)}</div>
      </section>

      <section className="member-quick-card" aria-labelledby="quick-actions-title">
        <div className="member-section-heading"><div><p className="member-kicker">Shortcuts</p><h2 id="quick-actions-title">Quick actions</h2></div></div>
        <div className="member-quick-grid">{quickActions.map((action) => <Link key={action.label} href={action.href}><Icon name={action.icon} /><span>{action.label}</span>{"badge" in action ? <b aria-label={`${action.badge} unread`}>{action.badge}</b> : null}</Link>)}</div>
      </section>
    </div>
  </MemberShell>;
}
