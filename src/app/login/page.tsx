"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

type AuthMode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const supabase = createClient();

      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        router.push("/dashboard");
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      setSuccessMessage(
        "Your account request was received. Check your email for a confirmation link before signing in."
      );
    } catch {
      setErrorMessage(
        "We couldn't connect to the authentication service. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setErrorMessage("");
    setSuccessMessage("");
  }

  async function handleOAuth(provider: "google" | "github") {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
      }
      // On success the browser leaves for Google/GitHub, so nothing else runs here.
    } catch {
      setErrorMessage("We couldn't start the sign-in. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-5 py-12 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,_rgba(79,70,229,0.18),_transparent_60%)]"
      />

      <div className="relative z-10 w-full max-w-md">
        <header className="mb-10 flex items-center justify-between">
          <a
            href="/"
            className="text-lg font-extrabold tracking-[-0.06em]"
          >
            ZILIGO
            <span className="text-indigo-400">.</span>
          </a>

          <a
            href="/"
            className="text-xs tracking-widest text-white/50 transition hover:text-white"
          >
            HOME ↗
          </a>
        </header>

        <section className="border border-white/15 bg-white/[0.03] p-6 sm:p-9">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-indigo-300">
            YOUR CAREER. YOUR DIRECTION.
          </p>

          <h1 className="mt-5 text-3xl font-medium uppercase tracking-tight sm:text-4xl">
            {mode === "signin" ? "WELCOME BACK." : "START YOUR NEXT CHAPTER."}
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/55">
            {mode === "signin"
              ? "Sign in to continue building your career readiness."
              : "Create your account to begin your Ziligo journey."}
          </p>

          <div className="mt-8 grid grid-cols-2 border border-white/15 p-1">
            <button
              type="button"
              onClick={() => changeMode("signin")}
              disabled={loading}
              className={`px-3 py-3 text-xs font-semibold transition ${
                mode === "signin"
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              SIGN IN
            </button>

            <button
              type="button"
              onClick={() => changeMode("signup")}
              disabled={loading}
              className={`px-3 py-3 text-xs font-semibold transition ${
                mode === "signup"
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              CREATE ACCOUNT
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-semibold tracking-wider text-white/75"
              >
                EMAIL ADDRESS
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={loading}
                placeholder="you@example.com"
                className="w-full border border-white/20 bg-black px-4 py-3.5 text-sm outline-none transition placeholder:text-white/25 focus:border-indigo-400 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-semibold tracking-wider text-white/75"
              >
                PASSWORD
              </label>

              <input
                id="password"
                type="password"
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                disabled={loading}
                placeholder="At least 8 characters"
                className="w-full border border-white/20 bg-black px-4 py-3.5 text-sm outline-none transition placeholder:text-white/25 focus:border-indigo-400 disabled:opacity-50"
              />
            </div>

            {errorMessage && (
              <p
                role="alert"
                className="border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300"
              >
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p
                role="status"
                className="border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm leading-6 text-emerald-300"
              >
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-between bg-white px-5 py-4 text-xs font-bold tracking-[0.12em] text-black transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>
                {loading
                  ? "PLEASE WAIT..."
                  : mode === "signin"
                    ? "SIGN IN TO YOUR ACCOUNT"
                    : "CREATE YOUR ACCOUNT"}
              </span>

              <span className="text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-white/15" />
            <span className="text-[10px] tracking-[0.2em] text-white/40">
              OR
            </span>
            <span className="h-px flex-1 bg-white/15" />
          </div>

          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={loading}
              className="w-full border border-white/20 px-5 py-3.5 text-xs font-semibold tracking-[0.12em] transition hover:border-white/50 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              CONTINUE WITH GOOGLE
            </button>

            <button
              type="button"
              onClick={() => handleOAuth("github")}
              disabled={loading}
              className="w-full border border-white/20 px-5 py-3.5 text-xs font-semibold tracking-[0.12em] transition hover:border-white/50 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              CONTINUE WITH GITHUB
            </button>
          </div>

          <p className="mt-6 text-xs leading-5 text-white/40">
            Your account will be handled by Supabase Authentication.
            Never share your password with anyone.
          </p>
        </section>

        <p className="mt-6 text-center text-[10px] tracking-[0.14em] text-white/30">
          ZILIGO · MEASURE READINESS. CLOSE GAPS.
        </p>
      </div>
    </main>
  );
}