"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Olivia Bennett",
    location: "Warsaw, Poland",
    rating: 4.9,
    quote:
      "Booking took two minutes and the car was waiting exactly where they said it would be. Genuinely the easiest rental I've had.",
  },
  {
    name: "Marcus Reed",
    location: "London, UK",
    rating: 4.8,
    quote:
      "The AI assistant asked the right questions and pointed me straight at a car that fit our family trip and budget.",
  },
  {
    name: "Sofia Nowak",
    location: "Bristol, UK",
    rating: 4.9,
    quote:
      "Prices were exactly as quoted, no surprise fees at pickup. I've already rebooked for next month.",
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const visible = 3;

  function shift(dir: 1 | -1) {
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);
  }

  const ordered = [...testimonials.slice(index), ...testimonials.slice(0, index)];

  return (
    <section id="testimonials" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-brand-navy sm:text-4xl">
          Trusted by Thousands of Happy Customers
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-foreground/60">
          A high-performing web-based car rental system for any rent-a-car company and
          website.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {ordered.slice(0, visible).map((t) => (
            <div
              key={t.name}
              className="rounded-2xl bg-surface-muted p-6 text-left transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-brand-navy/10" />
                <div>
                  <p className="font-semibold text-brand-navy">{t.name}</p>
                  <p className="text-xs text-foreground/50">{t.location}</p>
                </div>
                <span className="ml-auto flex items-center gap-1 text-sm font-semibold text-brand-orange-dark">
                  <Star size={14} fill="currentColor" /> {t.rating}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground/70">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                onClick={() => setIndex(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-brand-navy" : "w-2 bg-surface-border"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => shift(-1)}
              aria-label="Previous testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border text-brand-navy hover:bg-surface-muted"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => shift(1)}
              aria-label="Next testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border text-brand-navy hover:bg-surface-muted"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
