"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// Traced from the actual brand mark (Media/BRAND/lb-global-media-gradient-*.png)
// via pixel analysis, not eyeballed — this is a true regular octagon, vertex-up,
// matching the logo exactly rather than an approximation. Exported so callers
// can reuse the identical shape for CSS `shape-outside` (e.g. wrapping text
// around this component when it's floated) — text-wrap only looks right if
// the wrap boundary matches the visible clip exactly.
export const OCTAGON_CLIP =
  "polygon(50% 0%, 85.355% 14.645%, 100% 50%, 85.355% 85.355%, 50% 100%, 14.645% 85.355%, 0% 50%, 14.645% 14.645%)";

// The shared size for a page-intro octagon that sits beside text in a plain
// two-column grid (Production, Catalogue, and any future page following that
// same pattern) — change it once here rather than repeating the class string
// at each call site. The Homepage hero octagon is a structurally different
// treatment (floated, with text wrapping around it via shape-outside at a
// larger, breakpoint-driven size), so it deliberately doesn't use this and
// sizes itself via its own wrapper div instead.
export const OCTAGON_STANDARD_SIZE = "mx-auto w-full max-w-sm";

export type OctagonMediaProps = {
  /**
   * Path to a video file (mp4/webm). Omit this (or pass null/undefined) to
   * show just the poster image — that's the current state everywhere this
   * component is used, since the real clips haven't been shot/exported yet.
   * The moment a real clip exists, pass its path here and the video takes
   * over automatically; nothing else about the call site needs to change.
   */
  videoSrc?: string | null;
  /** Poster/placeholder image — always required, doubles as the <video> poster. */
  posterSrc: string;
  alt: string;
  /**
   * "standard" applies OCTAGON_STANDARD_SIZE. Omit for a bespoke treatment
   * (e.g. the Homepage hero, which sizes via its own wrapper) and size it
   * with `className` instead.
   */
  size?: "standard";
  className?: string;
  sizes?: string;
};

export function OctagonMedia({
  videoSrc,
  posterSrc,
  alt,
  size,
  className = "",
  sizes = "(min-width: 1024px) 480px, 70vw",
}: OctagonMediaProps) {
  const sizeClass = size === "standard" ? OCTAGON_STANDARD_SIZE : "";
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Autoplaying loops are exactly the kind of motion prefers-reduced-motion
    // exists to suppress — pause and fall back to the static poster frame.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      video.removeAttribute("autoplay");
    }
  }, [videoSrc]);

  return (
    <div className={`relative aspect-square ${sizeClass} ${className}`}>
      {/* Soft brand-gradient glow behind the shape, echoing the logo mark's own glow. */}
      <div
        className="absolute inset-0 scale-105 bg-gradient-brand opacity-40 blur-2xl"
        style={{ clipPath: OCTAGON_CLIP }}
        aria-hidden="true"
      />

      <div className="relative h-full w-full" style={{ clipPath: OCTAGON_CLIP }}>
        {videoSrc ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={videoSrc}
            poster={posterSrc}
            preload="metadata"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <Image
            src={posterSrc}
            alt={alt}
            fill
            sizes={sizes}
            className="object-cover"
          />
        )}
      </div>
    </div>
  );
}
