import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Practices } from "@/components/home/Practices";
import { About } from "@/components/home/About";
import { Schedule } from "@/components/home/Schedule";
import { Testimonial } from "@/components/home/Testimonial";
import { TrialCTA } from "@/components/home/TrialCTA";
import { featureFlags } from "@/config/site";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {featureFlags.programs && <Practices />}
        <About />
        {featureFlags.schedule && <Schedule />}
        {featureFlags.testimonials && <Testimonial />}
        {featureFlags.trialBooking && <TrialCTA />}
      </main>
      <Footer />
    </>
  );
}
