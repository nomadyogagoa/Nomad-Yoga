export function About() {
  return (
    <section className="section section-muted" id="instructors">
      <div className="container about-grid">
        <div className="about-copy">
          <p className="eyebrow">OUR PHILOSOPHY</p>
          <h2>Practice beyond the pose.</h2>
          <p className="lead">We believe yoga is not about perfect shapes. It is about creating enough space to notice, breathe and reconnect.</p>
          <p>Our approach blends traditional foundations with thoughtful modern teaching, so every student can build a practice that feels grounded, safe and genuinely useful in everyday life.</p>
          <a className="text-link" href="#programs">Discover our approach <span>↗</span></a>
        </div>
        <div className="about-image-wrap">
          <div className="about-image" aria-hidden="true" />
          <div className="quote-card"><span>“</span><p>Yoga is the quiet art of returning to yourself.</p></div>
        </div>
      </div>
    </section>
  );
}
