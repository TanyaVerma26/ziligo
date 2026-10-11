
import { ImageResponse } from "next/og";
import { connection } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export const alt = "ZILIGO personalized skill scorecard";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Card = {
  display_name: string;
  ai_pct: number;
  coding_pct: number;
  career_pct: number;
  archetype: string;
};

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getCard(id: string): Promise<Card | null> {
  if (!UUID.test(id)) return null;

  await connection();

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_shared_card", {
    card_id: id,
  });

  if (error || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  return data[0] as Card;
}

function CatMascot() {
  return (
    <svg
      width="230"
      height="210"
      viewBox="0 0 240 220"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M48 86 L46 35 L91 59 Q120 44 149 59 L194 35 L191 88 Q204 112 188 137 Q171 160 120 160 Q69 160 51 137 Q36 112 48 86 Z"
        fill="#FFD84D"
        stroke="#171717"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M57 51 L79 65 L59 77 Z" fill="#FFFDF6" />
      <path d="M183 51 L161 65 L181 77 Z" fill="#FFFDF6" />

      <rect x="66" y="83" width="108" height="47" rx="13" fill="#171717" />
      <rect x="73" y="90" width="94" height="33" rx="8" fill="#2D2D2D" />

      <rect x="87" y="99" width="10" height="11" rx="2" fill="#FFFFFF" />
      <rect x="143" y="99" width="10" height="11" rx="2" fill="#FFFFFF" />
      <rect x="89" y="100" width="3" height="4" fill="#FFD84D" />
      <rect x="145" y="100" width="3" height="4" fill="#FFD84D" />

      <path d="M116 112 L124 112 L120 117 Z" fill="#FFD84D" />
      <path
        d="M120 117 Q111 126 105 118 M120 117 Q129 126 135 118"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <path
        d="M72 151 Q62 172 68 189 Q73 199 92 196 L148 196 Q167 199 173 189 Q179 170 168 151 Z"
        fill="#FFD84D"
        stroke="#171717"
        strokeWidth="3"
      />

      <ellipse cx="94" cy="190" rx="19" ry="9" fill="#FFFDF6" stroke="#171717" strokeWidth="2" />
      <ellipse cx="146" cy="190" rx="19" ry="9" fill="#FFFDF6" stroke="#171717" strokeWidth="2" />

      <path d="M120 45 V29" stroke="#171717" strokeWidth="3" />
      <rect x="112" y="18" width="16" height="13" rx="3" fill="#FFD84D" stroke="#171717" strokeWidth="2.5" />
      <rect x="118" y="22" width="4" height="4" fill="#171717" />

      <path d="M29 72 L34 84 L46 89 L34 94 L29 106 L24 94 L12 89 L24 84 Z" fill="#8AB4F8" />
      <path d="M204 73 L208 82 L217 86 L208 90 L204 99 L200 90 L191 86 L200 82 Z" fill="#C5A4FF" />
      <rect x="28" y="132" width="7" height="7" fill="#81C995" />
      <rect x="207" y="127" width="7" height="7" fill="#8AB4F8" />
    </svg>
  );
}

function ScorePanel({
  label,
  score,
  color,
}: {
  label: string;
  score: number | null;
  color: string;
}) {
  const validScore =
    score !== null && Number.isFinite(score)
      ? Math.round(Math.max(0, Math.min(100, score)))
      : null;

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        padding: "16px 20px",
        background: "#121620",
        border: "1px solid #292F3C",
        borderRadius: 15,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          letterSpacing: 1,
          color: "#AAB3C4",
          fontWeight: 700,
        }}
      >
        <span style={{ color, fontSize: 16 }}>●</span>
        {label}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 3,
          marginTop: 8,
          color: "#FFFFFF",
          fontSize: 37,
          fontWeight: 900,
          letterSpacing: -1.5,
        }}
      >
        {validScore === null ? "—" : validScore}
        {validScore !== null && (
          <span style={{ fontSize: 18, fontWeight: 600 }}>%</span>
        )}
      </div>

      <div
        style={{
          height: 6,
          marginTop: 12,
          background: "#292F3C",
          borderRadius: 99,
          overflow: "hidden",
          display: "flex",
        }}
      >
        <div
          style={{
            width: `${validScore ?? 0}%`,
            height: 6,
            background: color,
            borderRadius: 99,
            display: "flex",
          }}
        />
      </div>
    </div>
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const card = await getCard(id);

  const clamp = (value: number | null | undefined) =>
    typeof value === "number" && Number.isFinite(value)
      ? Math.round(Math.max(0, Math.min(100, value)))
      : null;

  const ai = clamp(card?.ai_pct);
  const coding = clamp(card?.coding_pct);
  const career = clamp(card?.career_pct);

  const handle = card ? `@${card.display_name}` : "ZILIGO MEMBER";
  const archetype = card?.archetype ?? "YOUR ARCHETYPE";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "34px 44px 24px",
          background: "#05060A",
          color: "#FFFFFF",
          fontFamily: "Arial, Helvetica, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle dark technical grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            opacity: 0.035,
          }}
        />

        {/* Restrained blue ambient glow */}
        <div
          style={{
            position: "absolute",
            right: 50,
            top: -150,
            width: 440,
            height: 440,
            borderRadius: 220,
            background: "#4285F4",
            opacity: 0.09,
            display: "flex",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          {/* Brand header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 28,
                fontWeight: 900,
                letterSpacing: -2.5,
              }}
            >
              ZILIGO<span style={{ color: "#8AB4F8" }}>.</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "9px 13px",
                border: "1px solid #292F3C",
                borderRadius: 99,
                background: "#121620",
                fontFamily: "monospace",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1,
                color: "#BAC3D2",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 8,
                  background: "#81C995",
                }}
              />
              PERSONAL SKILL CARD / 2026
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 8,
              marginBottom: 4,
            }}
          >
            {/* Headline and identity */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: 700,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: "monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 2,
                  color: "#8AB4F8",
                }}
              >
                AI FLUENCY / CODE / CAREER
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 13,
                  fontSize: 61,
                  lineHeight: 0.98,
                  fontWeight: 900,
                  letterSpacing: -4.5,
                }}
              >
                <span>YOUR SKILLS.</span>
                <span
                  style={{
                    display: "flex",
                    width: "fit-content",
                    marginTop: 5,
                    color: "#8AB4F8",
                  }}
                >
                  YOUR SIGNAL.
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  marginTop: 15,
                  fontSize: 15,
                  color: "#AAB3C4",
                }}
              >
                Your AI. Your code. Your next move.
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 21,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    maxWidth: 420,
                    padding: "9px 13px",
                    borderRadius: 8,
                    border: "1px solid #34445F",
                    background: "#121A29",
                    color: "#8AB4F8",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {archetype}
                </div>

                <div
                  style={{
                    display: "flex",
                    color: "#BAC3D2",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {handle}
                </div>
              </div>
            </div>

            {/* Mascot on a dark panel */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: 280,
                height: 240,
                borderRadius: 28,
                background: "#111620",
                border: "1px solid #292F3C",
              }}
            >
              <CatMascot />
              <div
                style={{
                  display: "flex",
                  fontFamily: "monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 1.3,
                  color: "#AAB3C4",
                  marginTop: -2,
                }}
              >
                YOUR DIGITAL SIDEKICK
              </div>
            </div>
          </div>

          {/* Score panels */}
          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 4,
            }}
          >
            <ScorePanel
              label="AI FLUENCY"
              score={ai}
              color="#8AB4F8"
            />
            <ScorePanel
              label="CODING"
              score={coding}
              color="#81C995"
            />
            <ScorePanel
              label="CAREER READINESS"
              score={career}
              color="#C5A4FF"
            />
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 14,
              paddingTop: 11,
              borderTop: "1px solid #292F3C",
              fontFamily: "monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 0.7,
              color: "#8791A4",
            }}
          >
            <span>ZILIGO © 2026</span>
            <span>SELF-REPORTED · NOT INDEPENDENTLY VERIFIED</span>
            <span>FIND YOUR SIGNAL →</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
