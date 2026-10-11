"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

type AnswerValue =
  | "not_yet"
  | "with_guidance"
  | "independently"
  | "with_evidence";

const LEVELS: {
  value: AnswerValue;
  title: string;
  description: string;
}[] = [
  {
    value: "not_yet",
    title: "Not yet",
    description:
      "I have not successfully completed this task yet, even after trying.",
  },
  {
    value: "with_guidance",
    title: "With guidance",
    description:
      "I can make progress using examples, tutorials, hints, or step-by-step help.",
  },
  {
    value: "independently",
    title: "Independently",
    description:
      "I can complete a similar task on my own and explain why my solution works.",
  },
  {
    value: "with_evidence",
    title: "With evidence",
    description:
      "I can show a working solution, relevant tests, or a project and explain my decisions.",
  },
];

const QUESTIONS = [
  {
    id: "problem_decomposition",
    title: "Scenario 1: Break down an unfamiliar problem",
    description:
      "You receive an array of integers and a target value. Your task is to return the indices of two numbers that add up to the target. Before writing code, consider how you identify inputs and outputs, break the task into steps, and check your plan with an example.",
  },
  {
    id: "programming_fundamentals",
    title: "Scenario 2: Build a reliable Java program",
    description:
      "You need to write a Java program that accepts input, uses conditions and loops, and produces the expected result. You must also consider invalid or missing input. How well can you implement the logic, organize it into methods, and explain what each part does?",
  },
  {
    id: "data_structures_algorithms",
    title: "Scenario 3: Improve a slow solution",
    description:
      "Your solution works on small arrays but becomes slow on large inputs because it uses nested loops. Consider how you would compare alternative approaches, choose an appropriate data structure, check correctness, and explain time and space complexity.",
  },
  {
    id: "debugging_testing",
    title: "Scenario 4: Find and fix a hidden bug",
    description:
      "Your program passes normal examples but fails for an empty array, duplicate values, or an unexpected input. Consider how you would reproduce the failure, trace the cause, make a targeted fix, and test both normal and edge cases.",
  },
  {
    id: "project_implementation",
    title: "Scenario 5: Demonstrate a working project",
    description:
      "You have implemented a feature for a small application. Another developer needs to understand and run your work. Consider whether you can verify the feature, explain your design decisions, track changes with Git, and provide a useful README or tests.",
  },
];

export default function CodingAssessmentPage() {
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
          assessment_type: "coding",
          answers: {
            ...answers,
            _assessmentVersion: "2.0",
          },
          completed_at: new Date().toISOString(),
        });

      if (saveError) {
        setErrorMessage(
          `Your Coding assessment could not be saved. ${saveError.message}`
        );
        return;
      }

      setSuccessMessage(
        "Your Coding assessment has been saved successfully. Your answers are ready for evaluation."
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
        <p className="text-[10px] font-semibold tracking-[0.25em] text-emerald-300">
          ASSESSMENT 02 / CODING
        </p>

        <h1 className="mt-6 text-4xl font-medium uppercase leading-tight tracking-[-0.045em] sm:text-6xl">
          UNDERSTAND
          <br />
          <span className="text-white/45">YOUR CODING SKILLS.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
          Reflect on how you would handle realistic programming tasks.
          Choose the answer that best matches your current experience and
          the work you can demonstrate—not what you hope to learn.
        </p>

        <section className="mt-10 border border-white/15 bg-white/[0.03] p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold tracking-widest text-white/70">
              YOUR PROGRESS
            </p>

            <p className="text-xs tabular-nums text-emerald-300">
              {answeredCount} / {QUESTIONS.length} ANSWERED
            </p>
          </div>

          <div
            className="mt-4 h-1.5 overflow-hidden bg-white/10"
            role="progressbar"
            aria-label="Coding assessment completion"
            aria-valuemin={0}
            aria-valuemax={QUESTIONS.length}
            aria-valuenow={answeredCount}
          >
            <div
              className="h-full bg-emerald-400 transition-all duration-300"
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

              <p className="text-[10px] font-semibold tracking-[0.2em] text-emerald-300">
                QUESTION {String(index + 1).padStart(2, "0")}
              </p>

              <h2 className="mt-4 text-xl font-semibold leading-snug sm:text-2xl">
                {question.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/65">
                {question.description}
              </p>

              <p className="mt-5 text-xs font-semibold tracking-wide text-white/50">
                SELECT THE LEVEL THAT BEST MATCHES YOUR CURRENT ABILITY
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {LEVELS.map((level) => {
                  const inputId = `${question.id}-${level.value}`;
                  const selected = answers[question.id] === level.value;

                  return (
                    <label
                      key={level.value}
                      htmlFor={inputId}
                      className={`flex cursor-pointer items-start gap-3 border p-4 transition ${
                        selected
                          ? "border-emerald-400 bg-emerald-400/10"
                          : "border-white/15 hover:border-white/40"
                      }`}
                    >
                      <input
                        id={inputId}
                        type="radio"
                        name={question.id}
                        value={level.value}
                        checked={selected}
                        required
                        onChange={() => {
                          setAnswers((current) => ({
                            ...current,
                            [question.id]: level.value,
                          }));
                        }}
                        className="mt-1 accent-emerald-400"
                      />

                      <span>
                        <span className="block text-sm font-semibold">
                          {level.title}
                        </span>

                        <span className="mt-1 block text-xs leading-5 text-white/60">
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
              className="border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300"
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
              className="group flex w-full items-center justify-between bg-white px-6 py-5 text-xs font-bold tracking-[0.14em] text-black transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>
                {isSubmitting
                  ? "SAVING YOUR ANSWERS..."
                  : "SUBMIT CODING ASSESSMENT"}
              </span>

              <span className="text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          )}
        </form>

        <p className="mt-8 text-xs leading-6 text-white/40">
          This assessment provides a self-reported baseline, not proof of
          programming ability. Stronger verification requires practical
          coding tasks, test results, or reviewable project evidence.
          Answers are saved to your signed-in account.
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