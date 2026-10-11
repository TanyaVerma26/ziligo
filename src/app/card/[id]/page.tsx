
import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";

type Card = {
  display_name: string;
  ai_pct: number;
  coding_pct: number;
  career_pct: number;
  archetype: string;
};

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function loadCard(id: string): Promise<Card | null> {
  if (!UUID.test(id)) return null;

  await connection();

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_shared_card", {
    card_id: id,
  });

  if (error || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  return data[0] as Card;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const card = await loadCard(id);

  if (!card) return { title: "ZILIGO Scorecard" };

  const title = `@${card.display_name} is a ${card.archetype} | ZILIGO`;
  const description =
    "AI fluency. Coding. Career readiness. Discover your ZILIGO archetype.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "ZILIGO",
    },
  };
}

/* Original ZILIGO mascot: a friendly GPU with a fan-shaped face. */
function ZiloGpuMascot() {
  return (
    <svg
      viewBox="0 0 240 220"
      className="h-40 w-44 sm:h-48 sm:w-52"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="ZILIGO's smiling GPU mascot"
    >
      <defs>
        <linearGradient id="gpuFan" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8AB4F8" />
          <stop offset="100%" stopColor="#4285F4" />
        </linearGradient>
        <radialGradient id="gpuGlow">
          <stop offset="0%" stopColor="#4285F4" stopOpacity=".24" />
          <stop offset="100%" stopColor="#4285F4" stopOpacity="0" />
        </radialGradient>
        <filter id="gpuShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      <ellipse cx="120" cy="112" rx="110" ry="105" fill="url(#gpuGlow)" />
      <ellipse
        cx="120"
        cy="194"
        rx="63"
        ry="8"
        fill="#4285F4"
        opacity=".3"
        filter="url(#gpuShadow)"
      />

      {/* PCIe connector */}
      <g fill="#A6B5D2">
        <rect x="72" y="176" width="16" height="11" rx="2" />
        <rect x="94" y="176" width="16" height="11" rx="2" />
        <rect x="116" y="176" width="16" height="11" rx="2" />
        <rect x="138" y="176" width="16" height="11" rx="2" />
      </g>

      {/* GPU body */}
      <rect
        x="40"
        y="56"
        width="160"
        height="122"
        rx="18"
        fill="#171C29"
        stroke="#4A566E"
        strokeWidth="2"
      />
      <path
        d="M58 58 H182 Q198 58 198 75"
        fill="none"
        stroke="#8AB4F8"
        strokeWidth="2"
        opacity=".7"
      />

      {/* Fan */}
      <circle
        cx="96"
        cy="112"
        r="42"
        fill="#0D1422"
        stroke="#35435D"
        strokeWidth="2"
      />

      <g fill="url(#gpuFan)">
        <path d="M96 112 L96 74 C111 74 122 84 124 96 C112 94 102 102 96 112 Z" />
        <path d="M96 112 L129 132 C122 145 108 150 96 148 C102 137 102 122 96 112 Z" />
        <path d="M96 112 L63 132 C56 119 59 105 69 96 C75 107 86 112 96 112 Z" />
      </g>

      <circle
        cx="96"
        cy="112"
        r="42"
        fill="none"
        stroke="#8AB4F8"
        strokeOpacity=".45"
        strokeWidth="2"
      />

      {/* Mascot face */}
      <circle
        cx="96"
        cy="112"
        r="19"
        fill="#F8FAFF"
        stroke="#B8CCF6"
        strokeWidth="2"
      />
      <circle cx="90" cy="109" r="3" fill="#202124" />
      <path
        d="M100 109 Q103 112 106 109"
        fill="none"
        stroke="#202124"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M90 117 Q96 122 102 117"
        fill="none"
        stroke="#202124"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="84" cy="114" r="2.4" fill="#FBBC04" opacity=".8" />
      <circle cx="107" cy="114" r="2.4" fill="#FBBC04" opacity=".8" />

      {/* AI chip */}
      <rect x="150" y="80" width="36" height="36" rx="9" fill="#E8F0FE" />
      <text
        x="168"
        y="103"
        textAnchor="middle"
        fontSize="13"
        fontWeight="800"
        fill="#1A73E8"
        fontFamily="Arial, sans-serif"
      >
        AI
      </text>

      <g stroke="#66748D" strokeWidth="2" strokeLinecap="round">
        <line x1="154" y1="124" x2="182" y2="124" />
        <line x1="154" y1="131" x2="182" y2="131" />
        <line x1="154" y1="138" x2="182" y2="138" />
      </g>

      {/* Small signature details */}
      <circle cx="36" cy="80" r="4" fill="#EA4335" />
      <circle cx="206" cy="66" r="4" fill="#FBBC04" />
      <circle cx="212" cy="140" r="4" fill="#34A853" />
      <path
        d="M46 52 L49 59 L56 62 L49 65 L46 72 L43 65 L36 62 L43 59 Z"
        fill="#8AB4F8"
      />
    </svg>
  );
}

function ScoreSignal({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const score = Number.isFinite(value)
    ? Math.round(Math.max(0, Math.min(100, value)))
    : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[10px] font-medium tracking-[0.12em] text-[#AAB3C4]">
          {label}
        </span>
        <span className="font-mono text-sm font-semibold tabular-nums text-white">
          {score}%
        </span>
      </div>

      <div
        className="h-1.5 overflow-hidden rounded-full bg-white/[0.09]"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
      >
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{
            width: `${score}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

function WindowDots() {
  return (
    <div className="flex items-center gap-1.5" aria-label="Window controls">
      <span className="h-2 w-2 rounded-full bg-[#EA4335]" />
      <span className="h-2 w-2 rounded-full bg-[#FBBC04]" />
      <span className="h-2 w-2 rounded-full bg-[#34A853]" />
    </div>
  );
}

async function CardContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const card = await loadCard(id);

  if (!card) notFound();

  const clampScore = (value: number) =>
    Number.isFinite(value) ? Math.round(Math.max(0, Math.min(100, value))) : 0;

  const ai = clampScore(card.ai_pct);
  const coding = clampScore(card.coding_pct);
  const career = clampScore(card.career_pct);

  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ziligo.vercel.app"
  ).replace(/\/$/, "");

  const shareUrl = `${baseUrl}/card/${id}`;

  const shareText =
    `My ZILIGO archetype: ${card.archetype}.\n` +
    `AI ${ai}% · Coding ${coding}% · Career ${career}%.\n` +
    "Find your signal.";

 
const xShareUrl =
  `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}` +
  `&url=${encodeURIComponent(shareUrl)}`;


  return (
    <article className="relative isolate w-full max-w-5xl overflow-hidden rounded-[26px] border border-white/[0.12] bg-[#0B0D12] text-white shadow-[0_32px_100px_rgba(0,0,0,0.55)]">
      {/* Restrained ambient color — the content stays in control. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-[#4285F4]/[0.13] blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 left-1/4 -z-10 h-72 w-72 rounded-full bg-[#8B7CFF]/[0.10] blur-[100px]"
      />

      <div className="p-5 sm:p-8 lg:p-10">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <a
            href="/"
            aria-label="ZILIGO home"
            className="text-[25px] font-black tracking-[-0.09em] text-white"
          >
            ZILIGO<span className="text-[#8AB4F8]">.</span>
          </a>

          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.035] px-3 py-2 text-[9px] font-semibold tracking-[0.12em] text-[#BAC3D2] sm:text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#81C995]" />
            PERSONAL SKILL CARD
          </span>
        </header>

        <div className="my-7 h-px bg-gradient-to-r from-white/[0.16] via-white/[0.07] to-transparent sm:my-9" />

        {/* Editorial headline */}
        <section className="relative">
          <div className="grid items-center gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:gap-6">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#8AB4F8]">
                AI FLUENCY / CODE / CAREER
              </p>

              <h1 className="mt-4 max-w-2xl text-[38px] font-black uppercase leading-[0.94] tracking-[-0.065em] sm:text-5xl lg:text-6xl">
                YOUR SKILLS.
                <br />
                <span className="text-[#8AB4F8]">YOUR SIGNAL.</span>
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-6 text-[#AAB3C4]">
                A snapshot of how you work with AI, solve problems, and
                prepare for what&apos;s next.
              </p>
            </div>

            <div className="hidden md:block">
              <div className="rounded-2xl border border-white/[0.09] bg-white/[0.025] px-5 py-4 text-right">
                <p className="text-[9px] font-semibold tracking-[0.16em] text-[#8791A4]">
                  ARCHETYPE
                </p>
                <p className="mt-2 max-w-[180px] text-sm font-bold leading-5 text-white">
                  {card.archetype}
                </p>
                <p className="mt-2 font-mono text-[10px] text-[#8791A4]">
                  @{card.display_name}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main visual: scores, mascot and archetype */}
        <section className="mt-8 grid items-center gap-4 sm:mt-10 md:grid-cols-[minmax(0,1fr)_190px_minmax(0,1fr)] md:gap-5 lg:gap-6">
          {/* Score panel */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.10] bg-[#121620]/90">
            <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.025] px-4 py-3">
              <WindowDots />
              <span className="text-[9px] font-semibold tracking-[0.12em] text-[#8791A4]">
                SKILL INDEX
              </span>
            </div>

            <div className="space-y-6 p-4 sm:p-5">
              <ScoreSignal label="AI FLUENCY" value={ai} color="#8AB4F8" />
              <ScoreSignal label="CODING" value={coding} color="#81C995" />
              <ScoreSignal label="CAREER READINESS" value={career} color="#C5A4FF" />
            </div>
          </section>

          {/* Center mascot */}
          <div className="relative flex min-h-[205px] items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute h-40 w-40 rounded-full border border-white/[0.07]"
            />
            <div
              aria-hidden="true"
              className="absolute h-32 w-32 rounded-full border border-dashed border-[#8AB4F8]/20"
            />

            <span
              aria-hidden="true"
              className="absolute left-1 top-8 text-lg text-[#8AB4F8]"
            >
              ✳
            </span>
            <span
              aria-hidden="true"
              className="absolute right-1 top-7 text-lg text-[#C5A4FF]"
            >
              ✦
            </span>
            <span
              aria-hidden="true"
              className="absolute bottom-8 left-5 text-sm text-[#FBBC04]"
            >
              ✧
            </span>
            <span
              aria-hidden="true"
              className="absolute bottom-12 right-3 text-xs text-[#81C995]"
            >
              +
            </span>

            <div className="relative z-10">
              <ZiloGpuMascot />
            </div>

            <span className="absolute bottom-0 rounded-full border border-white/[0.10] bg-[#151925] px-3 py-1.5 text-[8px] font-semibold tracking-[0.14em] text-[#BAC3D2]">
              YOUR DIGITAL SIDEKICK
            </span>
          </div>

          {/* Archetype panel */}
          <section className="relative min-w-0 overflow-hidden rounded-2xl border border-[#8AB4F8]/20 bg-gradient-to-br from-[#172033] via-[#10141E] to-[#11121B] p-5 sm:p-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#4285F4]/[0.13] blur-3xl"
            />

            <div className="relative">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[9px] font-semibold tracking-[0.16em] text-[#8AB4F8]">
                  YOUR ARCHETYPE
                </p>
                <span aria-hidden="true" className="text-[#8AB4F8]">
                  ✦
                </span>
              </div>

              <p className="mt-7 break-all text-xs text-[#BAC3D2]">
                @{card.display_name}
              </p>

              <h2 className="mt-3 break-words text-3xl font-black uppercase leading-[0.98] tracking-[-0.055em] sm:text-4xl">
                {card.archetype}
                <span className="text-[#8AB4F8]">.</span>
              </h2>

              <div className="mt-5 h-px bg-gradient-to-r from-[#8AB4F8]/60 to-transparent" />

              <p className="mt-4 text-xs leading-5 text-[#BAC3D2]">
                Know your strengths.
                <br />
                Keep building your edge.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/[0.09] bg-black/20 px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#81C995]" />
                <span className="text-[9px] font-semibold tracking-[0.08em] text-[#D7DCE5]">
                  PERSONAL SKILL PROFILE
                </span>
              </div>
            </div>
          </section>
        </section>

        {/* Trust note and actions */}
        <footer className="mt-8 border-t border-white/[0.09] pt-5 sm:mt-9 sm:pt-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold tracking-[-0.025em]">
                FIND YOUR SIGNAL<span className="text-[#8AB4F8]">.</span>
              </p>
              <p className="mt-2 max-w-md text-[10px] leading-5 text-[#8791A4]">
                Scores reflect assessment responses and are self-reported,
                not independently verified.
              </p>
            </div>

            <div className="flex flex-col gap-2 min-[420px]:flex-row">
              <a
                href={xShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-[10px] font-bold tracking-[0.08em] text-white transition-colors hover:border-white/50 hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8AB4F8]"
              >
                SHARE ON X <span aria-hidden="true">↗</span>
              </a>

              <a
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8AB4F8] px-5 py-3 text-[10px] font-extrabold tracking-[0.06em] text-[#101725] transition-colors hover:bg-[#ADC9FF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8AB4F8]"
              >
                GET YOUR SCORE <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4 text-[9px] font-medium tracking-[0.12em] text-[#687386]">
            <span>ZILIGO © 2026</span>

            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4285F4]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#EA4335]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#FBBC04]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#34A853]" />
              AI · CODE · CAREER
            </span>
          </div>
        </footer>
      </div>
    </article>
  );
}

export default function CardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#05060A] px-3 py-8 sm:px-6 sm:py-12">
      <Suspense
        fallback={
          <p className="text-xs tracking-[0.18em] text-[#AAB3C4]">
            LOADING ZILIGO CARD...
          </p>
        }
      >
        <CardContent params={params} />
      </Suspense>
    </main>
  );
}
