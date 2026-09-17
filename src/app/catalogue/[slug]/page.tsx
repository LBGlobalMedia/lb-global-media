import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { BackToCatalogueLink } from "@/components/BackToCatalogueLink";
import { Eyebrow } from "@/components/Eyebrow";
import { CastCrewList } from "@/components/CastCrewList";
import { EventGalleryLightbox } from "@/components/EventGalleryLightbox";
import { formatSubtitleLabel, getAllTitles, getTitleBySlug } from "@/lib/titles";

export function generateStaticParams() {
  return getAllTitles().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = getTitleBySlug(slug);
  if (!title) return {};

  return {
    title: title.title,
    description: title.logline,
  };
}


export default async function TitleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = getTitleBySlug(slug);
  if (!title) notFound();

  return (
    <>
      <section className="border-b rule-on-dark pb-8 pt-8 sm:pt-12">
        <Container>
          <BackToCatalogueLink />
        </Container>
      </section>

      <section className="border-b rule-on-dark py-16">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-ink-soft">
            <Image
              src={title.poster}
              alt={`${title.title} poster`}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
              priority
            />
          </div>

          <div>
            <Eyebrow>{title.genres.join(" · ")}</Eyebrow>
            <h1 className="font-display mt-3 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              {title.title}
            </h1>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className="font-mono text-xs uppercase tracking-wide text-paper/45">Year</dt>
                <dd className="mt-1 text-sm text-paper/80">{title.year}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-wide text-paper/45">Runtime</dt>
                <dd className="mt-1 text-sm text-paper/80">{title.runtime}</dd>
              </div>
              <div className="col-span-2">
                <dt className="font-mono text-xs uppercase tracking-wide text-paper/45">Countries</dt>
                <dd className="mt-1 text-sm text-paper/80">{title.countries.join(", ")}</dd>
              </div>
              {title.keywordsTags.length > 0 && (
                <div className="col-span-2">
                  <dt className="font-mono text-xs uppercase tracking-wide text-paper/45">
                    Keywords
                  </dt>
                  <dd className="mt-1 text-sm text-paper/80">
                    {title.keywordsTags.join(", ")}
                  </dd>
                </div>
              )}
              {title.subtitlesAvailable.length > 0 && (
                <div className="col-span-2">
                  <dt className="font-mono text-xs uppercase tracking-wide text-paper/45">
                    Subtitles
                  </dt>
                  <dd className="mt-1 text-sm text-paper/80">
                    {title.subtitlesAvailable.map(formatSubtitleLabel).join(", ")}
                  </dd>
                </div>
              )}
            </dl>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-paper/75">
              {title.logline}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {title.amazonComUrl && (
                <a
                  href={title.amazonComUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-paper/25 px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-colors hover:border-paper/60"
                >
                  Watch on Amazon.com
                </a>
              )}
              {title.amazonCoUkUrl && (
                <a
                  href={title.amazonCoUkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-paper/25 px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-colors hover:border-paper/60"
                >
                  Watch on Amazon.co.uk
                </a>
              )}
              {title.tubiUrl && (
                <a
                  href={title.tubiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-paper/25 px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-colors hover:border-paper/60"
                >
                  Watch on Tubi
                </a>
              )}
              {title.fawesomeUrl && (
                <a
                  href={title.fawesomeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-paper/25 px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-colors hover:border-paper/60"
                >
                  Watch on Fawesome
                </a>
              )}
              <Link
                href="/contact?type=licensing"
                className="rounded-full bg-gradient-brand px-6 py-3 font-mono text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90"
              >
                Enquire About Licensing
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {title.trailerYouTubeId && (
        <section className="border-b rule-on-paper bg-paper py-16 text-paper-foreground">
          <Container>
            <h2 className="font-display text-2xl font-semibold">Trailer</h2>
            <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${title.trailerYouTubeId}`}
                title={`${title.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Container>
        </section>
      )}

      {title.stills.length > 0 && (
        <section className="border-b rule-on-dark py-16">
          <Container>
            <h2 className="font-display text-2xl font-semibold">Stills</h2>
            <div className="mt-6">
              <EventGalleryLightbox
                photos={title.stills.map((src) => ({
                  src,
                  alt: `${title.title} still`,
                }))}
              />
            </div>
          </Container>
        </section>
      )}

      {(title.director.length > 0 ||
        title.writer.length > 0 ||
        title.producers.length > 0 ||
        title.cast.length > 0) && (
        <section className="border-b rule-on-paper bg-paper py-16 text-paper-foreground">
          <Container>
            <h2 className="font-display text-2xl font-semibold">Cast &amp; Crew</h2>
            <div className="mt-6">
              <CastCrewList
                director={title.director}
                writer={title.writer}
                producers={title.producers}
                cast={title.cast}
                tone="paper"
              />
            </div>
          </Container>
        </section>
      )}

      <section className="bg-ink py-16">
        <Container className="text-center">
          <BackToCatalogueLink />
        </Container>
      </section>
    </>
  );
}
