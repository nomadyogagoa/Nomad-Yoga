import type { Metadata } from "next";
import Image from "next/image";
import { SiteShell } from "@/components/shared/SiteShell";

export const metadata: Metadata = {
  title: "Shop | Nomad Yoga",
  description: "Explore thoughtful books and objects from Nomad Yoga, available through Amazon.",
};

const products = [
  {
    id: "gospels-of-yoga",
    title: "The Gospels of Yoga",
    subtitle: "A journey into the heart of Yoga",
    description:
      "The Gospels of Yoga is a transformative journey into the heart of Yoga, weaving together the myths and wisdom of India's sacred deities with practical tools for modern seekers. Each chapter brings a deity's story to life through meditations, mantras, mudras, asanas and reflective practices.",
    details:
      "Blending ancient philosophy with accessible practice, this book is an invitation to awaken the divine within—whether you are new to yoga or a seasoned practitioner.",
    image: "/images/about/Cover_image_book.jpg",
    imageAlt: "The Gospels of Yoga book cover",
    priceLabel: "Available on Amazon",
    amazonUrl: "https://amzn.eu/d/dktd3wq",
    ctaLabel: "Buy on Amazon",
  },
] as const;

export default function ShopPage() {
  return (
    <SiteShell>
      <div className="shop-page">
        <section className="shop-intro" aria-labelledby="shop-title">
          <div className="container shop-intro-inner">
            <p className="eyebrow">Nomad Yoga Shop</p>
            <h1 id="shop-title">Objects for the <em>journey.</em></h1>
            <p className="shop-intro-copy">
              A small collection of books and thoughtful offerings to carry the practice beyond the mat. Purchase securely through Amazon.
            </p>
          </div>
        </section>

        <section className="shop-product-section" aria-labelledby="featured-product-title">
          <div className="container">
            <p className="eyebrow">Featured offering</p>
            {products.map((product) => (
              <article className="shop-product" key={product.id}>
                <div className="shop-product-image-wrap">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="(max-width: 760px) 100vw, 48vw"
                  />
                </div>
                <div className="shop-product-content">
                  <p className="shop-product-kicker">Book · Yoga philosophy and practice</p>
                  <h2 id="featured-product-title">{product.title}</h2>
                  <p className="shop-product-subtitle">{product.subtitle}</p>
                  <p>{product.description}</p>
                  <p>{product.details}</p>
                  <div className="shop-product-footer">
                    <div>
                      <span className="shop-product-price">{product.priceLabel}</span>
                      <span className="shop-product-note">Secure checkout handled by Amazon</span>
                    </div>
                    <a className="button" href={product.amazonUrl} target="_blank" rel="noopener noreferrer">
                      {product.ctaLabel}<span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="shop-note-section" aria-label="Shop information">
          <div className="container shop-note-grid">
            <p className="eyebrow">A simple way to shop</p>
            <p>Nomad Yoga presents the work here; Amazon manages payment, delivery and customer support. No account or cart is needed on this site.</p>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
