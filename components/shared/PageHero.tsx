import type { ReactNode, CSSProperties } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  copy: string;
  image: string;
};

export function PageHero({ eyebrow, title, copy, image }: PageHeroProps) {
  return (
    <section className="page-hero" style={{ "--page-hero-image": `url(${image})` } as CSSProperties}>
      <div className="page-hero-shade" />
      <div className="container page-hero-content">
        <p className="eyebrow eyebrow-light">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
    </section>
  );
}
