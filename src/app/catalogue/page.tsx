import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { SectionHeading } from "@/components/SectionHeading";
import { DotList } from "@/components/DotList";
import { CatalogueBrowser } from "@/components/CatalogueBrowser";
import { OctagonMedia } from "@/components/OctagonMedia";
import { getAllGenres, getAllTitles } from "@/lib/titles";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Catalogue & Titles",
  description:
    "Curated short-film anthologies from LB Global Media, spanning coming-of-age, LGBTQ+, horror, drama and sci-fi.",
};

const catalogueGenres = [
  "Coming-of-Age",
  "LGBTQ+",
  "Horror",
  "Drama",
  "Science Fiction",
  "Black Cinema",
];

const partnerDeliverables = [
  "Delivery-ready feature-length titles",
  "Closed captions and English subtitles",
  "Additional subtitle languages where available",
  "Posters, trailers, key art and approved synopses",
  "Clear rights and territory information",
  "Flexible international licensing opportunities",
  "Responsive delivery and partner support",
];

const filmmakerAudience = [
  "Independent filmmakers",
  "Producers and production companies",
  "Sales agents and catalogue owners",
  "Film schools and talent-development organisations",
];

export default function CataloguePage() {
  const titles = getAllTitles();
  const genres = getAllGenres();

  return (
    <>
      <section className="border-b rule-on-dark pb-16 pt-16 sm:pt-24">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Eyebrow>Catalogue &amp; Titles</Eyebrow>
            <h1 className="font-display mt-5 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Curated Short Films.{" "}
              <span className="text-gradient">Feature-Length Experiences.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-paper/70">
              {site.name} creates feature-length anthologies by bringing together
              complementary short films around a shared genre, theme or audience.
              Each anthology is carefully assembled to create a cohesive viewing
              experience while preserving the identity and creative vision of
              every film.
            </p>
            <p className="mt-6 max-w-2xl text-paper/60">
              Our catalogue currently includes curated anthologies spanning
              across:
            </p>
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-paper/50">
              {catalogueGenres.join(" · ")}
            </p>
          </div>

          <OctagonMedia
            videoSrc="/catalogue/hero-octagon.mp4"
            posterSrc="/catalogue/hero-octagon-poster.jpg"
            alt="LB Global Media catalogue showreel"
            size="standard"
          />
        </Container>
      </section>

      <section className="border-b rule-on-dark py-16">
        <Container>
          <Eyebrow>Browse Our Titles</Eyebrow>
          <div className="mt-8">
            <CatalogueBrowser titles={titles} genres={genres} />
          </div>
        </Container>
      </section>

      <section className="border-b rule-on-paper bg-paper py-24 text-paper-foreground">
        <Container>
          <SectionHeading
            eyebrow="For Platforms, Channel Partners & Buyers"
            title="Built for Fast, Clean Delivery"
            tone="paper"
          />
          <p className="mt-6 max-w-2xl text-paper-foreground/70">
            We provide partners with:
          </p>
          <div className="mt-6">
            <DotList items={partnerDeliverables} tone="paper" />
          </div>
          <p className="mt-10 text-paper-foreground/80">
            For interest in licensing our titles, please{" "}
            <Link
              href="/contact?type=licensing"
              className="font-semibold text-gradient underline decoration-transparent hover:decoration-current"
            >
              get in touch via our contact form
            </Link>
            , or email us directly at {site.email}.
          </p>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <SectionHeading
            eyebrow="For Filmmakers & Rights-Holders"
            title="Submit a Short, or a Catalogue"
          />
          <p className="mt-6 max-w-2xl text-paper/70">
            We are seeking distinctive short films and established short-film
            catalogues that align with our editorial focus. We welcome
            submissions and partnership enquiries from:
          </p>
          <div className="mt-6">
            <DotList items={filmmakerAudience} columns={1} />
          </div>
          <p className="mt-10 text-paper/80">
            If you own the rights to an individual short film or film
            catalogue, we would be pleased to hear from you.
          </p>
          <p className="mt-4 text-paper/80">
            <Link
              href="/contact?type=filmmaker"
              className="font-semibold text-gradient underline decoration-transparent hover:decoration-current"
            >
              Get in touch via our contact form
            </Link>
            , or email us directly at {site.email}.
          </p>
        </Container>
      </section>
    </>
  );
}
