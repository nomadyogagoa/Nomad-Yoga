import { SiteShell } from "@/components/shared/SiteShell";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { gallery } from "@/data/extended";
import Image from "next/image";

export default function Gallery() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Inside the studio"
        title={
          <>
            Small moments. <em>Shared practice.</em>
          </>
        }
        copy="A glimpse of daily movement, stillness and community at Nomad Yoga."
        image="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=2000&q=88"
      />
      <section className="section">
        <div className="container gallery-grid">
          {gallery.map(([t, img], i) => (
            <Reveal as="figure" className={`gallery-item g${i + 1}`} key={t} delay={(i % 6) * 0.06}>
              <Image src={img} alt={t} fill sizes="(max-width: 760px) 100vw, 40vw" />
              <figcaption>{t}</figcaption>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
