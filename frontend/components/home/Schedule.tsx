import { schedule } from "@/data/home";
import { Reveal } from "@/components/ui/Reveal";

export function Schedule() {
  return (
    <section className="section" id="schedule">
      <div className="container schedule-layout">
        <Reveal className="schedule-intro">
          <p className="eyebrow">TODAY AT THE STUDIO</p>
          <h2>Make space<br /><em>for yourself.</em></h2>
          <p>A simple rhythm of morning and evening practices designed to fit around real life.</p>
          <a className="button button-outline" href="/schedule">View full schedule</a>
        </Reveal>
        <Reveal className="schedule-card" delay={0.15}>
          {schedule.map((item) => (
            <div className="schedule-row" key={`${item.time}-${item.className}`}>
              <time>{item.time}</time>
              <div><strong>{item.className}</strong><span>{item.instructor}</span></div>
              <span className="schedule-level">{item.level}</span>
              <button aria-label={`View ${item.className}`}>↗</button>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
