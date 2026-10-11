
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

type AnswerValue =
  | "not_yet"
  | "with_guidance"
  | "independently"
  | "with_evidence";

const ASSESSMENT_VERSION = "2.0";

const LEVELS: {
  value: AnswerValue;
  title: string;
  description: string;
}[] = [
  {
    value: "not_yet",
    title: "Not yet",
    description:
      "I cannot complete this task yet, or I have not tried it.",
  },
  {
    value: "with_guidance",
    title: "With guidance",
    description:
      "I can complete parts of this task using examples, templates, or feedback.",
  },
  {
    value: "independently",
    title: "Independently",
    description:
      "I can complete this task myself and explain the choices I made.",
  },
  {
    value: "with_evidence",
    title: "With evidence",
    description:
      "I can show a real artifact or example and explain the result and my contribution.",
  },
];

const QUESTIONS = [
  {
    id: "resume_quality",
    title: "Scenario: You find an internship that matches your interests.",
    description:
      "You must submit a resume for the role. Can you select relevant projects and skills, describe your contributions accurately, and tailor the resume to the job requirements without inventing experience?",
  },
  {
    id: "project_evidence",
    title: "Scenario: An interviewer asks you to prove a technical skill.",
    description:
      "You mention a project on your resume. Can you show its code, explain your own contribution and technical decisions, discuss a challenge, and provide verifiable results where available?",
  },
  {
    id: "professional_presence",
    title: "Scenario: A recruiter opens your professional profiles.",
    description:
      "Your GitHub, LinkedIn, resume, and portfolio should accurately represent your experience. Can you maintain consistent information, working links, useful project descriptions, and clear evidence of your work?",
  },
  {
    id: "communication",
    title: "Scenario: You must explain a project to someone unfamiliar with it.",
    description:
      "Can you explain the problem, your approach, the alternatives you considered, the outcome, and what you would improve next, adjusting your explanation to the audience?",
  },
  {
    id: "target_role_alignment",
    title: "Scenario: You want to apply for a specific software or AI role.",
    description:
      "Can you analyze a real job description, identify its required skills, compare those requirements with your current evidence, prioritize gaps, and create a practical learning and project plan?",
  },
];

function checkHttpsUrl(value: string): {
  valid: boolean;
  url: string;
} {
  const trimmed = value.trim();

  if (trimmed === "") {
    return { valid: true, url: "" };
  }

  try {
    const parsed = new URL(trimmed);

    if (parsed.protocol !== "https:") {
      return { valid: false, url: "" };
    }

    return { valid: true, url: parsed.toString() };
  } catch {
    return { valid: false, url: "" };
  }
}

export default function CareerAssessmentPage() {
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const answeredCount = QUESTIONS.filter(
    (question) => answers[question.id] !== undefined
  ).length;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (answeredCount !== QUESTIONS.length) {
      setErrorMessage("Please answer all five questions before submitting.");
      return;
    }

    const github = checkHttpsUrl(githubUrl);
    const linkedin = checkHttpsUrl(linkedinUrl);
    const portfolio = checkHttpsUrl(portfolioUrl);

    if (!github.valid || !linkedin.valid || !portfolio.valid) {
      setErrorMessage(
        "Each evidence link must be a full address starting with https://"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      const { error: saveError } = await supabase
        .from("assessment_attempts")
        .insert({
          user_id: user.id,
          assessment_type: "career",
          answers: {
            ...answers,
            _assessmentVersion: ASSESSMENT_VERSION,
          },
          evidence_links: {
            github: github.url,
            linkedin: linkedin.url,
            portfolio: portfolio.url,
          },
          completed_at: new Date().toISOString(),
        });

      if (saveError) {
        setErrorMessage(
          `Your Career assessment could not be saved. ${saveError.message}`
        );
        return;
      }

      setSuccessMessage(
        "Your Career Readiness assessment has been saved successfully. Your answers are ready for evaluation."
      );
    } catch {
      setErrorMessage(
        "We couldn't connect to the assessment service. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/15">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <a href="/" className="text-xl font-extrabold tracking-[-0.06em]">
            ZILIGO<span className="text-indigo-400">.</span>
          </a>

          <a
            href="/dashboard"
            className="text-xs font-semibold tracking-widest text-white/60 transition hover:text-white"
          >
            DASHBOARD ↗
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <p className="text-[10px] font-semibold tracking-[0.25em] text-amber-300">
          ASSESSMENT 03 / CAREER / V2.0
        </p>

        <h1 className="mt-6 text-4xl font-medium uppercase leading-tight tracking-[-0.045em] sm:text-6xl">
          PREPARE FOR
          <br />
          <span className="text-white/45">YOUR NEXT MOVE.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
          Work through realistic career scenarios. Choose the level that best
          reflects what you can currently do and demonstrate, not what you
          hope to achieve.
        </p>

        <section className="mt-10 border border-white/15 bg-white/[0.03] p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold tracking-widest text-white/70">
              YOUR PROGRESS
            </p>
            <p className="text-xs tabular-nums text-amber-300">
              {answeredCount} / {QUESTIONS.length} ANSWERED
            </p>
          </div>

          <div
            className="mt-4 h-1.5 overflow-hidden bg-white/10"
            role="progressbar"
            aria-label="Career assessment completion"
            aria-valuemin={0}
            aria-valuemax={QUESTIONS.length}
            aria-valuenow={answeredCount}
          >
            <div
              className="h-full bg-amber-400 transition-all duration-300"
              style={{
                width: `${(answeredCount / QUESTIONS.length) * 100}%`,
              }}
            />
          </div>
        </section>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {QUESTIONS.map((question, index) => (
            <fieldset
              key={question.id}
              className="border border-white/15 bg-white/[0.02] p-5 sm:p-7"
            >
              <legend className="sr-only">{question.title}</legend>

              <p className="text-[10px] font-semibold tracking-[0.2em] text-amber-300">
                QUESTION {String(index + 1).padStart(2, "0")}
              </p>

              <h2 className="mt-4 text-xl font-semibold leading-snug sm:text-2xl">
                {question.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/55">
                {question.description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {LEVELS.map((level) => {
                  const inputId = `${question.id}-${level.value}`;
                  const selected = answers[question.id] === level.value;

                  return (
                    <label
                      key={level.value}
                      htmlFor={inputId}
                      className={`flex cursor-pointer items-start gap-3 border p-4 transition ${
                        selected
                          ? "border-amber-400 bg-amber-400/10"
                          : "border-white/15 hover:border-white/40"
                      }`}
                    >
                      <input
                        id={inputId}
                        type="radio"
                        name={question.id}
                        value={level.value}
                        required
                        checked={selected}
                        onChange={() => {
                          setAnswers((current) => ({
                            ...current,
                            [question.id]: level.value,
                          }));
                        }}
                        className="mt-1 accent-amber-400"
                      />

                      <span>
                        <span className="block text-sm font-semibold">
                          {level.title}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-white/50">
                          {level.description}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <fieldset className="border border-white/15 bg-white/[0.02] p-5 sm:p-7">
            <legend className="sr-only">Evidence links</legend>

            <p className="text-[10px] font-semibold tracking-[0.2em] text-amber-300">
              EVIDENCE LINKS (OPTIONAL)
            </p>

            <h2 className="mt-4 text-xl font-semibold leading-snug sm:text-2xl">
              Show your proof
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/55">
              Add links to relevant work that can help verify your responses.
              Each supplied link must start with https://
            </p>

            <div className="mt-6 space-y-3">
              <div>
                <label
                  htmlFor="github-url"
                  className="block text-xs font-semibold tracking-widest text-white/60"
                >
                  GITHUB
                </label>
                <input
                  id="github-url"
                  type="url"
                  value={githubUrl}
                  onChange={(event) => setGithubUrl(event.target.value)}
                  placeholder="https://github.com/your-username"
                  className="mt-2 w-full border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="linkedin-url"
                  className="block text-xs font-semibold tracking-widest text-white/60"
                >
                  LINKEDIN
                </label>
                <input
                  id="linkedin-url"
                  type="url"
                  value={linkedinUrl}
                  onChange={(event) => setLinkedinUrl(event.target.value)}
                  placeholder="https://linkedin.com/in/your-name"
                  className="mt-2 w-full border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="portfolio-url"
                  className="block text-xs font-semibold tracking-widest text-white/60"
                >
                  PORTFOLIO OR RESUME
                </label>
                <input
                  id="portfolio-url"
                  type="url"
                  value={portfolioUrl}
                  onChange={(event) => setPortfolioUrl(event.target.value)}
                  placeholder="https://your-portfolio-or-resume-link"
                  className="mt-2 w-full border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </fieldset>

          {errorMessage && (
            <p
              role="alert"
              className="border border-red-400/30 bg-red-400/10 p-4 text-sm leading-6 text-red-300"
            >
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <div
              role="status"
              className="border border-emerald-400/30 bg-emerald-400/10 p-5"
            >
              <p className="font-semibold text-emerald-300">
                ASSESSMENT SAVED
              </p>

              <p className="mt-2 text-sm leading-6 text-white/70">
                {successMessage}
              </p>

              <a
                href="/dashboard"
                className="mt-4 inline-block text-sm font-semibold text-white underline underline-offset-4"
              >
                Return to dashboard →
              </a>
            </div>
          )}

          {!successMessage && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-between bg-white px-6 py-5 text-xs font-bold tracking-[0.14em] text-black transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>
                {isSubmitting
                  ? "SAVING YOUR ANSWERS..."
                  : "SUBMIT CAREER ASSESSMENT"}
              </span>
              <span className="text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          )}
        </form>

        <p className="mt-8 text-xs leading-6 text-white/40">
          This is a self-assessment baseline, not an independently verified
          measure of employability. Evidence links are optional and are not
          automatically verified. Your responses are saved to your signed-in
          account for evaluation.
        </p>
      </div>

      <footer className="border-t border-white/15 px-6 py-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <p className="text-sm font-bold tracking-tight">
            ZILIGO<span className="text-indigo-400">.</span>
          </p>
          <p className="text-right text-[9px] tracking-widest text-white/40">
            MEASURE READINESS. CLOSE GAPS.
          </p>
        </div>
      </footer>
    </main>
  );
}
