import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CompassIcon,
  FilmStripIcon,
  HandshakeIcon,
  PuzzlePieceIcon,
  ShareNetworkIcon,
  StarIcon,
  TargetIcon,
} from "@phosphor-icons/react/ssr";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { DotList } from "@/components/DotList";
import { NumberedList } from "@/components/NumberedList";
import { EventGalleryLightbox } from "@/components/EventGalleryLightbox";
import { OctagonMedia } from "@/components/OctagonMedia";
import { site } from "@/lib/site";

const eventPartners = ["Super Cat", "Thai Media Fund", "Thai PBS", "Creative Economy Agency"];

export const metadata: Metadata = {
  title: "Production & Global Partnerships",
  description:
    "LB Global Media develops and supports selected productions and international co-productions across Europe, Asia and Latin America.",
};

const focusAreas = [
  "Coming-of-age",
  "LGBTQ+",
  "Horror and Thriller",
  "Science Fiction",
  "Asian Voices",
  "Black Cinema & African Perspectives",
  "European Stories",
  "Cultural Identity",
  "Diaspora Tales",
  "Resilience and Human Connection",
  "Animation",
  "Transmedia",
];

const formats = ["Feature films", "Vertical series & Microdramas", "Series", "Short Films"];

const whatWeBring = [
  {
    title: "International Acquisition & Distribution",
    body: "Extensive experience in international content acquisition and distribution.",
    icon: ShareNetworkIcon,
  },
  {
    title: "Established Relationships",
    body: "Relationships with platforms, filmmakers and production partners.",
    icon: HandshakeIcon,
  },
  {
    title: "Proven Curation",
    body: "Experience curating & distributing content to platforms worldwide.",
    icon: FilmStripIcon,
  },
  {
    title: "Cross-Border Perspective",
    body: "Cross-border development and co-production perspectives.",
    icon: CompassIcon,
  },
  {
    title: "Efficient Co-Production Models",
    body: "Cost-efficient, multi-national co-production models.",
    icon: PuzzlePieceIcon,
  },
  {
    title: "Access to Talent",
    body: "Access to emerging creative talent and distinctive global stories.",
    icon: StarIcon,
  },
  {
    title: "International Positioning",
    body: "Support in positioning projects for international audiences and partners.",
    icon: TargetIcon,
  },
];

export default function ProductionPage() {
  return (
    <>
      <section className="border-b rule-on-dark pb-16 pt-16 sm:pt-24">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-paper/50">
              Production &amp; Global Partnerships
            </p>
            <h1 className="font-mono mt-5 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              {site.name} as a{" "}
              <span className="text-gradient">Global Co-Production Partner</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-paper/70">
              Alongside curation and distribution, {site.name} develops and
              supports selected productions and international co-productions
              with the potential to connect with audiences across borders.
            </p>
          </div>

          <OctagonMedia
            videoSrc="/production/hero-octagon.mp4"
            posterSrc="/production/hero-octagon-poster.jpg"
            alt="LB Global Media production showreel"
            className="mx-auto w-full max-w-sm"
          />
        </Container>
      </section>

      <section className="border-b rule-on-paper bg-paper py-24 text-paper-foreground">
        <Container>
          <SectionHeading
            eyebrow="What We Are Looking For"
            title="Distinctive Voices, International Potential"
            tone="paper"
            titleFont="mono"
          />
          <p className="mt-6 max-w-2xl text-paper-foreground/70">
            We are particularly interested in projects with distinctive
            creative voices, strong international potential and themes that
            travel across and transcend cultures. Our focus areas include:
          </p>
          <div className="mt-6">
            <DotList items={focusAreas} tone="paper" />
          </div>

          <p className="mt-10 max-w-2xl text-paper-foreground/70">
            We consider selected projects at different stages, from early
            development through to production and distribution. Formats
            include:
          </p>
          <div className="mt-6">
            <DotList items={formats} tone="paper" />
          </div>
        </Container>
      </section>

      <section className="border-b rule-on-dark py-24">
        <Container>
          <SectionHeading
            eyebrow="Regional Production & Talent Networks"
            title="A Multicultural Team, Across Three Continents"
            titleFont="mono"
          />
          <p className="mt-8 text-lg leading-relaxed text-paper/70">
            Our multicultural team operates across London, Paris and Bangkok,
            supported by creative and industry relationships throughout
            Europe, Asia and Latin America.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-paper/70">
            Our truly international and unique DNA makes us well-positioned
            for international media co-productions. Our international
            perspective helps us identify cross-border opportunities, connect
            complementary partners and support stories capable of resonating
            beyond their country of origin.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-paper/70">
            At {site.name}, we are particularly interested in projects which
            bring fresh, authentic perspectives from under-represented voices
            around the world.
          </p>

          <div className="mt-12 max-w-2xl rounded-2xl border rule-on-dark bg-paper/[0.03] p-8">
            <p className="font-mono text-xl font-semibold">
              Weerada Sucharitkul
              <span className="ml-3 font-mono text-xs font-normal uppercase tracking-widest text-paper/50">
                Founder &amp; CEO
              </span>
            </p>
            <p className="mt-4 leading-relaxed text-paper/70">
              Founder and CEO Weerada Sucharitkul brings more than a decade of
              experience in international content acquisition and
              distribution. An alumna of the EAVE Ties That Bind international
              co-production programme, she has lived in 11 countries across
              five continents and has a particular interest in projects
              connecting Asia, Europe and Latin America.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b rule-on-paper bg-paper py-24 text-paper-foreground">
        <Container>
          <SectionHeading
            eyebrow="Our International Footprint"
            title="Europe, Asia, Latin America & North America"
            tone="paper"
            titleFont="mono"
          />

          {/* The clear visual focus of this section, sized generously but kept
              within the page's normal content width rather than full-bleed.
              Hidden below sm — the map becomes too squashed to read at
              phone widths, so the regional breakdown text carries it there. */}
          <div className="relative mt-12 hidden aspect-[3026/1290] w-full sm:block">
            <Image
              src="/production/footprint-map.png"
              alt="Map of LB Global Media's international footprint across Europe, Asia, Latin America and North America, with core territories in London, Paris, Berlin, New York and Bangkok"
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="object-contain"
              priority
            />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <h3 className="font-mono text-lg font-semibold">Europe</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-paper-foreground/70">
                <li>France and UK-based operations with strong industry presence</li>
                <li>Production foothold in Spain and Catalonia</li>
                <li>Additional partners in Eastern Europe: Lithuania, Poland, and Serbia</li>
                <li>Exploring new opportunities in the Canary Islands, Belgium, Italy, and Ibermedia pathways</li>
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-lg font-semibold">Asia</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-paper-foreground/70">
                <li>Established industry and local connections in Thailand</li>
                <li>Growing networks in Singapore, Japan, Indonesia, and Malaysia</li>
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-lg font-semibold">Latin America</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-paper-foreground/70">
                <li>Strong networks with producers and filmmakers in Mexico, Colombia &amp; Brazil</li>
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-lg font-semibold">North America</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-paper-foreground/70">
                <li>
                  The US is a major licensing territory, with global partners
                  such as Amazon and Tubi.
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b rule-on-dark py-24">
        <Container>
          <SectionHeading eyebrow="What We Bring" title="Why Partner With Us" titleFont="mono" />
          <div className="mt-14">
            <NumberedList items={whatWeBring} columns={2} titleFont="mono" />
          </div>
        </Container>
      </section>

      <section className="border-b rule-on-paper bg-paper py-24 text-paper-foreground">
        <Container>
          <SectionHeading
            eyebrow="Events & Industry Engagement"
            title="Building the Room, Not Just the Deal"
            tone="paper"
            titleFont="mono"
          />
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-paper-foreground/70">
            We engage with filmmakers, producers, and industry professionals to
            exchange knowledge, build relationships, and explore the changing
            international content market.
          </p>
          <p className="font-mono mt-6 text-2xl font-semibold">
            Film Business Masterclass: Content Is King, Distribution Is
            Emperor, IP Is Your Asset
            <span className="mt-1 block text-base font-normal text-paper-foreground/60">
              Bangkok — 17 January 2026
            </span>
          </p>

          <div className="mt-10">
            <EventGalleryLightbox
              photos={[1, 2, 3].map((i) => ({
                src: `/home/masterclass/photo-${i}.jpg`,
                alt: `Film Business Masterclass, Bangkok, 17 January 2026 — photo ${i}`,
              }))}
            />
          </div>

          <p className="mt-10 font-mono text-xs uppercase tracking-widest text-paper-foreground/50">
            Event Partners
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-paper-foreground/70">
            {eventPartners.map((partner) => (
              <li key={partner}>{partner}</li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-ink py-24">
        <Container className="text-center">
          <h2 className="font-mono text-4xl font-semibold sm:text-5xl">
            <span className="text-gradient">Partner</span> With Us
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-paper/70">
            We believe in treating our production partners as true
            collaborative team members.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-paper/70">
            We welcome discussions with producers, filmmakers, financiers,
            platforms and other organisations seeking international
            production or distribution partners.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-paper/70">
            If you are developing a project that aligns with our vision and
            would love to explore potential synergies, we would like to hear
            from you.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-paper/70">
            {site.name} is committed to discovering and elevating distinctive
            voices from around the world — whether by introducing existing
            films to new audiences or helping original stories reach the
            screen.
          </p>
          <div className="mt-14">
            <Link
              href="/contact?type=partnership"
              className="rounded-full bg-gradient-brand px-6 py-3 font-mono text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            >
              Get in Touch
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
