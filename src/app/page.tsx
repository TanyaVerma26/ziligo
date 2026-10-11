
import { Suspense } from "react";
import AuthNav from "../components/AuthNav";
import ReportInterest from "../components/ReportInterest";

export default function Home() {
  return (
    <main className="overflow-hidden bg-black text-white">
      {/* HERO */}
      <section
        id="top"
        className="relative flex min-h-screen flex-col overflow-hidden"
      >
        {/* Cinematic background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.38) 58%, rgba(0,0,0,0.18) 100%), linear-gradient(0deg, rgba(0,0,0,0.92) 0%, transparent 55%), url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2400&q=85')",
          }}
        />

        {/* Navigation */}
        <header className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-7 sm:px-10 lg:px-16">
          <a
            href="#top"
            className="whitespace-nowrap text-lg font-extrabold tracking-[-0.06em] sm:text-xl"
            aria-label="Ziligo home"
          >
            ZILIGO
            <span className="ml-1 text-indigo-400">.</span>
          </a>

          <nav className="hidden items-center gap-8 text-[10px] font-semibold tracking-[0.18em] lg:flex">
            <a
              href="#system"
              className="transition-colors hover:text-indigo-300"
            >
              THE SYSTEM
            </a>
            <a
              href="#approach"
              className="transition-colors hover:text-indigo-300"
            >
              OUR APPROACH
            </a>
            <a
              href="#assessment"
              className="transition-colors hover:text-indigo-300"
            >
              ASSESSMENT
            </a>
          </nav>

          {/* Authentication and exploration links */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <Suspense
              fallback={
                <a
                  href="/login"
                  className="whitespace-nowrap px-1 py-3 text-[9px] font-bold tracking-[0.16em] text-white/80 transition-colors hover:text-indigo-300 sm:px-2"
                >
                  SIGN IN
                </a>
              }
            >
              <AuthNav />
            </Suspense>

            <a
              href="#assessment"
              className="whitespace-nowrap border border-white/50 px-3 py-3 text-[9px] font-bold tracking-[0.12em] transition-colors hover:border-white hover:bg-white hover:text-black sm:px-5 sm:tracking-[0.16em]"
            >
              EXPLORE <span aria-hidden="true">↗</span>
            </a>
          </div>
        </header>

        {/* Main hero message */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 items-center px-6 pb-32 pt-16 sm:px-10 lg:px-16">
          <div className="max-w-4xl">
            <p className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.28em] text-white/70 sm:text-xs">
              <span className="h-px w-8 bg-indigo-400" />
              CAREER INTELLIGENCE FOR THE AI ERA
            </p>

            <h1 className="mt-8 text-5xl font-medium uppercase leading-[0.98] tracking-[-0.055em] sm:text-7xl md:text-8xl lg:text-[104px]">
              YOUR FUTURE.
              <br />
              <span className="text-white/65">YOUR READINESS.</span>
              <br />
              YOUR MOVE.
            </h1>

            <p className="mt-7 max-w-lg text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
              The AI job market is changing. Understand your skills,
              identify your gaps, and build a clearer path towards
              the career you want.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#system"
                className="group inline-flex items-center gap-5 border border-white bg-white px-6 py-4 text-[10px] font-bold tracking-[0.15em] text-black transition-colors hover:bg-transparent hover:text-white"
              >
                DISCOVER THE SYSTEM
                <span className="text-base transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>

              <a
                href="#approach"
                className="px-3 py-4 text-[10px] font-bold tracking-[0.15em] text-white/80 transition-colors hover:text-white"
              >
                HOW IT WORKS
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-6 right-6 z-10 mx-auto flex max-w-[1312px] items-end justify-between sm:left-10 sm:right-10 lg:left-16 lg:right-16">
          <a
            href="#system"
            className="flex items-center gap-3 text-[9px] font-semibold tracking-[0.2em] text-white/65 transition-colors hover:text-white"
          >
            <span className="h-10 w-px bg-white/60" />
            SCROLL TO EXPLORE
          </a>

          <span className="text-[9px] tracking-[0.18em] text-white/50">
            ZILIGO / 01
          </span>
        </div>
      </section>

      {/* THE SYSTEM */}
      <section
        id="system"
        className="relative border-t border-white/10 bg-[#08090d] px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
      >
        <div className="mx-auto max-w-[1312px]">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] text-indigo-300">
                01 / THE SYSTEM
              </p>

              <h2 className="mt-7 max-w-3xl text-4xl font-medium uppercase leading-[1.05] tracking-[-0.045em] sm:text-6xl">
                STOP GUESSING.
                <br />
                <span className="text-white/45">START KNOWING.</span>
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8 lg:justify-self-end">
              Your career is more than a resume or a list of certificates.
              Ziligo is being designed to evaluate the evidence behind
              your skills and help you decide what to improve next.
            </p>
          </div>

          {/* Three assessment dimensions */}
          <div className="mt-20 grid border-t border-white/20 md:grid-cols-3">
            <article className="border-b border-white/20 py-8 md:border-b-0 md:border-r md:border-white/20 md:pr-8 lg:py-10">
              <p className="text-[10px] tracking-[0.2em] text-white/40">
                DIMENSION 01
              </p>
              <h3 className="mt-7 text-2xl font-medium uppercase tracking-tight">
                AI SKILLS
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">
                Understand your AI fundamentals, tools, projects, and evidence
                of learning.
              </p>
              <a
                href="/assessment/ai-skills"
                className="group mt-8 inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.18em] text-indigo-300 transition-colors hover:text-white"
              >
                START ASSESSMENT
                <span
                  aria-hidden="true"
                  className="text-2xl transition-transform group-hover:translate-x-1"
                >
                  ↗
                </span>
              </a>
            </article>

            <article className="border-b border-white/20 py-8 md:border-b-0 md:border-r md:border-white/20 md:px-8 lg:py-10">
              <p className="text-[10px] tracking-[0.2em] text-white/40">
                DIMENSION 02
              </p>
              <h3 className="mt-7 text-2xl font-medium uppercase tracking-tight">
                CODING
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">
                Review your projects, programming foundations, code quality,
                and development evidence.
              </p>
              <a
                href="/assessment/coding"
                className="group mt-8 inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.18em] text-indigo-300 transition-colors hover:text-white"
              >
                START ASSESSMENT
                <span
                  aria-hidden="true"
                  className="text-2xl transition-transform group-hover:translate-x-1"
                >
                  ↗
                </span>
              </a>
            </article>

            <article className="py-8 md:pl-8 lg:py-10">
              <p className="text-[10px] tracking-[0.2em] text-white/40">
                DIMENSION 03
              </p>
              <h3 className="mt-7 text-2xl font-medium uppercase tracking-tight">
                CAREER
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">
                Discover ways to strengthen your resume, online presence,
                experience, and target-role alignment.
              </p>
              <a
                href="/assessment/career"
                className="group mt-8 inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.18em] text-indigo-300 transition-colors hover:text-white"
              >
                START ASSESSMENT
                <span
                  aria-hidden="true"
                  className="text-2xl transition-transform group-hover:translate-x-1"
                >
                  ↗
                </span>
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section
        id="approach"
        className="relative overflow-hidden border-t border-white/10 bg-[#0d1018] px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]"
        />

        <div className="relative mx-auto max-w-[1312px]">
          <p className="text-[10px] font-bold tracking-[0.25em] text-indigo-300">
            02 / THE APPROACH
          </p>

          <h2 className="mt-7 max-w-4xl text-4xl font-medium uppercase leading-[1.05] tracking-[-0.045em] sm:text-6xl">
            FROM UNCERTAINTY
            <br />
            TO <span className="text-white/45">DIRECTION.</span>
          </h2>

          <div className="mt-16 grid gap-10 border-t border-white/20 pt-8 md:grid-cols-3 md:gap-8">
            <article>
              <p className="text-xs tracking-[0.2em] text-white/40">01</p>
              <h3 className="mt-6 text-xl font-semibold uppercase">
                Assess
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">
                Establish your starting point using evidence of your skills,
                projects, and career experience.
              </p>
            </article>

            <article>
              <p className="text-xs tracking-[0.2em] text-white/40">02</p>
              <h3 className="mt-6 text-xl font-semibold uppercase">
                Diagnose
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">
                Understand your strengths and identify the gaps that matter
                for your target role.
              </p>
            </article>

            <article>
              <p className="text-xs tracking-[0.2em] text-white/40">03</p>
              <h3 className="mt-6 text-xl font-semibold uppercase">
                Advance
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">
                Turn your results into focused actions, build proof of skill,
                and reassess your progress.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* NEW: REPORT INTEREST */}
      <ReportInterest />

      {/* FINAL CTA */}
      <section
        id="assessment"
        className="relative flex min-h-[75vh] items-center justify-center overflow-hidden border-t border-white/10 bg-black px-6 py-24 text-center sm:px-10"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(79,70,229,0.16),_transparent_58%)]"
        />

        <div className="relative z-10 mx-auto max-w-4xl">
          <p className="text-[10px] font-bold tracking-[0.25em] text-indigo-300">
            03 / YOUR NEXT CHAPTER
          </p>

          <h2 className="mt-8 text-4xl font-medium uppercase leading-tight tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            BUILD THE SKILLS.
            <br />
            <span className="text-white/45">PROVE YOUR READINESS.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
            A clearer understanding of where you stand can help you choose
            what to build next.
          </p>

          <a
            href="#system"
            className="group mt-9 inline-flex items-center gap-6 border border-white/70 px-7 py-4 text-[10px] font-bold tracking-[0.18em] transition-colors hover:bg-white hover:text-black"
          >
            EXPLORE THE ASSESSMENT MODEL
            <span className="text-base transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>

          <p className="mt-5 text-[10px] tracking-wide text-white/35">
            EARLY PRODUCT PREVIEW · ASSESSMENT AND SCORING ARE NOT CONNECTED YET
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/15 bg-black px-6 py-7 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1312px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="#top"
            className="text-sm font-extrabold tracking-[-0.04em]"
          >
            ZILIGO
            <span className="text-indigo-400">.</span>
          </a>

          <p className="text-[9px] tracking-[0.15em] text-white/40">
            MEASURE READINESS. CLOSE GAPS. BUILD YOUR FUTURE.
          </p>

          <a
            href="#top"
            className="text-[9px] font-semibold tracking-[0.15em] text-white/60 hover:text-white"
          >
            BACK TO TOP ↑
          </a>
        </div>
      </footer>
    </main>
  );
}
