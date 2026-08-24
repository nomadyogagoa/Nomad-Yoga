import { ArrowIcon } from "@/components/ui/ArrowIcon";

export function TrialCTA() {
  return (
    <section className="section" id="trial">
      <div className="container cta-card">
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
      </div>
    </section>
  );
}
