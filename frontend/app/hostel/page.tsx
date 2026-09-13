import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/shared/SiteShell";
import { Icon } from "@/components/ui/Icon";
import { HostelBookingExperience } from "@/components/hostel/HostelBookingExperience";
import { HostelFAQ } from "@/components/hostel/HostelFAQ";
import { HostelRoomTypes } from "@/components/hostel/HostelRoomTypes";

export const metadata: Metadata = {
  title: "Nomad Yoga – The Hostel | A Modern Village for Travellers",
  description:
    "Nomad Yoga – The Hostel is a modern village for travellers: a place to move, breathe, share stories and connect.",
  openGraph: {
    title: "Nomad Yoga – The Hostel",
    description: "Come as a Nomad, leave with a Tribe.",
    images: ["/images/about/hostel-logo.jpeg"],
  },
};

const amenities = [
  { name: "Wi-Fi", description: "Reliable connection across shared areas.", icon: "share" },
  { name: "Shared Kitchen / Dining", description: "Spaces for meals, chai and conversations.", icon: "home" },
  { name: "Yoga & Practice Space", description: "Room to move, stretch, breathe and slow down.", icon: "sparkles" },
  { name: "Community Lounge", description: "A relaxed place to meet fellow travellers.", icon: "users" },
  { name: "Outdoor Garden / Courtyard", description: "Open-air space for quiet mornings and sunset conversations.", icon: "heart" },
  { name: "Hot Water", description: "Comfortable showers throughout your stay.", icon: "clock" },
  { name: "Personal Storage / Lockers", description: "Secure space for everyday belongings.", icon: "shield" },
  { name: "Laundry Access", description: "Simple facilities for longer stays.", icon: "settings" },
  { name: "Work / Reading Corners", description: "Quiet areas for reading, writing or remote work.", icon: "book" },
  { name: "Tea / Chai Area", description: "A small daily ritual at the heart of the community.", icon: "sparkles" },
] satisfies ReadonlyArray<{ name: string; description: string; icon: Parameters<typeof Icon>[0]["name"] }>;

const hostelGallery = [
  { src: "/images/about/hostel-logo.jpeg", alt: "Nomad Yoga – The Hostel surrounded by coconut palms", caption: "Slow mornings", featured: true },
  { src: "/images/about/nomad-story.jpg", alt: "Travellers moving together in Nomad Yoga's open-air practice space", caption: "Space to practice", featured: false },
  { src: "/images/about/agonda.jpg", alt: "Golden sunset on Agonda Beach", caption: "Sunset rhythm", featured: false },
  { src: "/images/reiki/reiki-hands.jpg", alt: "A quiet treatment moment in an open-air tropical setting", caption: "Quiet corners", featured: false },
  { src: "/images/about/hostel-logo.jpeg", alt: "The shaded palms above Nomad Yoga – The Hostel", caption: "Courtyard shade", featured: false },
  { src: "/images/about/nomad-story.jpg", alt: "Shared movement in the Nomad Yoga practice space", caption: "Shared stories", featured: false },
] as const;

const stayInformation = [
  { title: "Check-in", copy: "Final timings will be confirmed with your booking." },
  { title: "Check-out", copy: "Departure details will be shared before arrival." },
  { title: "Yoga", copy: "You are welcome to join practices, but participation is not compulsory." },
  { title: "Community Spaces", copy: "Shared areas are designed for conversation, meals, reading and quiet time." },
  { title: "Longer Stays", copy: "Laundry and everyday facilities are available for guests staying longer." },
  { title: "Identification", copy: "A valid ID may be required at check-in." },
] as const;

export default function HostelPage() {
  return (
    <SiteShell>
      <section className="hostel-hero" aria-labelledby="hostel-title">
        <div className="hostel-hero-media" aria-hidden="true">
          <Image
            src="/images/about/hostel-logo.jpeg"
            alt=""
            fill
            priority
            sizes="(max-width: 860px) calc(100vw - 32px), min(1180px, calc(100vw - 48px))"
          />
        </div>
        <div className="hostel-shade" />
        <div className="hostel-hero-content">
          <p className="eyebrow eyebrow-light">Nomad Yoga – The Hostel</p>
          <h1 id="hostel-title">
            Come as a Nomad,
            <br />
            leave with a Tribe.
          </h1>
          <p className="hostel-hero-intro">
            Nomad Yoga – The Hostel is not a hostel and it is not a yoga school. It is both and neither at the same time: a modern village for travellers.
          </p>
          <p>
            Through movement, mindfulness, meaningful conversation and shared experience, people from different cultures, backgrounds and walks of life gather to move, breathe, learn, share stories, drink chai, watch sunsets, laugh around dinner tables and live with inventive awareness and fearless expression.
          </p>
          <p>
            Yoga is the language through which we connect—with ourselves, each other and the world around us. The aim is not to build the biggest yoga school or hostel, but an international community where people can reconnect with themselves, nature and one another.
          </p>
          <Link className="button button-light" href="/contact">
            Explore the Stay
          </Link>
        </div>
      </section>
      <section className="hostel-story" aria-labelledby="hostel-story-title">
        <div className="hostel-story-grid">
          <div className="hostel-story-heading">
            <p className="eyebrow">A Different Kind of Stay</p>
            <h2 id="hostel-story-title">
              More than a bed.
              <br />
              A place to belong.
            </h2>
          </div>
          <div className="hostel-story-copy">
            <p>
              Nomad Yoga – The Hostel is designed as a living community rather than a conventional place to sleep. The rhythm of the day moves naturally between practice, conversation, shared meals, quiet moments and time outdoors.
            </p>
            <p>
              People arrive from different countries, cultures and walks of life, but the experience is intentionally simple: live together, move together, learn from one another and remain curious.
            </p>
            <p>
              Yoga is part of the atmosphere rather than a requirement. Whether someone joins a class, watches the sunset, shares chai with another traveller or simply slows down, the aim is the same—to create space for genuine connection.
            </p>
            <ol className="hostel-story-highlights">
              <li><span aria-hidden="true">01</span>Move together</li>
              <li><span aria-hidden="true">02</span>Live consciously</li>
              <li><span aria-hidden="true">03</span>Meet the world</li>
            </ol>
          </div>
        </div>
      </section>
      <section className="hostel-rooms" aria-labelledby="hostel-rooms-title">
        <div className="hostel-rooms-heading">
          <div>
            <p className="eyebrow">Stay Your Way</p>
            <h2 id="hostel-rooms-title">
              Spaces designed for rest,
              <br />
              connection and simplicity.
            </h2>
          </div>
          <p>Choose the kind of stay that fits your rhythm—from shared community rooms to more private spaces for slower days.</p>
        </div>
        <HostelRoomTypes />
      </section>
      <section className="hostel-amenities" aria-labelledby="hostel-amenities-title">
        <div className="hostel-amenities-heading">
          <div>
            <p className="eyebrow">What&apos;s Around You</p>
            <h2 id="hostel-amenities-title">
              Simple comforts.
              <br />
              Thoughtful spaces.
            </h2>
          </div>
          <p>Everything is designed to make daily life easy, social and grounded—from shared spaces and quiet corners to the essentials you need for a comfortable stay.</p>
        </div>
        <div className="hostel-amenity-grid">
          {amenities.map((amenity) => (
            <article className="hostel-amenity" key={amenity.name}>
              <Icon className="hostel-amenity-icon" name={amenity.icon} size={21} />
              <div>
                <h3>{amenity.name}</h3>
                <p>{amenity.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="hostel-gallery" aria-labelledby="hostel-gallery-title">
        <div className="hostel-gallery-heading">
          <div>
            <p className="eyebrow">Life at Nomad</p>
            <h2 id="hostel-gallery-title">A glimpse into the rhythm of the stay.</h2>
          </div>
          <p>Shared mornings, quiet corners, movement, meals, conversations and the spaces that bring the community together.</p>
        </div>
        <div className="hostel-gallery-grid">
          {hostelGallery.map((image, index) => (
            <figure className={`hostel-gallery-item${image.featured ? " is-featured" : ""}`} key={`${image.src}-${index}`}>
              <div className="hostel-gallery-image">
                <Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 860px) calc(50vw - 28px), 50vw" />
              </div>
              <figcaption>{image.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <HostelBookingExperience />
      <section className="hostel-stay-information" aria-labelledby="hostel-stay-information-title">
        <div className="hostel-stay-information-heading">
          <p className="eyebrow">Before You Arrive</p>
          <h2 id="hostel-stay-information-title">A few things worth knowing.</h2>
        </div>
        <div className="hostel-stay-information-list">
          {stayInformation.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="hostel-faq" aria-labelledby="hostel-faq-title">
        <div className="hostel-faq-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="hostel-faq-title">A few things people usually ask.</h2>
        </div>
        <HostelFAQ />
        <div className="hostel-final-cta">
          <div>
            <h2>Ready when you are.</h2>
            <p>Live availability and booking will be available here once the hostel inventory connection is switched on.</p>
          </div>
          <a className="button" href="#hostel-availability">Plan your stay</a>
        </div>
      </section>
    </SiteShell>
  );
}
