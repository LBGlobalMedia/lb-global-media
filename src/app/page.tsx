import Image from "next/image";
import Link from "next/link";
import {
  BridgeIcon,
  BroadcastIcon,
  FilmStripIcon,
  GlobeIcon,
  LeafIcon,
  SparkleIcon,
} from "@phosphor-icons/react/ssr";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { NumberedList } from "@/components/NumberedList";
import { LogoStrip } from "@/components/LogoStrip";
import { DotList } from "@/components/DotList";
import { OCTAGON_CLIP, OctagonMedia } from "@/components/OctagonMedia";
import { getAllTitles } from "@/lib/titles";
import { site } from "@/lib/site";

const featuredTitleSlugs = [
  "no-place-to-hide",
  "girls-will-be",
  "an-artificial-life",
  "tender-resistance",
  "from-her-bones",
  "beyond-our-end",
];

const ethos = [
  {
    title: "Thoughtful Curation",
    body: "We select films for their thematic, emotional and visual compatibility.",
    icon: FilmStripIcon,
  },
  {
    title: "Global & Diverse Narratives",
    body: "We bring together stories, filmmakers and audiences from different cultures.",
    icon: GlobeIcon,
  },
  {
    title: "Emerging Filmmakers",
    body: "We help new talent reach wider audiences and gain long-term visibility.",
    icon: SparkleIcon,
  },
  {
    title: "Building Creative Bridges",
    body: "We connect filmmakers, producers, cultures and audiences internationally.",
    icon: BridgeIcon,
  },
  {
    title: "Responsible Innovation",
    body: "We embrace new technologies and models that empower creativity, production and distribution without losing creative control.",
    icon: LeafIcon,
  },
  {
    title: "Distribution Focused",
    body: "We believe every film deserves the right audience. We don't just create a film, but help find real distribution and reach global audiences.",
    icon: BroadcastIcon,
  },
];

const partnerTypes = [
  "Streaming & VOD platforms",
  "Broadcasters",
  "Airlines and hospitality providers",
  "Telecommunications companies",
  "Educational platforms",
  "Cultural institutions",
];

export default function HomePage() {
  const allTitles = getAllTitles();
  const featuredTitles = featuredTitleSlugs
    .map((slug) => allTitles.find((t) => t.slug === slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b rule-on-dark pb-24 pt-16 sm:pt-24">
        <Container>
          <p className="font-mono text-xs uppercase tracking-widest text-paper/50">
            International Film Production &amp; Distribution
          </p>
          <h1 className="font-display mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Global Stories.
            <br />
            <span className="text-gradient">Curated, Produced</span>
            <br />
            &amp; Distributed.
          </h1>

          {/* The octagon floats large on desktop, with shape-outside matching
              its exact clip-path so the paragraph text genuinely wraps around
              the visible shape rather than an invisible rectangle. Below lg
              it drops the float and stacks as a normal centered block — a
              floated shape this size has no sensible reading order on a
              narrow screen. */}
          <div className="mt-10">
            <div
              className="mx-auto mb-8 w-full max-w-sm lg:float-right lg:-mt-24 lg:mb-6 lg:ml-12 lg:w-[480px] lg:max-w-none xl:-mt-32 xl:w-[560px]"
              style={{ shapeOutside: OCTAGON_CLIP, shapeMargin: "2.5rem" }}
            >
              <OctagonMedia
                videoSrc="/home/hero-octagon.mp4"
                posterSrc="/home/hero-octagon-poster.jpg"
                alt="LB Global Media showreel"
              />
            </div>

            <p className="max-w-xl text-lg leading-relaxed text-paper/70">
              {site.name} is an international film production &amp; distribution
              company with operations in the UK, France and Thailand.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-paper/70">
              We curate, produce, and distribute feature-length anthologies
              featuring exceptional short films from around the world.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-paper/70">
              By bringing complementary films together around a shared theme,
              we create cohesive viewing experiences for global audiences while
              showcasing a new generation of filmmakers.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-paper/70">
              Alongside our anthology catalogue, we develop, produce and
              collaborate on selected film and television projects with
              international potential.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/catalogue"
                className="rounded-full bg-gradient-brand px-6 py-3 font-mono text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90"
              >
                Browse the Catalogue
              </Link>
              <Link
                href="/production"
                className="rounded-full border border-paper/25 px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-colors hover:border-paper/60"
              >
                Partner With Us
              </Link>
            </div>

            <div className="clear-both" />
          </div>
        </Container>
      </section>

      {/* What drives us */}
      <section className="border-b rule-on-paper bg-paper py-24 text-paper-foreground">
        <Container>
          <SectionHeading eyebrow="What Drives Us" title="Our Ethos" tone="paper" />
          <div className="mt-14">
            <NumberedList
              items={ethos}
              tone="paper"
              columns={3}
              showNumbers={false}
              bodyFont="var(--font-lato), Arial, Helvetica, sans-serif"
            />
          </div>
          <p className="font-display mt-16 max-w-3xl text-2xl leading-snug text-paper-foreground/80">
            {site.name} is the evolution of{" "}
            <a
              href="https://www.filmdoo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gradient underline decoration-transparent hover:decoration-current"
            >
              FilmDoo
            </a>
            , carrying forward a decade-long legacy of global content
            acquisition and international distribution expertise into a new,
            agile distribution model.
          </p>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-paper-foreground/85">
            {site.name} has acquired the FilmDoo brand.
          </p>
        </Container>
      </section>

      {/* Who we work with */}
      <section className="border-b rule-on-dark py-24">
        <Container>
          <SectionHeading eyebrow="Who We Work With" title="Our Partners" titleFont="mono" />
          <div className="mt-10">
            <DotList items={partnerTypes} size="base" font="mono" />
          </div>

          <p className="mt-16 font-mono text-xs uppercase tracking-widest text-paper/50">
            Discover Some of Our Global Partners
          </p>
          <div className="mt-6">
            <LogoStrip />
          </div>
        </Container>
      </section>

      {/* Catalogue teaser */}
      <section className="border-b rule-on-paper bg-paper py-24 text-paper-foreground">
        <Container>
          <SectionHeading eyebrow="From the Catalogue" title="Featured Titles" tone="paper" />

          <div className="mt-12 flex flex-wrap justify-center gap-12">
            {featuredTitles.map((title) => (
              <Link
                key={title.slug}
                href={`/catalogue/${title.slug}`}
                className="group block w-full sm:w-[calc((100%_-_3rem)/2*0.88)] lg:w-[calc((100%_-_6rem)/3*0.88)]"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-ink-soft">
                  <Image
                    src={title.poster}
                    alt={`${title.title} poster`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-display mt-4 text-lg font-semibold">
                  {title.title}
                </h3>
                <p className="mt-1 text-sm text-paper-foreground/60">
                  {title.genres.join(" · ")}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/catalogue"
              className="rounded-full bg-gradient-brand px-6 py-3 font-mono text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            >
              See Full Catalogue
            </Link>
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="bg-ink py-24">
        <Container className="text-center">
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">
            Have a title, a project, or a{" "}
            <span className="text-gradient">partnership</span> in mind?
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/catalogue"
              className="rounded-full border border-paper/25 px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-colors hover:border-paper/60"
            >
              Explore the Catalogue
            </Link>
            <Link
              href="/contact"
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
