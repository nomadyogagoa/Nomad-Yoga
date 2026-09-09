import type { ReactNode } from "react";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  copy: string;
  image: string;
};

export function PageHero({ eyebrow, title, copy, image }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero-media" aria-hidden="true">
        <Image src={image} alt="" fill priority sizes="100vw" />
      </div>
      <div className="page-hero-shade" />
      <Reveal as="div" className="container page-hero-content">
        <p className="eyebrow eyebrow-light">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{copy}</p>
      </Reveal>
    </section>
  );
}
