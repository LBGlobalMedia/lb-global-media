import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { Eyebrow } from "@/components/Eyebrow";
import { enquiryTypes, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} about licensing, filmmaker submissions, or production partnerships.`,
};

const paramToType: Record<string, string> = Object.fromEntries(
  enquiryTypes.map((t) => [t.param, t.value])
);

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const defaultType = (type && paramToType[type]) || "General";

  return (
    <section className="pb-24 pt-16 sm:pt-24">
      <Container className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <Eyebrow>Contact Us</Eyebrow>
          <h1 className="font-display mt-5 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Let&apos;s <span className="text-gradient">Talk</span>
          </h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-paper/70">
            Whether you&apos;re a platform interested in licensing a title, a
            filmmaker with a film to submit, or a producer exploring a
            co-production, we&apos;d like to hear from you.
          </p>
          <p className="mt-6 max-w-md text-paper/60">
            Prefer email? Reach us directly at{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-semibold text-gradient underline decoration-transparent hover:decoration-current"
            >
              {site.email}
            </a>
            .
          </p>
        </div>

        <div>
          <ContactForm defaultType={defaultType} />
        </div>
      </Container>
    </section>
  );
}
