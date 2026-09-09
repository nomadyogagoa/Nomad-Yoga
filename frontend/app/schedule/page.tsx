import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/shared/PageHero';
import { InteractiveSchedule } from '@/components/schedule/InteractiveSchedule';

export default function SchedulePage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Weekly Schedule"
          title="Build a rhythm that works for your life."
          copy="Morning energy, evening reset and slower weekend sessions — choose the class that fits your week."
          image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=2000&q=88"
        />
        <section className="section">
          <div className="container">
            <InteractiveSchedule />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
