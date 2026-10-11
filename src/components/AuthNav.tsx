import { connection } from "next/server";
import { createClient } from "../lib/supabase/server";

// Shows "Dashboard" + "Log out" when signed in, and a sign-up link when not.
// It reads the session on the server, so it must be wrapped in <Suspense>
// wherever it is used (the same pattern as the dashboard).
export default async function AuthNav() {
  await connection();

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const signedIn = !error && Boolean(data?.claims?.sub);

  if (signedIn) {
    return (
      <div className="flex items-center gap-3">
        <a
          href="/dashboard"
          className="border border-white/70 px-5 py-3 text-[10px] font-bold tracking-[0.14em] transition-colors hover:bg-white hover:text-black"
        >
          DASHBOARD
        </a>

        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="px-3 py-3 text-[10px] font-bold tracking-[0.14em] text-white/60 transition-colors hover:text-white"
          >
            LOG OUT
          </button>
        </form>
      </div>
    );
  }

  return (
    <a
      href="/login"
      className="border border-white/70 px-5 py-3 text-[10px] font-bold tracking-[0.14em] transition-colors hover:bg-white hover:text-black"
    >
      SIGN UP / LOG IN
    </a>
  );
}