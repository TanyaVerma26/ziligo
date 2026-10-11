
"use client";

import { useState } from "react";

type ShareCardActionsProps = {
  imageUrl: string;
  shareText: string;
  xShareUrl: string;
};

async function fetchCardImage(imageUrl: string): Promise<Blob> {
  const response = await fetch(imageUrl, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Could not generate your card image. Please try again.");
  }

  return response.blob();
}

function downloadBlob(blob: Blob) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = "ziligo-scorecard.png";
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

export default function ShareCardActions({
  imageUrl,
  shareText,
  xShareUrl,
}: ShareCardActionsProps) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function handleDownload() {
    if (busy) return;

    setBusy(true);
    setStatus("");

    try {
      const blob = await fetchCardImage(imageUrl);
      downloadBlob(blob);
      setStatus("Your ZILIGO card image has been downloaded.");
    } catch {
      setStatus("Couldn't download the image. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleShareImage() {
    if (busy) return;

    setBusy(true);
    setStatus("");

    try {
      const blob = await fetchCardImage(imageUrl);
      const file = new File([blob], "ziligo-scorecard.png", {
        type: blob.type || "image/png",
      });

      if (
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: "My ZILIGO scorecard",
          text: shareText,
        });

        setStatus("Choose an app in the share menu to share your card image.");
      } else {
        downloadBlob(blob);
        setStatus(
          "Image downloaded. Open Share on X and attach ziligo-scorecard.png."
        );
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      setStatus("Couldn't share the image. Please try downloading it instead.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:flex-wrap">
        <button
          type="button"
          onClick={handleShareImage}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#171717] bg-[#FFD84D] px-5 py-3 font-mono text-[10px] font-bold tracking-[0.04em] text-[#171717] transition hover:bg-[#FFE783] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8AC00]"
        >
          {busy ? "PREPARING IMAGE..." : "SHARE CARD IMAGE ↗"}
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#171717] bg-white px-5 py-3 font-mono text-[10px] font-bold tracking-[0.04em] text-[#171717] transition hover:bg-[#F7F4EA] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8AC00]"
        >
          DOWNLOAD PNG ↓
        </button>

        <a
          href={xShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#171717] bg-[#171717] px-5 py-3 font-mono text-[10px] font-bold tracking-[0.04em] text-[#FFD84D] transition hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8AC00]"
        >
          SHARE ON X ↗
        </a>
      </div>

      <p
        role="status"
        aria-live="polite"
        className="min-h-5 text-[11px] leading-5 text-[#777777]"
      >
        {status}
      </p>
    </div>
  );
}
