import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { ASSESSMENT_QUESTION_BANK } from "../../lib/assessment-question-bank";
import {
  evaluateAssessment,
  getAssessmentStatus,
  getImprovementAreas,
  getScoreLabel,
} from "../../lib/assessment-scoring";

function DashboardFallback() {
  return (
    <section
      aria-busy="true"
      className="mt-12 border border-white/15 bg-white/[0.03] p-6 sm:p-9"
    >
      <p className="text-[10px] font-semibold tracking-[0.2em] text-indigo-300">
        YOUR READINESS
      </p>

      <h2 className="mt-4 text-2xl font-medium uppercase">
        Preparing your dashboard.
      </h2>

      <p className="mt-3 text-sm leading-7 text-white/55">
        Verifying your account and preparing your career workspace.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {["AI SKILLS", "CODING", "CAREER"].map((item) => (
          <div
            key={item}
            className="min-h-40 border border-white/15 bg-white/[0.03] p-6"
          >
            <p className="text-xs tracking-[0.2em] text-white/40">
              LOADING
            </p>

            <h3 className="mt-6 text-xl font-semibold uppercase">
              {item}
            </h3>

            <p className="mt-3 text-sm text-white/40">
              Preparing assessment area...
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

async function AuthenticatedDashboard() {
  await connection();

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/login");
  }

  const userId = data.claims.sub;

  const email =
    typeof data.claims.email === "string"
      ? data.claims.email
      : "SIGNED-IN STUDENT";

  // 1. Retrieve the latest AI Skills assessment.
  const {
    data: latestAiAssessment,
    error: assessmentQueryError,
  } = await supabase
    .from("assessment_attempts")
    .select("id, answers, completed_at, created_at")
    .eq("user_id", userId)
    .eq("assessment_type", "ai_skills")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // 2. Retrieve the latest Coding assessment.
  const {
    data: latestCodingAssessment,
    error: codingAssessmentQueryError,
  } = await supabase
    .from("assessment_attempts")
    .select("id, answers, completed_at, created_at")
    .eq("user_id", userId)
    .eq("assessment_type", "coding")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // 3. Retrieve the latest Career assessment.
  const {
    data: latestCareerAssessment,
    error: careerAssessmentQueryError,
  } = await supabase
    .from("assessment_attempts")
    .select("id, answers, evidence_links, completed_at, created_at")
    .eq("user_id", userId)
    .eq("assessment_type", "career")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // 4. Evaluate each assessment with the shared v2 scoring helpers.
  const aiEvaluation = evaluateAssessment(
    latestAiAssessment?.answers,
    ASSESSMENT_QUESTION_BANK.ai_skills
  );
  const codingEvaluation = evaluateAssessment(
    latestCodingAssessment?.answers,
    ASSESSMENT_QUESTION_BANK.coding
  );
  const careerEvaluation = evaluateAssessment(
    latestCareerAssessment?.answers,
    ASSESSMENT_QUESTION_BANK.career
  );

  // 5. Resolve each assessment's status.
  const aiAssessmentStatus = getAssessmentStatus(
    Boolean(assessmentQueryError),
    Boolean(latestAiAssessment),
    aiEvaluation
  );
  const codingAssessmentStatus = getAssessmentStatus(
    Boolean(codingAssessmentQueryError),
    Boolean(latestCodingAssessment),
    codingEvaluation
  );
  const careerAssessmentStatus = getAssessmentStatus(
    Boolean(careerAssessmentQueryError),
    Boolean(latestCareerAssessment),
    careerEvaluation
  );

  // 6. Resolve each card's score label.
  const aiScoreLabel = getScoreLabel(
    Boolean(assessmentQueryError),
    Boolean(latestAiAssessment),
    aiEvaluation
  );
  const codingScoreLabel = getScoreLabel(
    Boolean(codingAssessmentQueryError),
    Boolean(latestCodingAssessment),
    codingEvaluation
  );
  const careerScoreLabel = getScoreLabel(
    Boolean(careerAssessmentQueryError),
    Boolean(latestCareerAssessment),
    careerEvaluation
  );

  // 7. Resolve each dimension's improvement areas.
  const improvementAreas = getImprovementAreas(
    aiEvaluation,
    ASSESSMENT_QUESTION_BANK.ai_skills
  );
  const codingImprovementAreas = getImprovementAreas(
    codingEvaluation,
    ASSESSMENT_QUESTION_BANK.coding
  );
  const careerImprovementAreas = getImprovementAreas(
    careerEvaluation,
    ASSESSMENT_QUESTION_BANK.career
  );

  // 8. Read the Career evidence links (only safe https:// links are shown).
  const savedEvidenceLinks = latestCareerAssessment?.evidence_links;

  const evidenceLinksObject =
    savedEvidenceLinks !== null &&
    typeof savedEvidenceLinks === "object" &&
    !Array.isArray(savedEvidenceLinks)
      ? (savedEvidenceLinks as Record<string, unknown>)
      : null;

  const toSafeHttpsUrl = (value: unknown): string | null => {
    if (typeof value !== "string" || value === "") {
      return null;
    }

    try {
      const parsed = new URL(value);
      return parsed.protocol === "https:" ? parsed.toString() : null;
    } catch {
      return null;
    }
  };

  const careerEvidenceLinks = [
    { label: "GITHUB", url: toSafeHttpsUrl(evidenceLinksObject?.github) },
    { label: "LINKEDIN", url: toSafeHttpsUrl(evidenceLinksObject?.linkedin) },
    {
      label: "PORTFOLIO / RESUME",
      url: toSafeHttpsUrl(evidenceLinksObject?.portfolio),
    },
  ].filter(
    (link): link is { label: string; url: string } => link.url !== null
  );

  return (
    <>
      <p className="mt-6 text-sm text-white/60">
        Signed in as {email}
      </p>

      {/* Readiness overview */}
      <section className="mt-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-white/40">
              YOUR READINESS
            </p>

            <h2 className="mt-3 text-2xl font-medium uppercase">
              Three dimensions. One direction.
            </h2>
          </div>

          <p className="text-xs text-white/40">
            {aiScoreLabel || "AI Skills assessment not completed"}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {/* AI Skills card */}
          <article className="border border-white/15 bg-white/[0.03] p-6">
            <p className="text-[10px] tracking-[0.2em] text-indigo-300">
              DIMENSION 01
            </p>

            <h3 className="mt-6 text-xl font-semibold uppercase">
              AI SKILLS
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/55">
              Evaluate AI fundamentals, tools, projects, and learning evidence.
            </p>

            <p className="mt-8 border-t border-white/10 pt-4 text-xs text-white/40">
              {aiAssessmentStatus}
            </p>

            <p className="mt-3 text-xs leading-5 text-white/60">
              {aiScoreLabel}
            </p>
          </article>

          {/* Coding card */}
          <article className="border border-white/15 bg-white/[0.03] p-6">
            <p className="text-[10px] tracking-[0.2em] text-emerald-300">
              DIMENSION 02
            </p>

            <h3 className="mt-6 text-xl font-semibold uppercase">
              CODING
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/55">
              Evaluate programming foundations, project quality, and technical evidence.
            </p>

            <p className="mt-8 border-t border-white/10 pt-4 text-xs text-white/40">
              {codingAssessmentStatus}
            </p>

            <p className="mt-3 text-xs leading-5 text-white/60">
              {codingScoreLabel}
            </p>
          </article>

          {/* Career card */}
          <article className="border border-white/15 bg-white/[0.03] p-6">
            <p className="text-[10px] tracking-[0.2em] text-amber-300">
              DIMENSION 03
            </p>

            <h3 className="mt-6 text-xl font-semibold uppercase">
              CAREER
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/55">
              Review your resume, experience, professional presence, and alignment with your target role.
            </p>

            <p className="mt-8 border-t border-white/10 pt-4 text-xs text-white/40">
              {careerAssessmentStatus}
            </p>

            <p className="mt-3 text-xs leading-5 text-white/60">
              {careerScoreLabel}
            </p>

            {careerEvidenceLinks.length > 0 && (
              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-white/40">
                  EVIDENCE LINKS (NOT VERIFIED)
                </p>

                <ul className="mt-2 space-y-1">
                  {careerEvidenceLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-amber-300 underline underline-offset-4 hover:text-amber-200"
                      >
                        {link.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        </div>
      </section>

      {/* AI Skills recommendations */}
      <section className="mt-10 border border-white/15 bg-white/[0.03] p-6 sm:p-9">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-indigo-300">
          PERSONALIZED NEXT STEPS
        </p>

        <h2 className="mt-4 text-2xl font-medium uppercase">
          Close your biggest gaps.
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
          These priorities are based on your self-reported AI Skills answers.
          Use them to guide practice, then reassess your progress.
        </p>

        {assessmentQueryError ? (
          <p className="mt-6 text-sm text-amber-300">
            We couldn't load your AI Skills assessment. Please refresh the dashboard and try again.
          </p>
        ) : improvementAreas.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {improvementAreas.map((area, index) => (
              <article
                key={area.questionId}
                className="border border-white/15 p-5"
              >
                <p className="text-[10px] font-semibold tracking-[0.2em] text-indigo-300">
                  {area.points === null
                    ? "EVIDENCE GAP · NOT SCORED"
                    : `PRIORITY ${String(index + 1).padStart(2, "0")} · ${area.points}/3`}
                </p>

                <h3 className="mt-4 text-lg font-semibold">
                  {area.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/55">
                  {area.recommendation}
                </p>
              </article>
            ))}
          </div>
        ) : latestAiAssessment && !aiEvaluation.isCurrentVersion ? (
          <p className="mt-6 text-sm leading-6 text-white/55">
            This assessment was completed with an older version. Retake the AI Skills assessment to generate v2 recommendations.
          </p>
        ) : latestAiAssessment && !aiEvaluation.isComplete ? (
          <p className="mt-6 text-sm leading-6 text-white/55">
            Your saved AI Skills assessment does not contain all expected answers. Complete it again to generate recommendations.
          </p>
        ) : latestAiAssessment ? (
          <p className="mt-6 text-sm leading-6 text-white/55">
            No remaining scored gaps in your current AI Skills assessment — strong work. Retake it any time to track your progress.
          </p>
        ) : (
          <p className="mt-6 text-sm leading-6 text-white/55">
            Complete the AI Skills assessment to receive personalized next steps.
          </p>
        )}
      </section>

      {/* Coding recommendations */}
      <section className="mt-10 border border-white/15 bg-white/[0.03] p-6 sm:p-9">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-emerald-300">
          CODING DEVELOPMENT PLAN
        </p>

        <h2 className="mt-4 text-2xl font-medium uppercase">
          Strengthen your coding skills.
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
          These priorities are based on your self-reported Coding assessment.
          Practise the recommended exercises and reassess your progress.
        </p>

        {codingAssessmentQueryError ? (
          <p className="mt-6 text-sm text-amber-300">
            We couldn't load your Coding assessment. Refresh the dashboard and try again.
          </p>
        ) : codingImprovementAreas.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {codingImprovementAreas.map((area, index) => (
              <article
                key={area.questionId}
                className="border border-white/15 p-5"
              >
                <p className="text-[10px] font-semibold tracking-[0.2em] text-emerald-300">
                  {area.points === null
                    ? "EVIDENCE GAP · NOT SCORED"
                    : `PRIORITY ${String(index + 1).padStart(2, "0")} · ${area.points}/3`}
                </p>

                <h3 className="mt-4 text-lg font-semibold">
                  {area.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/55">
                  {area.recommendation}
                </p>
              </article>
            ))}
          </div>
        ) : latestCodingAssessment && !codingEvaluation.isCurrentVersion ? (
          <p className="mt-6 text-sm leading-6 text-white/55">
            This assessment was completed with an older version. Retake the Coding assessment to generate v2 recommendations.
          </p>
        ) : latestCodingAssessment && !codingEvaluation.isComplete ? (
          <p className="mt-6 text-sm leading-6 text-white/55">
            Your saved Coding assessment does not contain all expected answers. Complete it again to generate recommendations.
          </p>
        ) : latestCodingAssessment ? (
          <p className="mt-6 text-sm leading-6 text-white/55">
            No remaining scored gaps in your current Coding assessment — strong work. Retake it any time to track your progress.
          </p>
        ) : (
          <p className="mt-6 text-sm leading-6 text-white/55">
            Complete the Coding assessment to receive personalized practice recommendations.
          </p>
        )}
      </section>

      {/* Career recommendations */}
      <section className="mt-10 border border-white/15 bg-white/[0.03] p-6 sm:p-9">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-amber-300">
          CAREER DEVELOPMENT PLAN
        </p>

        <h2 className="mt-4 text-2xl font-medium uppercase">
          Strengthen your career profile.
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
          These priorities are based on your self-reported Career assessment.
          Complete the recommended actions and reassess your progress.
        </p>

        {careerAssessmentQueryError ? (
          <p className="mt-6 text-sm text-amber-300">
            We couldn't load your Career assessment. Refresh the dashboard and try again.
          </p>
        ) : careerImprovementAreas.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {careerImprovementAreas.map((area, index) => (
              <article
                key={area.questionId}
                className="border border-white/15 p-5"
              >
                <p className="text-[10px] font-semibold tracking-[0.2em] text-amber-300">
                  {area.points === null
                    ? "EVIDENCE GAP · NOT SCORED"
                    : `PRIORITY ${String(index + 1).padStart(2, "0")} · ${area.points}/3`}
                </p>

                <h3 className="mt-4 text-lg font-semibold">
                  {area.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/55">
                  {area.recommendation}
                </p>
              </article>
            ))}
          </div>
        ) : latestCareerAssessment && !careerEvaluation.isCurrentVersion ? (
          <p className="mt-6 text-sm leading-6 text-white/55">
            This assessment was completed with an older version. Retake the Career assessment to generate v2 recommendations.
          </p>
        ) : latestCareerAssessment && !careerEvaluation.isComplete ? (
          <p className="mt-6 text-sm leading-6 text-white/55">
            Your saved Career assessment does not contain all expected answers. Complete it again to generate recommendations.
          </p>
        ) : latestCareerAssessment ? (
          <p className="mt-6 text-sm leading-6 text-white/55">
            No remaining scored gaps in your current Career assessment — strong work. Retake it any time to track your progress.
          </p>
        ) : (
          <p className="mt-6 text-sm leading-6 text-white/55">
            Complete the Career assessment to receive personalized next steps.
          </p>
        )}
      </section>

      {/* Assessment entry points */}
      <section className="mt-10 border border-white/15 bg-white/[0.03] p-6 sm:p-9">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-indigo-300">
          YOUR NEXT STEP
        </p>

        <h2 className="mt-4 text-2xl font-medium uppercase">
          Keep building your readiness.
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
          Continue developing your skills, collect evidence of your progress,
          and revisit your assessments as you improve.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/assessment/ai-skills"
            className="group inline-flex items-center gap-5 border border-white/70 px-6 py-4 text-[10px] font-bold tracking-[0.14em] transition-colors hover:bg-white hover:text-black"
          >
            {latestAiAssessment
              ? "RETAKE AI SKILLS ASSESSMENT"
              : "START AI SKILLS ASSESSMENT"}
            <span className="text-base transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>

          <a
            href="/assessment/coding"
            className="group inline-flex items-center gap-5 border border-emerald-400/70 px-6 py-4 text-[10px] font-bold tracking-[0.14em] text-emerald-300 transition-colors hover:bg-emerald-400 hover:text-black"
          >
            {latestCodingAssessment
              ? "RETAKE CODING ASSESSMENT"
              : "START CODING ASSESSMENT"}
            <span className="text-base transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>

          <a
            href="/assessment/career"
            className="group inline-flex items-center gap-5 border border-amber-400/70 px-6 py-4 text-[10px] font-bold tracking-[0.14em] text-amber-300 transition-colors hover:bg-amber-400 hover:text-black"
          >
            {latestCareerAssessment
              ? "RETAKE CAREER ASSESSMENT"
              : "START CAREER ASSESSMENT"}
            <span className="text-base transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </section>
    </>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/15">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-10">
          <a
            href="/"
            className="text-xl font-extrabold tracking-[-0.06em]"
          >
            ZILIGO<span className="text-indigo-400">.</span>
          </a>

          <a
            href="/"
            className="text-xs font-semibold tracking-widest text-white/60 transition hover:text-white"
          >
            HOME ↗
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 sm:py-16">
        <p className="text-[10px] font-semibold tracking-[0.25em] text-indigo-300">
          STUDENT DASHBOARD / PRIVATE
        </p>

        <h1 className="mt-6 max-w-4xl text-4xl font-medium uppercase leading-tight tracking-[-0.045em] sm:text-6xl">
          YOUR NEXT MOVE
          <br />
          <span className="text-white/45">STARTS HERE.</span>
        </h1>

        <Suspense fallback={<DashboardFallback />}>
          <AuthenticatedDashboard />
        </Suspense>
      </div>

      <footer className="border-t border-white/15 px-6 py-6 sm:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold tracking-tight">
            ZILIGO<span className="text-indigo-400">.</span>
          </p>

          <p className="text-[10px] tracking-widest text-white/40">
            MEASURE READINESS. CLOSE GAPS. BUILD YOUR FUTURE.
          </p>
        </div>
      </footer>
    </main>
  );
}