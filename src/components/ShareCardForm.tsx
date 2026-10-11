"use client";

import { useActionState } from "react";
import { createShareCard, type CreateCardResult } from "../app/dashboard/actions";

export default function ShareCardForm({ ready }: { ready: boolean }) {
  const [state, formAction, pending] = useActionState<
    CreateCardResult | null,
    FormData
  >(createShareCard, null);

  if (!ready) {
    return (
      <p className="mt-6 text-sm text-white/55">
        Finish all 3 assessments (current version) to unlock your card.
      </p>
    );
  }

  const link =
    state?.ok && typeof window !== "undefined"
      ? `${window.location.origin}/card/${state.id}`
      : null;

  return (
    <form action={formAction} className="mt-6 flex flex-wrap items-end gap-3">
      <div>
        <label
          htmlFor="handle"
          className="mb-2 block text-[10px] font-semibold tracking-[0.2em] text-white/50"
        >
          YOUR HANDLE
        </label>
        <input
          id="handle"
          name="handle"
          required
          maxLength={21}
          placeholder="@yourname"
          className="border border-white/20 bg-black px-4 py-3 text-sm outline-none focus:border-indigo-400"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="border border-white/70 px-6 py-3.5 text-[10px] font-bold tracking-[0.14em] transition-colors hover:bg-white hover:text-black disabled:opacity-50"
      >
        {pending ? "CREATING..." : "CREATE MY CARD →"}
      </button>

      {state && !state.ok && (
        <p role="alert" className="w-full text-sm text-red-300">
          {state.message}
        </p>
      )}

      {link && (
        <div className="w-full text-sm">
          <p className="text-emerald-300">Your card is ready:</p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-indigo-300 underline underline-offset-4"
          >
            {link}
          </a>
        </div>
      )}
    </form>
  );
}