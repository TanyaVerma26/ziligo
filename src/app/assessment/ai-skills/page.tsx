
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
      "I can complete parts of this task using examples, instructions, or feedback.",
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
      "I can demonstrate the result using a real example, tested output, or project artifact.",
  },
];

const QUESTIONS = [
  {
    id: "ai_tool_usage",
    title: "Scenario: You need to complete an unfamiliar task using AI.",
    description:
      "You must research a topic, understand an unfamiliar programming concept, or create a useful document. Can you select a suitable AI tool, provide the necessary context, evaluate its output, and produce a useful final result?",
  },
  {
    id: "prompt_quality",
    title: "Scenario: Your first AI response is vague or incorrect.",
    description:
      "Can you improve your prompt by defining the objective, adding relevant context, setting constraints, specifying the desired format, and refining your instructions based on the response?",
  },
  {
    id: "fact_verification",
    title: "Scenario: AI gives you a convincing answer containing factual claims.",
    description:
      "Before relying on the answer, can you identify claims that need verification, check reliable primary or authoritative sources, test code when relevant, and correct unsupported or incorrect information?",
  },
  {
    id: "ai_safety",
    title: "Scenario: You want AI to analyze a document or help with a decision.",
    description:
      "Can you identify confidential or personal information that should not be shared, recognize potential bias or harmful output, protect sensitive data, and decide when human judgment or expert review is necessary?",
  },
  {
    id: "ai_workflow",
    title: "Scenario: You must deliver a complete project with AI assistance.",
    description:
      "Can you break the work into steps, use AI where it adds value, independently review important outputs, test the result against requirements, document limitations, and deliver a final product that you understand?",
  },
];

export default function AISkillsAssessmentPage() {
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
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
          assessment_type: "ai_skills",
          answers: {
            ...answers,
            _assessmentVersion: ASSESSMENT_VERSION,
          },
          completed_at: new Date().toISOString(),
        });

      if (saveError) {
        setErrorMessage(
          `Your AI Skills assessment could not be saved. ${saveError.message}`
        );
        return;
      }

      setSuccessMessage(
        "Your AI Skills assessment has been saved successfully. Your answers are ready for evaluation."
      );
    } catch {
      setErrorMessage(
        "Something went wrong while saving your assessment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/15">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <a
            href="/"
            className="text-xl font-extrabold tracking-[-0.06em]"
          >
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
        <p className="text-[10px] font-semibold tracking-[0.25em] text-indigo-300">
          ASSESSMENT 01 / AI SKILLS / V2.0
        </p>

        <h1 className="mt-6 text-4xl font-medium uppercase leading-tight tracking-[-0.045em] sm:text-6xl">
          UNDERSTAND
          <br />
          <span className="text-white/45">YOUR AI SKILLS.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
          Work through realistic AI scenarios. Choose the level that best
          reflects what you can currently do and demonstrate, not what you
          hope to learn.
        </p>

        <section className="mt-10 border border-white/15 bg-white/[0.03] p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold tracking-widest text-white/70">
              YOUR PROGRESS
            </p>

            <p className="text-xs tabular-nums text-indigo-300">
              {answeredCount} / {QUESTIONS.length} ANSWERED
            </p>
          </div>

          <div
            className="mt-4 h-1.5 overflow-hidden bg-white/10"
            role="progressbar"
            aria-label="AI Skills assessment completion"
            aria-valuemin={0}
            aria-valuemax={QUESTIONS.length}
            aria-valuenow={answeredCount}
          >
            <div
              className="h-full bg-indigo-400 transition-all duration-300"
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

              <p className="text-[10px] font-semibold tracking-[0.2em] text-indigo-300">
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
                          ? "border-indigo-400 bg-indigo-400/10"
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
                        className="mt-1 accent-indigo-400"
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
              className="group flex w-full items-center justify-between bg-white px-6 py-5 text-xs font-bold tracking-[0.14em] text-black transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>
                {isSubmitting
                  ? "SAVING YOUR ANSWERS..."
                  : "SUBMIT AI SKILLS ASSESSMENT"}
              </span>

              <span className="text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          )}
        </form>

        <p className="mt-8 text-xs leading-6 text-white/40">
          This is a self-assessment baseline, not an independently verified
          measure of AI proficiency. Your responses are saved to your signed-in
          account. A high self-reported score does not independently prove
          accuracy, safety, or practical ability.
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
