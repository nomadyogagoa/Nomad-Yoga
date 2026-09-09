import Image from "next/image";
import { practices } from "@/data/home";
import { Reveal } from "@/components/ui/Reveal";

export function Practices() {
  return (
    <section className="section" id="programs">
      <div className="container">
        <Reveal className="section-heading centered" as="div">
          <p className="eyebrow">OUR PRACTICES</p>
          <h2>Find a practice that<br /><em>meets you where you are.</em></h2>
          <p>From energising flows to restorative stillness, each class is designed to support a different part of your journey.</p>
        </Reveal>
        <div className="practice-grid">
          {practices.map((practice, index) => (
            <Reveal key={practice.title} as="article" delay={index * 0.08} className={`practice-card ${practice.featured ? "practice-card-featured" : ""} ${index === 2 ? "practice-card-warm" : ""}`}>
              {practice.image && (
                <div className="practice-image" aria-hidden="true">
                  <Image src={practice.image} alt="" fill sizes="(max-width: 860px) 100vw, 50vw" />
                </div>
              )}
              <div className="practice-shade" aria-hidden="true" />
              <div className="practice-content">
                <span className="chip">{practice.eyebrow}</span>
                <div>
                  <h3>{practice.title}</h3>
                  <p>{practice.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
