
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
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
      {/* Cat ears and head */}
      <path
        d="M48 86 L46 35 L91 59 Q120 44 149 59 L194 35 L191 88 Q204 112 188 137 Q171 160 120 160 Q69 160 51 137 Q36 112 48 86 Z"
        fill="#FFD84D"
        stroke="#171717"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Inner ears */}
      <path d="M57 51 L79 65 L59 77 Z" fill="#FFFDF6" />
      <path d="M183 51 L161 65 L181 77 Z" fill="#FFFDF6" />

      {/* Face visor */}
      <rect x="66" y="83" width="108" height="47" rx="13" fill="#171717" />
      <rect x="73" y="90" width="94" height="33" rx="8" fill="#2D2D2D" />

      {/* Pixel eyes */}
      <rect x="87" y="99" width="10" height="11" rx="2" fill="#FFFFFF" />
      <rect x="143" y="99" width="10" height="11" rx="2" fill="#FFFFFF" />
      <rect x="89" y="100" width="3" height="4" fill="#FFD84D" />
      <rect x="145" y="100" width="3" height="4" fill="#FFD84D" />

      {/* Nose and smile */}
      <path d="M116 112 L124 112 L120 117 Z" fill="#FFD84D" />
      <path
        d="M120 117 Q111 126 105 118 M120 117 Q129 126 135 118"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Body */}
      <path
        d="M72 151 Q62 172 68 189 Q73 199 92 196 L148 196 Q167 199 173 189 Q179 170 168 151 Z"
        fill="#FFD84D"
        stroke="#171717"
        strokeWidth="3"
      />

      {/* Paws */}
      <ellipse cx="94" cy="190" rx="19" ry="9" fill="#FFFDF6" stroke="#171717" strokeWidth="2" />
      <ellipse cx="146" cy="190" rx="19" ry="9" fill="#FFFDF6" stroke="#171717" strokeWidth="2" />

      {/* Antenna */}
      <path d="M120 45 V29" stroke="#171717" strokeWidth="3" />
      <rect x="112" y="18" width="16" height="13" rx="3" fill="#FFD84D" stroke="#171717" strokeWidth="2.5" />
      <rect x="118" y="22" width="4" height="4" fill="#171717" />

      {/* Digital sparkle accents */}
      <path d="M29 72 L34 84 L46 89 L34 94 L29 106 L24 94 L12 89 L24 84 Z" fill="#171717" />
      <path d="M204 73 L208 82 L217 86 L208 90 L204 99 L200 90 L191 86 L200 82 Z" fill="#D5A900" />
      <rect x="28" y="132" width="7" height="7" fill="#D5A900" />
      <rect x="207" y="127" width="7" height="7" fill="#171717" />
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
        display: "flex",
        flexDirection: "column",
        padding: "17px 20px",
        background: "#FFFFFF",
        border: "1px solid #E5E2D8",
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
          color: "#656565",
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
          color: "#171717",
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
          background: "#EEECE5",
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

  const ai = card?.ai_pct ?? null;
  const coding = card?.coding_pct ?? null;
  const career = card?.career_pct ?? null;

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
          padding: "35px 46px 30px",
          background: "#FAF9F5",
          color: "#171717",
          fontFamily: "Arial, Helvetica, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle technical background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(#E9E5D8 1px, transparent 1px), linear-gradient(90deg, #E9E5D8 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.22,
          }}
        />

        <div
          style={{
            position: "absolute",
            right: 60,
            top: 20,
            width: 370,
            height: 370,
            borderRadius: 200,
            background: "#FFF0A8",
            opacity: 0.55,
            display: "flex",
          }}
        />

        {/* Everything above the background */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          {/* Brand bar */}
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
                fontSize: 27,
                fontWeight: 900,
                letterSpacing: -2.5,
              }}
            >
              ZILIGO<span style={{ color: "#D5AA00" }}>.</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "9px 13px",
                border: "1px solid #E3DFD1",
                borderRadius: 99,
                background: "#FFFFFF",
                fontFamily: "monospace",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 8,
                  background: "#D5AA00",
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
              marginTop: 12,
              marginBottom: 6,
            }}
          >
            {/* Headline */}
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
                  color: "#725D00",
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
                    padding: "5px 11px 8px",
                    background: "#FFD84D",
                  }}
                >
                  YOUR SIGNAL.
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  marginTop: 17,
                  fontSize: 15,
                  color: "#646464",
                }}
              >
                Your AI. Your code. Your next move.
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 24,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    padding: "8px 13px",
                    borderRadius: 8,
                    background: "#171717",
                    color: "#FFD84D",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: 0.5,
                  }}
                >
                  {archetype}
                </div>

                <div
                  style={{
                    display: "flex",
                    color: "#666666",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {handle}
                </div>
              </div>
            </div>

            {/* Original cyber cat */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: 280,
                height: 240,
                borderRadius: 28,
                background: "#FFF1B6",
                border: "1px solid #E8D884",
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
                  color: "#665400",
                  marginTop: -2,
                }}
              >
                YOUR DIGITAL SIDEKICK
              </div>
            </div>
          </div>

          {/* Real score panels */}
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
              color="#D7AD00"
            />
            <ScorePanel
              label="CODING"
              score={coding}
              color="#242424"
            />
            <ScorePanel
              label="CAREER READINESS"
              score={career}
              color="#9B8700"
            />
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 15,
              paddingTop: 12,
              borderTop: "1px solid #E1DED3",
              fontFamily: "monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 1,
              color: "#777365",
            }}
          >
            <span>ZILIGO © 2026</span>
            <span>SELF-REPORTED · NOT INDEPENDENTLY VERIFIED</span>
            <span>FIND YOUR SIGNAL →</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
