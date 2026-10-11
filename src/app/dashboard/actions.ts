"use server";

import { createClient } from "../../lib/supabase/server";
import { ASSESSMENT_QUESTION_BANK } from "../../lib/assessment-question-bank";
import { evaluateAssessment } from "../../lib/assessment-scoring";
import { getArchetype } from "../../lib/card-archetype";

export type CreateCardResult =
  | { ok: true; id: string }
  | { ok: false; message: string };

export async function createShareCard(
  _prev: CreateCardResult | null,
  formData: FormData
): Promise<CreateCardResult> {
  const rawHandle = String(formData.get("handle") ?? "")
    .trim()
    .replace(/^@+/, "");

  if (!/^[A-Za-z0-9_]{1,20}$/.test(rawHandle)) {
    return {
      ok: false,
      message: "Use 1-20 letters, numbers or underscores for your handle.",
    };
  }

  const supabase = await createClient();
  const { data: claims, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claims?.claims?.sub) {
    return { ok: false, message: "Please sign in again." };
  }

  const userId = claims.claims.sub;

  // Recompute scores on the server. Never trust numbers sent by the browser.
  const types = ["ai_skills", "coding", "career"] as const;
  const pcts: number[] = [];

  for (const type of types) {
    const { data } = await supabase
      .from("assessment_attempts")
      .select("answers")
      .eq("user_id", userId)
      .eq("assessment_type", type)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const evaluation = evaluateAssessment(
      data?.answers,
      ASSESSMENT_QUESTION_BANK[type]
    );

    if (
      !evaluation.isCurrentVersion ||
      !evaluation.isComplete ||
      evaluation.percentage === null
    ) {
      return {
        ok: false,
        message: "Complete all three current assessments to create your card.",
      };
    }

    pcts.push(evaluation.percentage);
  }

  const [ai, coding, career] = pcts;

  const { data: inserted, error } = await supabase
    .from("shared_cards")
    .insert({
      user_id: userId,
      display_name: rawHandle,
      ai_pct: ai,
      coding_pct: coding,
      career_pct: career,
      archetype: getArchetype(ai, coding, career),
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return { ok: false, message: "Couldn't create your card. Try again." };
  }

  return { ok: true, id: inserted.id };
}