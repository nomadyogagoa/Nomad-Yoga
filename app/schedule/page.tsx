import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/shared/PageHero';
import { schedule, weekDays } from '@/data/schedule';

export default function SchedulePage(){return <><Header/><main>
  <PageHero eyebrow="Weekly Schedule" title="Build a rhythm that works for your life." copy="Morning energy, evening reset and slower weekend sessions — choose the class that fits your week." image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=2000&q=88" />
  <section className="section"><div className="container"><div className="schedule-full">{weekDays.map(day=><section className="day-block" key={day}><div className="day-heading"><span>{day.slice(0,3)}</span><h2>{day}</h2></div><div>{schedule.filter(x=>x.day===day).map((x,i)=><article className="class-row" key={`${day}-${i}`}><time>{x.time}</time><div><h3>{x.title}</h3><span>{x.instructor}</span></div><span className="class-tag">{x.level}</span><span>{x.duration}</span><button aria-label={`Book ${x.title}`}>+</button></article>)}{schedule.filter(x=>x.day===day).length===0&&<p className="rest-day">No scheduled classes — a little room to rest.</p>}</div></section>)}</div></div></section>
</main><Footer/></>}
