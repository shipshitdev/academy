"use client";

import { Card, CardContent, Skeleton } from "@agenticindiedev/ui";
import type { Course } from "@interfaces/course.interface";
import { CourseService } from "@services/course.service";
import { ArrowRight, BookOpen, Code, Palette, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function getCourseIcon(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("sell") || lower.includes("commerce") || lower.includes("ecom")) {
    return ShoppingCart;
  }
  if (lower.includes("build") || lower.includes("code") || lower.includes("dev")) {
    return Code;
  }
  if (lower.includes("distribute") || lower.includes("content") || lower.includes("social")) {
    return Palette;
  }
  return BookOpen;
}

const JOURNEY_STEPS = [
  {
    icon: Code,
    step: "Step 1",
    title: "Build",
    subtitle: "Vibe Coding",
    description:
      "Learn to vibe code. Ship real apps with AI as your pair programmer. No experience needed.",
    color: "violet",
  },
  {
    icon: ShoppingCart,
    step: "Step 2",
    title: "Sell",
    subtitle: "Ecommerce",
    description:
      "Launch and scale ecommerce stores. Learn to sell products online with AI-powered marketing.",
    color: "amber",
  },
  {
    icon: Palette,
    step: "Step 3",
    title: "Distribute",
    subtitle: "AI Content",
    description:
      "Generate AI content and publish on socials. Build your audience and grow your reach.",
    color: "emerald",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Build",
    description: "Learn vibe coding. Ship your first app with AI as your pair programmer.",
  },
  {
    number: "02",
    title: "Sell",
    description: "Launch an ecommerce store. Learn to sell products online.",
  },
  {
    number: "03",
    title: "Distribute",
    description: "Generate AI content. Publish on socials and build your audience.",
  },
  {
    number: "04",
    title: "Repeat",
    description: "Stack the skills. Build, sell, distribute. Rinse and repeat.",
  },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />

        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Floating orbs */}
        <div className="animate-float-slow absolute -left-20 top-20 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[100px]" />
        <div className="animate-float absolute -right-20 top-40 h-[350px] w-[350px] rounded-full bg-violet-500/15 blur-[90px]" />
        <div className="animate-pulse-glow absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[80px]" />

        {/* Animated accent lines */}
        <div className="absolute left-0 top-1/4 h-px w-1/3 animate-pulse bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div
          className="absolute right-0 top-2/3 h-px w-1/4 animate-pulse bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"
          style={{ animationDelay: "1s" }}
        />

        {/* Corner accents */}
        <div className="absolute left-0 top-0 h-32 w-32 bg-gradient-to-br from-primary/10 to-transparent" />
        <div className="absolute bottom-0 right-0 h-32 w-32 bg-gradient-to-tl from-primary/10 to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center">
        <h1 className="animate-fade-in-up text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Build profitable businesses{" "}
          <span
            className="bg-gradient-to-r from-primary via-violet-400 to-primary"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            with AI
          </span>
        </h1>

        <p className="animate-fade-in-up delay-100 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Learn to build e-commerce stores, ship AI-powered apps, and create content that scales. No
          coding experience required. Join a community of builders shipping real projects.
        </p>

        <div className="animate-fade-in-up delay-200 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
          >
            Start Learning Free
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="#courses"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-base font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted"
          >
            Browse Courses
          </Link>
        </div>

        <div className="animate-fade-in-up delay-300 mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 transition-colors hover:text-foreground">
            <svg
              className="h-5 w-5 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Free tier available
          </div>
          <div className="flex items-center gap-2 transition-colors hover:text-foreground">
            <svg
              className="h-5 w-5 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Hands-on projects
          </div>
          <div className="flex items-center gap-2 transition-colors hover:text-foreground">
            <svg
              className="h-5 w-5 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Community support
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const colorClasses = {
    violet: {
      bg: "bg-violet-600/20",
      text: "text-violet-400",
      highlight: "bg-violet-600/50",
      shadow: "hover:shadow-violet-600/10",
    },
    amber: {
      bg: "bg-amber-500/20",
      text: "text-amber-400",
      highlight: "bg-amber-500/40",
      shadow: "hover:shadow-amber-500/10",
    },
    emerald: {
      bg: "bg-emerald-500/20",
      text: "text-emerald-400",
      highlight: "bg-emerald-500/40",
      shadow: "hover:shadow-emerald-500/10",
    },
  };

  return (
    <section className="relative py-24">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            <span className="relative inline-block">
              <span className="relative z-10">Your journey</span>
              <span
                className="absolute -bottom-1 left-0 h-3 w-full -skew-x-12 bg-violet-600/50"
                aria-hidden="true"
              />
            </span>{" "}
            from zero to income
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A clear path: first you build, then you sell, then you scale. Each step unlocks the
            next.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid gap-8 md:grid-cols-3">
            {JOURNEY_STEPS.map((step, idx) => {
              const colors = colorClasses[step.color as keyof typeof colorClasses];
              return (
                <Card
                  key={step.title}
                  variant="outline"
                  hover
                  className={`group relative transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${colors.shadow}`}
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <CardContent className="pt-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div
                        className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${colors.bg} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <step.icon
                          className={`h-7 w-7 ${colors.text} transition-transform duration-300 group-hover:rotate-6`}
                        />
                      </div>
                      <span
                        className={`text-xs font-bold uppercase tracking-widest ${colors.text}`}
                      >
                        {step.step}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      <span className="relative inline-block">
                        <span className="relative z-10">{step.title}</span>
                        <span
                          className={`absolute -bottom-0.5 left-0 h-2 w-full -skew-x-12 ${colors.highlight} opacity-0 transition-all duration-300 group-hover:opacity-100`}
                          aria-hidden="true"
                        />
                      </span>
                    </h3>
                    <p className="mt-1 text-sm font-medium text-muted-foreground/80">
                      {step.subtitle}
                    </p>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepsSection() {
  return (
    <section className="relative bg-muted/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            The Path: Zero to Shipped
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A proven system to go from idea to launched project in weeks, not months.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, idx) => (
            <div
              key={step.number}
              className="group relative transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="mb-4 font-mono text-5xl font-bold text-primary/20 transition-all duration-300 group-hover:text-primary/40 group-hover:scale-105">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CourseCard({ course }: { course: Course }) {
  const Icon = getCourseIcon(course.title);

  return (
    <Card
      variant="outline"
      hover
      className="group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5"
    >
      <CardContent className="flex-1 p-6">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
          {course.title}
        </h3>
        {course.description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{course.description}</p>
        )}
        <Link
          href={`/courses/${course.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Start learning
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

function CourseCardSkeleton() {
  return (
    <Card variant="outline" className="flex flex-col overflow-hidden">
      <CardContent className="flex-1 p-6 space-y-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}

function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    CourseService.getAll(undefined, { signal: controller.signal })
      .then(setCourses)
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <section id="courses" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Start Learning</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Pick a course and dive in. Each one is designed to take you from zero to shipping real
            projects.
          </p>
        </div>

        {loading ? (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
        ) : error ? (
          <div className="mt-16 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-center text-destructive">
            {error}
          </div>
        ) : courses.length === 0 ? (
          <div className="mt-16 text-center text-muted-foreground">
            <p>No courses available yet.</p>
            <p className="mt-2 text-sm">Check back soon!</p>
          </div>
        ) : (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="relative bg-muted/30 py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent" />
      {/* Animated accent blobs */}
      <div className="animate-float-slow absolute -left-32 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
      <div className="animate-float absolute -right-32 top-1/2 h-[250px] w-[250px] -translate-y-1/2 rounded-full bg-accent/5 blur-[80px]" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Ready to start building?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Join thousands of builders learning to automate, create, and ship with AI.
        </p>

        <div className="mt-10">
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 Open Learning Center. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/courses" className="hover:text-foreground transition-colors">
              Courses
            </Link>
            <Link href="/sign-up" className="hover:text-foreground transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <StepsSection />
      <CoursesSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
