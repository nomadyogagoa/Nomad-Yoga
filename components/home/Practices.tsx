import { practices } from "@/data/home";

export function Practices() {
  return (
    <section className="section" id="programs">
      <div className="container">
        <div className="section-heading centered">
          <p className="eyebrow">OUR PRACTICES</p>
          <h2>Find a practice that<br /><em>meets you where you are.</em></h2>
          <p>From energising flows to restorative stillness, each class is designed to support a different part of your journey.</p>
        </div>
        <div className="practice-grid">
          {practices.map((practice, index) => (
            <article key={practice.title} className={`practice-card ${practice.featured ? "practice-card-featured" : ""} ${index === 2 ? "practice-card-warm" : ""}`}>
              {practice.image && <div className="practice-image" style={{ backgroundImage: `url(${practice.image})` }} aria-hidden="true" />}
              <div className="practice-shade" aria-hidden="true" />
              <div className="practice-content">
                <span className="chip">{practice.eyebrow}</span>
                <div>
                  <h3>{practice.title}</h3>
                  <p>{practice.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
