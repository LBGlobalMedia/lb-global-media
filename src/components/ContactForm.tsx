"use client";

import { useState, type FormEvent } from "react";
import { enquiryTypes, site } from "@/lib/site";

const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${site.email}`;

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({ defaultType }: { defaultType: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);

    // FormSubmit doesn't record a submission time itself (its own email
    // timestamp isn't something we control), so we stamp one ourselves —
    // in UK local time rather than UTC, with the GMT/BST offset resolved
    // automatically for the moment of submission.
    data.set(
      "Submitted (UK Time)",
      new Date().toLocaleString("en-GB", {
        timeZone: "Europe/London",
        dateStyle: "medium",
        timeStyle: "short",
      })
    );

    try {
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      if (!res.ok) throw new Error("Request failed");

      // FormSubmit returns HTTP 200 even when the submission wasn't actually
      // delivered (e.g. "this form needs activation") — the real result is
      // in the JSON body, not the status code.
      const result = await res.json();
      if (result.success !== "true") {
        console.error("FormSubmit did not deliver the message:", result);
        throw new Error(result.message || "FormSubmit reported failure");
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border rule-on-dark p-8 text-center">
        <p className="font-display text-2xl font-semibold">
          <span className="text-gradient">Thank you</span> — message sent.
        </p>
        <p className="mt-3 text-paper/60">
          We&apos;ll get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* FormSubmit configuration — see https://formsubmit.co/ */}
      <input type="hidden" name="_subject" value="New enquiry from lbglobalmedia.com" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm text-paper/70">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-2 w-full rounded-lg border border-paper/20 bg-transparent px-4 py-3 text-paper placeholder:text-paper/40 focus:border-paper/50 focus:outline-none"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm text-paper/70">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-lg border border-paper/20 bg-transparent px-4 py-3 text-paper placeholder:text-paper/40 focus:border-paper/50 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="enquiryType" className="block text-sm text-paper/70">
          Enquiry Type
        </label>
        <select
          id="enquiryType"
          name="Enquiry Type"
          defaultValue={defaultType}
          required
          className="mt-2 w-full rounded-lg border border-paper/20 bg-ink px-4 py-3 text-paper focus:border-paper/50 focus:outline-none"
        >
          {enquiryTypes.map((type) => (
            <option key={type.param} value={type.value} className="bg-ink text-paper">
              {type.value}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm text-paper/70">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="mt-2 w-full rounded-lg border border-paper/20 bg-transparent px-4 py-3 text-paper placeholder:text-paper/40 focus:border-paper/50 focus:outline-none"
          placeholder="Tell us a little about your enquiry…"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400">
          Something went wrong sending your message. Please try again, or
          email us directly at{" "}
          <a href={`mailto:${site.email}`} className="underline">
            {site.email}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 font-mono text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
