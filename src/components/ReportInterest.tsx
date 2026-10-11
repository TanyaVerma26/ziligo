
"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/client";

export default function ReportInterest() {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  async function handleInterestClick() {
    setMessage("");
    setError(false);

    const supabase = createClient();

    const { error: insertError } = await supabase
      .from("report_interest_events")
      .insert({ event_type: "click" });

    if (insertError) {
      setError(true);
      setMessage("We couldn't record your interest. Please try again.");
      return;
    }

    setShowForm(true);
    setMessage("Thanks for your interest! The report is still being explored.");
  }

  async function handleEmailSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError(false);

    const supabase = createClient();

    const { error: insertError } = await supabase
      .from("report_interest_events")
      .insert({
        event_type: "email_signup",
        email: email.trim(),
      });

    setLoading(false);

    if (insertError) {
      setError(true);
      setMessage("We couldn't save your email. Please try again.");
      return;
    }

    setMessage("Thank you! Your interest has been recorded.");
    setEmail("");
  }

  return (
    <section
      aria-labelledby="report-interest-heading"
      className="mx-auto w-full max-w-4xl px-6 py-16"
    >
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-indigo-300">
          In development
        </p>

        <h2
          id="report-interest-heading"
          className="text-2xl font-semibold text-white sm:text-3xl"
        >
          Want a deeper picture of your career readiness?
        </h2>

        <p className="mt-4 max-w-2xl leading-7 text-white/70">
          We’re exploring a personalized report with insights into your
          AI skills, coding ability, and career preparation. It isn’t
          available yet, and we’re not accepting payments.
        </p>

        <button
          type="button"
          onClick={handleInterestClick}
          disabled={showForm}
          className="mt-7 rounded-full bg-indigo-500 px-6 py-3 font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {showForm ? "Interest recorded" : "I'm interested"}
        </button>

        {message && (
          <p
            role="status"
            className={`mt-4 text-sm ${
              error ? "text-red-300" : "text-green-300"
            }`}
          >
            {message}
          </p>
        )}

        {showForm && (
          <form onSubmit={handleEmailSubmit} className="mt-8 max-w-md">
            <label
              htmlFor="report-interest-email"
              className="mb-2 block text-sm text-white/80"
            >
              Email address (optional)
            </label>

            <input
              id="report-interest-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              maxLength={254}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-indigo-400"
            />

            <p className="mt-3 text-sm leading-6 text-white/60">
              If you provide your email, you agree that we may contact
              you to let you know if this report becomes available.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Notify me if it launches"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
