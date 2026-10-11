
import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const requestedNext =
    requestUrl.searchParams.get("next") ?? "/dashboard";

  // Allow redirects only to this application.
  const destination = new URL(requestedNext, requestUrl.origin);

  const safeDestination =
    destination.origin === requestUrl.origin
      ? destination
      : new URL("/dashboard", requestUrl.origin);

  if (code) {
    const supabase = await createClient();

    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(safeDestination);
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=auth-code-error", requestUrl.origin)
  );
}
