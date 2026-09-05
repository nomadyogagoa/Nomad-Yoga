import Link from "next/link";
import { MemberShell } from "@/components/member/MemberShell";
import { Icon } from "@/components/ui/Icon";
import { memberProfile } from "@/data/member";

const profileDetails = [
  { label: "Preferred class time", value: memberProfile.preferredClassTime, icon: "clock", id: undefined },
  { label: "Favorite instructor", value: memberProfile.favoriteInstructor, icon: "heart", id: undefined },
  { label: "Notification preferences", value: memberProfile.notificationSummary, icon: "bell", id: "notifications" },
] as const;

export default function ProfilePage() {
  return <MemberShell title="Profile" subtitle="Your membership and practice preferences."><div className="member-profile-grid">
    <section className="member-profile-card" aria-labelledby="profile-name"><div className="member-profile-identity"><span>{memberProfile.initials}</span><div><p className="member-kicker">Member profile</p><h2 id="profile-name">{memberProfile.name}</h2><p>{memberProfile.email}</p></div></div><button className="member-button member-button-outline" type="button">Edit Profile</button></section>
    <section className="member-membership-card" id="membership" aria-labelledby="membership-title"><div className="member-section-heading"><div><p className="member-kicker member-kicker-light">Membership</p><h2 id="membership-title">{memberProfile.membership}</h2></div><span>{memberProfile.membershipStatus}</span></div><p>Renews {memberProfile.renewalDate}</p><button className="member-button member-button-light" type="button">Manage Membership</button></section>
    <section className="member-list-card member-preferences" aria-labelledby="preferences-title"><div className="member-section-heading"><div><p className="member-kicker">Your practice</p><h2 id="preferences-title">Preferences</h2></div></div>{profileDetails.map((detail) => <article key={detail.label} id={detail.id}><span><Icon name={detail.icon} /></span><div><p>{detail.label}</p><strong>{detail.value}</strong></div></article>)}<Link className="member-button member-button-outline" href="/profile/notifications">Notification Settings</Link></section>
  </div></MemberShell>;
}
