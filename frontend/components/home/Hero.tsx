import Image from "next/image";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { CountUp } from "@/components/ui/CountUp";
import { featureFlags, siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-image" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2200&q=90"
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="hero-overlay" aria-hidden="true" />
      <div className="container hero-content">
        <p className="eyebrow">WELCOME TO {siteConfig.shortName}</p>
        <h1>
          Move with intention.
          <br />
          <em>Live with balance.</em>
        </h1>
        <p className="hero-copy">
          A modern sanctuary for mindful movement, conscious breath and sustainable well being & guided by experienced teachers in a calm, supportive space.
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
