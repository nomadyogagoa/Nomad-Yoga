"use client";
import { useEffect, useState } from "react";
import { testimonials } from "@/data/home";

export function Testimonial() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, []);

  const current = testimonials[active];

  return (
    <section className="testimonial-section">
      <div className="container testimonial-grid">
        <div>
          <p className="eyebrow eyebrow-light">STUDENT STORY</p>
          <blockquote key={active} className="testimonial-quote">“{current.quote}”</blockquote>
          <p className="testimonial-person">{current.name} <span>· {current.meta}</span></p>
          <div className="testimonial-dots" role="tablist" aria-label="Student stories">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                role="tab"
                aria-selected={i === active}
                aria-label={`Show story from ${t.name}`}
                className={i === active ? "is-active" : ""}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>
        <div className="testimonial-stat">
          <strong>4.9</strong>
          <span>Average member rating</span>
          <div>★★★★★</div>
          <p className="testimonial-reach">Practicing together across 40+ countries worldwide.</p>
        </div>
      </div>
    </section>
  );
}
