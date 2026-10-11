
import type { AssessmentQuestion } from "./assessment-question-bank";

export const ASSESSMENT_VERSION = "2.0";

const SCORE_VALUES = {
  not_yet: 0,
  with_guidance: 1,
  independently: 2,
  with_evidence: 3,
} as const;

const NOT_OBSERVED = "not_observed";
const MAX_POINTS_PER_QUESTION = 3;

export interface AssessmentEvaluation {
  isCurrentVersion: boolean;
  isComplete: boolean;
  ratedCount: number;
  totalQuestions: number;
  score: number | null;
  maxScore: number | null;
  percentage: number | null;
  claimedEvidenceCount: number;
  verifiedEvidenceCount: number;
  pointsByQuestionId: Record<string, number | null>;
}

function toAnswersRecord(
  savedAnswers: unknown
): Record<string, unknown> | null {
  if (
    savedAnswers === null ||
    typeof savedAnswers !== "object" ||
    Array.isArray(savedAnswers)
  ) {
    return null;
  }

  return savedAnswers as Record<string, unknown>;
}

export function evaluateAssessment(
  savedAnswers: unknown,
  questions: readonly AssessmentQuestion[]
): AssessmentEvaluation {
  const answersObject = toAnswersRecord(savedAnswers);

  const isCurrentVersion =
    answersObject?._assessmentVersion === ASSESSMENT_VERSION;

  const isComplete =
    answersObject !== null &&
    questions.every((question) => {
      const value = answersObject[question.id];

      return (
        typeof value === "string" &&
        (value === NOT_OBSERVED ||
          Object.prototype.hasOwnProperty.call(SCORE_VALUES, value))
      );
    });

  if (answersObject === null || !isComplete) {
    return {
      isCurrentVersion,
      isComplete: false,
      ratedCount: 0,
      totalQuestions: questions.length,
      score: null,
      maxScore: null,
      percentage: null,
      claimedEvidenceCount: 0,
      verifiedEvidenceCount: 0,
      pointsByQuestionId: {},
    };
  }

  const pointsByQuestionId: Record<string, number | null> = {};

  let score = 0;
  let ratedCount = 0;
  let claimedEvidenceCount = 0;

  for (const question of questions) {
    const value = answersObject[question.id] as string;

    if (value === NOT_OBSERVED) {
      // Not observed means the skill is unknown, not a zero score.
      pointsByQuestionId[question.id] = null;
      continue;
    }

    const points = SCORE_VALUES[value as keyof typeof SCORE_VALUES];

    pointsByQuestionId[question.id] = points;
    score += points;
    ratedCount += 1;

    if (value === "with_evidence") {
      claimedEvidenceCount += 1;
    }
  }

  const maxScore = ratedCount * MAX_POINTS_PER_QUESTION;

  return {
    isCurrentVersion,
    isComplete: true,
    ratedCount,
    totalQuestions: questions.length,
    score,
    maxScore,
    percentage:
      maxScore === 0 ? null : Math.round((score / maxScore) * 100),
    claimedEvidenceCount,

    // Evidence verification is not implemented yet.
    // Self-reported answers must never count as verified evidence.
    verifiedEvidenceCount: 0,

    pointsByQuestionId,
  };
}

export function getAssessmentStatus(
  hasQueryError: boolean,
  hasAttempt: boolean,
  evaluation: AssessmentEvaluation
): string {
  if (hasQueryError) {
    return "STATUS: UNAVAILABLE";
  }

  if (!hasAttempt) {
    return "STATUS: NOT ASSESSED";
  }

  if (!evaluation.isCurrentVersion) {
    return "STATUS: UPDATE REQUIRED";
  }

  if (!evaluation.isComplete) {
    return "STATUS: INCOMPLETE";
  }

  return "STATUS: ASSESSED";
}

export function getScoreLabel(
  hasQueryError: boolean,
  hasAttempt: boolean,
  evaluation: AssessmentEvaluation
): string {
  if (hasQueryError) {
    return "Score could not be loaded. Please refresh the dashboard and try again.";
  }

  if (!hasAttempt) {
    return "";
  }

  if (!evaluation.isCurrentVersion) {
    return "UPDATE REQUIRED — retake this assessment to view your v2 score.";
  }

  if (
    !evaluation.isComplete ||
    evaluation.score === null ||
    evaluation.maxScore === null ||
    evaluation.percentage === null
  ) {
    return "Assessment saved, but answers are incomplete or invalid.";
  }

  return (
    `SELF-REPORTED BASELINE: ${evaluation.score}/${evaluation.maxScore} ` +
    `(${evaluation.percentage}%) · RATED ITEMS: ${evaluation.ratedCount}/` +
    `${evaluation.totalQuestions} · EVIDENCE CLAIMS: ` +
    `${evaluation.claimedEvidenceCount} · VERIFIED EVIDENCE: ` +
    `${evaluation.verifiedEvidenceCount}`
  );
}

export interface ImprovementArea {
  questionId: string;
  title: string;
  points: number | null;
  recommendation: string;
}

export function getImprovementAreas(
  evaluation: AssessmentEvaluation,
  questions: readonly AssessmentQuestion[]
): ImprovementArea[] {
  if (!evaluation.isComplete) {
    return [];
  }

  return questions
    .map((question) => ({
      questionId: question.id,
      title: question.title,
      points: evaluation.pointsByQuestionId[question.id] ?? null,
      recommendation: question.recommendation,
    }))
    .sort((a, b) => {
      // Show unknown skills before the lowest-rated skills.
      if (a.points === null && b.points === null) {
        return 0;
      }

      if (a.points === null) {
        return -1;
      }

      if (b.points === null) {
        return 1;
      }

      return a.points - b.points;
    })
    .slice(0, 2);
}
