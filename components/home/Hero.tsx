import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { CountUp } from "@/components/ui/CountUp";
import { featureFlags, siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-image" aria-hidden="true" />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="container hero-content">
        <p className="eyebrow">WELCOME TO {siteConfig.shortName}</p>
        <h1>
          Move with intention.
          <br />
          <em>Live with balance.</em>
        </h1>
        <p className="hero-copy">
          A modern sanctuary for mindful movement, conscious breath and sustainable wellbeing â€” guided by experienced teachers in a calm, supportive space.
        </p>
        <div className="hero-actions">
          {featureFlags.trialBooking && (
            <a className="button" href="#trial">
              Book a trial class <ArrowIcon className="icon" />
            </a>
          )}
          {featureFlags.schedule && <a className="button button-ghost" href="#schedule">Explore schedule</a>}
        </div>
        <div className="hero-proof" aria-label="Nomad Yoga highlights">
          <div>
            <CountUp end={12} suffix="+" />
            <span>Years of practice</span>
          </div>
          <div>
            <CountUp end={450} suffix="+" />
            <span>Happy students</span>
          </div>
          <div>
            <CountUp end={25} suffix="+" />
            <span>Expert teachers</span>
          </div>
        </div>
      </div>
    </section>
  );
}
