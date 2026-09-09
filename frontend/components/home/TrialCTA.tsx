import Image from "next/image";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { Reveal } from "@/components/ui/Reveal";

export function TrialCTA() {
  return (
    <section className="section" id="trial">
      <Reveal as="div" className="container cta-card">
        <Image
          src="https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1800&q=85"
          alt=""
          fill
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="cta-card-shade" aria-hidden="true" />
        <div>
          <p className="eyebrow eyebrow-light">YOUR FIRST STEP</p>
          <h2>
            Begin exactly
            <br />
            where you are.
          </h2>
          <p>No experience required. Come as you are, meet your teacher and discover which practice feels right for you.</p>
        </div>
        <a className="button button-light" href="mailto:hello@nomadyoga.example">
          Book your first class <ArrowIcon className="icon" />
        </a>
      </Reveal>
    </section>
  );
}
