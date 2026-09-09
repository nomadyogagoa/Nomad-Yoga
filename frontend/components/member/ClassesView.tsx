"use client";

import { useState } from "react";
import type { ClassSession } from "@/data/member";

const filters = ["Today", "Week", "All"] as const;
type ClassFilter = (typeof filters)[number];

export function ClassesView({ classes }: { classes: ClassSession[] }) {
  const [filter, setFilter] = useState<ClassFilter>("Today");
  const visibleClasses = filter === "All" ? classes : classes.filter((item) => item.period === filter);
  return <>
    <div className="member-filter" role="group" aria-label="Filter classes">
      {filters.map((item) => <button key={item} type="button" className={filter === item ? "active" : undefined} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}
    </div>
    <section className="member-list-card" aria-labelledby="class-list-title">
      <div className="member-section-heading"><div><p className="member-kicker">Find your rhythm</p><h2 id="class-list-title">{filter === "All" ? "All classes" : `${filter}'s classes`}</h2></div><span>{visibleClasses.length} sessions</span></div>
      <div className="member-class-list">{visibleClasses.map((item) => <article key={item.id} className="member-class-row">
        <div className="member-date-tile"><strong>{item.date.split(" ")[0]}</strong><span>{item.date.split(" ")[1] ?? ""}</span></div>
        <div className="member-class-copy"><span>{item.day} · {item.time}</span><h3>{item.title}</h3><p>{item.instructor} · {item.duration} · {item.type}</p></div>
        <span className={`member-status status-${item.status.toLowerCase()}`}>{item.status}</span>
        <button type="button" className="member-row-action" disabled={item.status !== "Available"} aria-label={`${item.status === "Available" ? "Book" : item.status} ${item.title}`}>{item.status === "Available" ? "Book" : item.status}</button>
      </article>)}</div>
    </section>
  </>;
}
