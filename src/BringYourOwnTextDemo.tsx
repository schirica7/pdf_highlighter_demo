import type { ButtonHTMLAttributes, ChangeEvent, HTMLAttributes, ReactNode } from "react";
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Highlighter, Sparkles, Upload } from "lucide-react";
import type { ScaledPosition } from "react-pdf-highlighter";
import {
  createGeneratedDemoPdf,
  demoDocumentTitle,
  frameworkOptions,
  stimulusSets,
  type FrameworkId,
  type FeedbackCard,
  type GeneratedDemoPdf,
  type Tone,
} from "./demoPdf";
import type { DemoHighlight } from "./pdfTypes";

const PdfViewerPane = lazy(() => import("./PdfViewerPane"));

type CardProps = HTMLAttributes<HTMLDivElement>;

function cls(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cls("rounded-[28px] border border-black/5 bg-white shadow-[0_20px_70px_-28px_rgba(15,23,42,0.28)]", className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: CardProps) {
  return <div className={cls("px-6 pt-6", className)} {...props} />;
}

function CardContent({ className, ...props }: CardProps) {
  return <div className={cls("px-6 pb-6", className)} {...props} />;
}

function CardTitle({ className, ...props }: CardProps) {
  return <div className={cls("font-serif text-xl text-slate-950", className)} {...props} />;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
};

function Button({ className, variant = "default", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cls(
        "inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "default" && "border-slate-950 bg-slate-950 text-white hover:bg-slate-800",
        variant === "outline" && "border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
        variant === "ghost" && "border-transparent bg-transparent text-slate-700 hover:bg-slate-100",
        className
      )}
      {...props}
    />
  );
}

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: Tone | "neutral";
};

const toneMeta: Record<Tone | "neutral", { badge: string; soft: string; strong: string; fill: string; border: string }> = {
  emerald: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-900",
    soft: "bg-emerald-50 text-emerald-900",
    strong: "border-emerald-400 text-emerald-950",
    fill: "rgba(16, 185, 129, 0.24)",
    border: "rgba(5, 150, 105, 0.9)",
  },
  sky: {
    badge: "border-sky-200 bg-sky-50 text-sky-900",
    soft: "bg-sky-50 text-sky-900",
    strong: "border-sky-400 text-sky-950",
    fill: "rgba(14, 165, 233, 0.24)",
    border: "rgba(2, 132, 199, 0.92)",
  },
  amber: {
    badge: "border-amber-200 bg-amber-50 text-amber-950",
    soft: "bg-amber-50 text-amber-950",
    strong: "border-amber-400 text-amber-950",
    fill: "rgba(245, 158, 11, 0.24)",
    border: "rgba(217, 119, 6, 0.92)",
  },
  slate: {
    badge: "border-slate-200 bg-slate-100 text-slate-900",
    soft: "bg-slate-100 text-slate-900",
    strong: "border-slate-400 text-slate-950",
    fill: "rgba(100, 116, 139, 0.2)",
    border: "rgba(71, 85, 105, 0.9)",
  },
  neutral: {
    badge: "border-slate-200 bg-white text-slate-700",
    soft: "bg-slate-50 text-slate-900",
    strong: "border-slate-300 text-slate-900",
    fill: "rgba(148, 163, 184, 0.18)",
    border: "rgba(100, 116, 139, 0.8)",
  },
};

function Badge({ className, children, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cls("inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium", toneMeta[tone].badge, className)}
      {...props}
    >
      {children}
    </span>
  );
}

function StimulusCardButton({
  item,
  selected,
  onClick,
}: {
  item: FeedbackCard;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cls(
        "w-full rounded-[24px] border p-4 text-left transition",
        selected
          ? `bg-slate-950 text-white ${toneMeta[item.tone].strong} shadow-lg shadow-slate-950/10`
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-full">
          <div className="flex items-center gap-2">
            <span className={cls("rounded-full px-2.5 py-1 text-[11px] font-medium", selected ? "bg-white/10 text-white" : toneMeta[item.tone].soft)}>
              {item.title}
            </span>
            <span className={cls("text-xs font-medium", selected ? "text-slate-300" : "text-slate-500")}>{item.stimulusCaption}</span>
          </div>
          {item.stimulusType === "Image" ? (
            <div
              className={cls(
                "relative mt-4 h-40 overflow-hidden rounded-[20px] border",
                selected ? "border-white/15 bg-slate-800" : "border-slate-200 bg-[linear-gradient(180deg,#eef2f7_0%,#d9e2f2_45%,#a5afbf_46%,#4b5563_100%)]"
              )}
            >
              <div className={cls("absolute inset-x-0 top-0 h-16", selected ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_100%)]" : "bg-[linear-gradient(180deg,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0)_100%)]")} />
              <div className={cls("absolute bottom-0 left-[18%] h-24 w-px rotate-[28deg]", selected ? "bg-white/70" : "bg-white")} />
              <div className={cls("absolute bottom-0 left-[58%] h-28 w-px -rotate-[16deg]", selected ? "bg-white/70" : "bg-white")} />
              <div className={cls("absolute bottom-[26%] left-0 h-px w-full", selected ? "bg-white/20" : "bg-slate-300/80")} />
              <div className={cls("absolute bottom-[58%] left-[16%] h-4 w-4 rounded-full border", selected ? "border-white/60" : "border-slate-700/70")} />
            </div>
          ) : (
            <p className={cls("mt-3 whitespace-pre-line text-sm leading-6", selected ? "text-slate-200" : "text-slate-700")}>{item.stimulusBody}</p>
          )}
          <p className={cls("mt-3 text-sm leading-6", selected ? "text-slate-300" : "text-slate-600")}>{item.summary}</p>
        </div>
      </div>
    </button>
  );
}

function LoadingShell({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center rounded-[28px] bg-[linear-gradient(180deg,#fffdf7_0%,#f4f0e5_100%)] p-8 text-center">
      <div>
        <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-slate-200" />
        <p className="mt-4 text-sm text-slate-600">{message}</p>
      </div>
    </div>
  );
}

export default function BringYourOwnTextDemo() {
  const [demoPdf, setDemoPdf] = useState<GeneratedDemoPdf | null>(null);
  const [customPdf, setCustomPdf] = useState<{ url: string; name: string } | null>(null);
  const [manualHighlights, setManualHighlights] = useState<DemoHighlight[]>([]);
  const [feedbackGenerated, setFeedbackGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<FrameworkId>("personal-journeys");
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerPrimed, setViewerPrimed] = useState(false);
  const scrollToHighlightRef = useRef<((highlight: DemoHighlight) => void) | null>(null);
  const generateTimeoutRef = useRef<number | null>(null);
  const pendingScrollHighlightIdRef = useRef<string | null>(null);
  const scrollRetryTimeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    createGeneratedDemoPdf()
      .then((result) => {
        if (cancelled) {
          result.cleanup();
          return;
        }

        cleanup = result.cleanup;
        setDemoPdf(result);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Unknown error";
        setViewerError(`Could not generate the demo PDF: ${message}`);
      });

    return () => {
      cancelled = true;
      cleanup();
      if (generateTimeoutRef.current) {
        window.clearTimeout(generateTimeoutRef.current);
      }
      scrollRetryTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  useEffect(() => {
    return () => {
      if (customPdf) {
        URL.revokeObjectURL(customPdf.url);
      }
    };
  }, [customPdf]);

  const usingSamplePdf = customPdf === null;
  const currentPdfUrl = usingSamplePdf ? demoPdf?.url ?? "" : customPdf?.url ?? "";
  const samplePassages = demoPdf?.passages ?? [];
  const currentStimulusSet = stimulusSets[selectedFramework];
  const currentStimuli = currentStimulusSet.items;

  const groundedHighlights = useMemo<DemoHighlight[]>(() => {
    if (!feedbackGenerated || !usingSamplePdf || !samplePassages.length) {
      return [];
    }

    const highlights: DemoHighlight[] = [];

    for (const item of currentStimuli) {
      const passage = samplePassages.find((entry) => entry.id === item.passageId);
      if (!passage) {
        continue;
      }

      highlights.push({
        id: item.id,
        kind: "grounded" as const,
        tone: item.tone,
        title: passage.title,
        location: passage.location,
        quote: passage.quote,
        paragraphId: item.paragraphId,
        summary: item.summary,
        position: passage.position,
        content: { text: passage.quote },
        comment: { text: item.title, emoji: "AI" },
      });
    }

    return highlights;
  }, [currentStimuli, feedbackGenerated, samplePassages, usingSamplePdf]);

  const allHighlights = useMemo(
    () => [...groundedHighlights, ...manualHighlights],
    [activeHighlightId, groundedHighlights, manualHighlights]
  );
  const activeHighlight = allHighlights.find((item) => item.id === activeHighlightId) ?? null;
  const activeStimulus = currentStimuli.find((item) => item.id === activeHighlightId) ?? null;

  useEffect(() => {
    if (!feedbackGenerated || !groundedHighlights.length || activeHighlightId) {
      return;
    }

    setActiveHighlightId(groundedHighlights[0].id);
  }, [activeHighlightId, feedbackGenerated, groundedHighlights]);

  useEffect(() => {
    if (!feedbackGenerated) {
      return;
    }

    const activeStillExists = currentStimuli.some((item) => item.id === activeHighlightId);
    if (activeStillExists) {
      return;
    }

    setActiveHighlightId(currentStimuli[0]?.id ?? null);
  }, [activeHighlightId, currentStimuli, feedbackGenerated]);

  function resetForNewDocument() {
    setManualHighlights([]);
    setFeedbackGenerated(false);
    setActiveHighlightId(null);
    setViewerError(null);
    setViewerOpen(false);
    setViewerPrimed(false);
    pendingScrollHighlightIdRef.current = null;
    scrollRetryTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    scrollRetryTimeoutsRef.current = [];
  }

  function handleGenerateFeedback() {
    if (!usingSamplePdf || !samplePassages.length) {
      return;
    }

    setIsGenerating(true);
    if (generateTimeoutRef.current) {
      window.clearTimeout(generateTimeoutRef.current);
    }

    generateTimeoutRef.current = window.setTimeout(() => {
      setFeedbackGenerated(true);
      setActiveHighlightId(currentStimuli[0]?.id ?? null);
      setIsGenerating(false);
    }, 850);
  }

  function handleCustomPdfUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (customPdf) {
      URL.revokeObjectURL(customPdf.url);
    }

    resetForNewDocument();
    setCustomPdf({
      url: URL.createObjectURL(file),
      name: file.name,
    });
    setViewerPrimed(true);
    event.target.value = "";
  }

  function handleLoadDemoDocument() {
    if (customPdf) {
      URL.revokeObjectURL(customPdf.url);
    }

    setCustomPdf(null);
    resetForNewDocument();
  }

  function scrollHighlightNow(highlightId: string) {
    const highlight = allHighlights.find((item) => item.id === highlightId);
    if (!highlight || !scrollToHighlightRef.current) {
      return false;
    }

    scrollRetryTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    scrollRetryTimeoutsRef.current = [0, 140, 320].map((delay) =>
      window.setTimeout(() => {
        scrollToHighlightRef.current?.(highlight);
      }, delay)
    );
    scrollRetryTimeoutsRef.current.push(
      window.setTimeout(() => {
        if (pendingScrollHighlightIdRef.current === highlightId) {
          pendingScrollHighlightIdRef.current = null;
        }
      }, 420)
    );

    return true;
  }

  function handleStoreScrollTo(scrollTo: (highlight: DemoHighlight) => void) {
    scrollToHighlightRef.current = scrollTo;

    const pendingHighlightId = pendingScrollHighlightIdRef.current;
    if (!pendingHighlightId) {
      return;
    }

    if (scrollHighlightNow(pendingHighlightId)) {
      pendingScrollHighlightIdRef.current = null;
    }
  }

  function focusHighlight(highlightId: string, options?: { scroll?: boolean; openViewer?: boolean }) {
    setActiveHighlightId(highlightId);

    if (options?.openViewer) {
      setViewerPrimed(true);
      setViewerOpen(true);
    }

    if (!options?.scroll) {
      return;
    }

    pendingScrollHighlightIdRef.current = highlightId;
    scrollHighlightNow(highlightId);
  }

  function openViewer(highlightId?: string) {
    setViewerPrimed(true);
    setViewerOpen(true);

    if (!highlightId) {
      return;
    }

    focusHighlight(highlightId, { scroll: true, openViewer: true });
  }

  function addManualHighlight(position: ScaledPosition, text?: string) {
    const trimmed = text?.trim();
    if (!trimmed) {
      return;
    }

    const manualHighlight: DemoHighlight = {
      id: `manual-${Date.now()}`,
      kind: "manual",
      tone: "slate",
      title: "Teacher-selected passage",
      location: usingSamplePdf ? "Demo PDF selection" : "Uploaded PDF selection",
      quote: trimmed,
      position,
      content: { text: trimmed },
      comment: { text: "Teacher note", emoji: "Note" },
    };

    setManualHighlights((current) => [manualHighlight, ...current].slice(0, 5));
    setActiveHighlightId(manualHighlight.id);
  }

  function removeManualHighlight(highlightId: string) {
    setManualHighlights((current) => current.filter((item) => item.id !== highlightId));

    if (activeHighlightId === highlightId) {
      setActiveHighlightId(null);
    }
  }

  function clearActiveHighlight() {
    setActiveHighlightId(null);
    pendingScrollHighlightIdRef.current = null;
  }

  const savedManualHighlights = manualHighlights;

  useEffect(() => {
    if (!viewerOpen) {
      return;
    }

    const pendingHighlightId = pendingScrollHighlightIdRef.current;
    if (!pendingHighlightId) {
      return;
    }

    if (scrollHighlightNow(pendingHighlightId)) {
      pendingScrollHighlightIdRef.current = null;
    }
  }, [allHighlights, viewerOpen]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fffdf2_0%,#f6efe3_28%,#f2f4f7_78%,#e9eef5_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="rounded-[32px] border border-black/5 bg-white/70 p-6 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.4)] backdrop-blur"
        >
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex flex-wrap items-center justify-center gap-2" />
            <h1 className="mt-4 font-serif text-4xl leading-tight text-slate-950 sm:text-5xl">
              PDF highlighter for building Creating Texts Stimuli
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The PDF highlighter acts as the source-inspection layer. Use it to pull passages worth building from, then review a finished stimulus set before deciding what to assign. Right now, this is hardcoded, but new stimuli can be generated with an LLM.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Source text</p>
              <h2 className="mt-3 font-serif text-2xl text-slate-950">Open a document</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Start with the source material. The demo includes a sample text, and you can also open your own PDF in the same passage-selection flow.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <label className="cursor-pointer rounded-[22px] border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Upload className="h-4 w-4" />
                    <span>Upload another PDF</span>
                  </div>
                  <input type="file" accept="application/pdf" className="hidden" onChange={handleCustomPdfUpload} />
                </label>

                <Button variant="outline" className="rounded-[22px]" onClick={() => openViewer(activeHighlightId ?? undefined)} disabled={!currentPdfUrl}>
                  <FileText className="h-4 w-4" />
                  Open source PDF
                </Button>

                {!usingSamplePdf ? (
                  <Button variant="ghost" className="rounded-[22px]" onClick={handleLoadDemoDocument}>
                    Load demo document again
                  </Button>
                ) : null}
              </div>

              <div className="mt-5 rounded-[22px] bg-slate-50 p-4 text-sm text-slate-600">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={usingSamplePdf ? "emerald" : "neutral"}>{usingSamplePdf ? "Sample document" : "Uploaded document"}</Badge>
                  <span className="font-medium text-slate-800">{usingSamplePdf ? demoDocumentTitle : customPdf?.name}</span>
                </div>
                <p className="mt-3 leading-6">
                  {usingSamplePdf
                    ? `The ${currentStimulusSet.frameworkLabel.toLowerCase()} set below is linked to this sample PDF.`
                    : "Uploaded PDFs open in the same review modal. The sample stimulus set remains linked to the built-in demo text."}
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#fffdf8_0%,#f8f6ef_100%)] p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Framework of ideas</p>
              <div className="mt-3 grid gap-2">
                {frameworkOptions.map((framework) => (
                  <button
                    key={framework.id}
                    type="button"
                    onClick={() => setSelectedFramework(framework.id)}
                    className={cls(
                      "rounded-[18px] border px-4 py-3 text-left text-sm transition",
                      selectedFramework === framework.id
                        ? "border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/10"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    {framework.label}
                  </button>
                ))}
              </div>

              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Stimulus builder</p>
              <h2 className="mt-3 font-serif text-2xl text-slate-950">Generate stimulus set</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {currentStimulusSet.description}
              </p>
              <Button
                variant="default"
                className="mt-5 w-full rounded-[22px]"
                onClick={handleGenerateFeedback}
                disabled={!usingSamplePdf || !demoPdf || isGenerating}
              >
                <Sparkles className="h-4 w-4" />
                {isGenerating ? "Generating..." : feedbackGenerated ? `Regenerate ${currentStimulusSet.frameworkLabel.toLowerCase()} set` : `Generate ${currentStimulusSet.frameworkLabel.toLowerCase()} set`}
              </Button>
              <div className="mt-4 rounded-[22px] bg-white p-4 text-sm leading-6 text-slate-600">
                {feedbackGenerated
                  ? "Each stimulus card can be inspected against the source passage it was derived from."
                  : "Keep the PDF in reserve until you want to inspect or mark a passage."}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>Stimulus set</CardTitle>
                  <p className="mt-2 font-serif text-2xl text-slate-950">{currentStimulusSet.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{currentStimulusSet.frameworkLabel}</p>
                </div>
                <Badge tone="neutral">{feedbackGenerated ? "3 linked items" : "Awaiting generation"}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                This mirrors the output shape Edexia already uses more closely: one title, several stimulus items, and linked source grounding behind each one.
              </p>
            </CardHeader>
            <CardContent>
              {!feedbackGenerated ? (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-900">Generate the stimulus set first</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Generate one believable set, show the source passage behind each item, and keep the PDF viewer available for inspection.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentStimuli.map((item) => (
                    <StimulusCardButton key={item.id} item={item} selected={activeHighlightId === item.id} onClick={() => focusHighlight(item.id)} />
                  ))}
                  <div className="flex justify-end pt-1">
                    <Button variant="outline" className="rounded-[20px]">
                      Use this stimulus
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Highlighter className="h-5 w-5" />
                Selected passage
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeHighlight ? (
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={activeHighlight.tone}>{activeHighlight.kind === "manual" ? "Manual passage" : activeHighlight.location}</Badge>
                    {activeStimulus ? <Badge tone="neutral">{activeStimulus.status}</Badge> : null}
                  </div>
                  <p className="mt-4 font-serif text-2xl text-slate-950">{activeHighlight.title}</p>
                  <p className="mt-4 text-sm leading-7 text-slate-700">"{activeHighlight.quote}"</p>

                  {activeStimulus ? (
                    <>
                      <div className="mt-5 rounded-[20px] bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          {activeStimulus.title} ({activeStimulus.stimulusCaption})
                        </p>
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{activeStimulus.stimulusBody}</p>
                      </div>
                      <div className="mt-4 rounded-[20px] bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Why this passage works</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{activeStimulus.rationale}</p>
                      </div>
                      <div className="mt-4 rounded-[20px] bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Teacher move</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{activeStimulus.nextStep}</p>
                      </div>
                      <div className="mt-4">
                        <Button variant="default" className="rounded-[20px]" onClick={() => focusHighlight(activeHighlight.id, { scroll: true, openViewer: true })}>
                          <FileText className="h-4 w-4" />
                          Inspect in PDF
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="mt-5 rounded-[20px] bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Manual passage</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        Manual highlights let you mark source material worth turning into a future stimulus item, even if it is not part of the generated set yet.
                      </p>
                      <div className="mt-4">
                        <Button variant="outline" className="rounded-[20px]" onClick={() => removeManualHighlight(activeHighlight.id)}>
                          Remove passage
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                  {feedbackGenerated
                    ? "Select a stimulus item to review the linked passage here, then inspect it in the PDF when you need the full context."
                    : "Generate the stimulus set to start linking prompt ideas to source passages."}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Saved source passages</CardTitle>
          </CardHeader>
          <CardContent>
            {savedManualHighlights.length ? (
              <div className="grid gap-3 md:grid-cols-2">
                {savedManualHighlights.map((highlight) => (
                  <div key={highlight.id} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{highlight.location}</p>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-700">"{highlight.quote}"</p>
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" className="rounded-[18px] px-3 py-2 text-xs" onClick={() => focusHighlight(highlight.id, { openViewer: true, scroll: true })}>
                        View in PDF
                      </Button>
                      <Button variant="ghost" className="rounded-[18px] px-3 py-2 text-xs" onClick={() => removeManualHighlight(highlight.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                No saved passages yet. Open the PDF and select text to save a manual source note.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {viewerPrimed ? (
        <div
          className={viewerOpen ? "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" : "pointer-events-none fixed inset-0 -z-10 opacity-0"}
          aria-hidden={!viewerOpen}
        >
          <button
            type="button"
            className={viewerOpen ? "absolute inset-0" : "hidden"}
            onClick={() => setViewerOpen(false)}
            aria-label="Close source inspection modal"
          />
          <motion.div
            initial={false}
            animate={viewerOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-[min(1440px,96vw)] overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-[0_40px_120px_-48px_rgba(15,23,42,0.65)]"
          >
            <div className="flex items-center justify-between border-b border-slate-200 bg-[linear-gradient(180deg,#fffdf8_0%,#f8f6ef_100%)] px-6 py-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Source inspection</p>
                <h2 className="mt-2 font-serif text-2xl text-slate-950">{usingSamplePdf ? demoDocumentTitle : customPdf?.name}</h2>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone="neutral">Select text to save a source passage</Badge>
                <Button variant="ghost" className="rounded-[20px]" onClick={() => setViewerOpen(false)}>
                  Close
                </Button>
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">
                <div className="h-[82vh] bg-[linear-gradient(180deg,#fffdf8_0%,#f2ede4_100%)] p-3">
                  <div className="relative h-full overflow-hidden rounded-[24px] border border-slate-200 bg-white">
                    <Suspense fallback={<LoadingShell message="Preparing PDF viewer..." />}>
                      <PdfViewerPane
                        currentPdfUrl={currentPdfUrl}
                        viewerError={viewerError}
                        allHighlights={allHighlights}
                        activeHighlightId={activeHighlightId}
                        onViewerError={(message) => setViewerError(message)}
                        onStoreScrollTo={handleStoreScrollTo}
                        onManualSelection={addManualHighlight}
                        onHighlightSelect={(highlightId) => focusHighlight(highlightId)}
                        onClearActiveHighlight={clearActiveHighlight}
                      />
                    </Suspense>
                  </div>
                </div>
              </div>

              <div className="bg-white">
                <div className="space-y-4 p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Passage details</p>
                  {activeHighlight ? (
                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={activeHighlight.tone}>{activeHighlight.kind === "manual" ? "Manual passage" : activeHighlight.location}</Badge>
                        {activeStimulus ? <Badge tone="neutral">{activeStimulus.status}</Badge> : null}
                      </div>
                      <p className="mt-4 font-serif text-2xl text-slate-950">{activeHighlight.title}</p>
                      <p className="mt-4 text-sm leading-7 text-slate-700">"{activeHighlight.quote}"</p>
                      {activeStimulus ? (
                        <>
                          <div className="mt-5 rounded-[20px] bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Candidate stimulus</p>
                            <p className="mt-2 text-sm leading-6 text-slate-700">{activeStimulus.summary}</p>
                          </div>
                          <div className="mt-4 rounded-[20px] bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Why this passage works</p>
                            <p className="mt-2 text-sm leading-6 text-slate-700">{activeStimulus.rationale}</p>
                          </div>
                          <div className="mt-4 rounded-[20px] bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Teacher move</p>
                            <p className="mt-2 text-sm leading-6 text-slate-700">{activeStimulus.nextStep}</p>
                          </div>
                        </>
                      ) : activeHighlight.kind === "manual" ? (
                        <div className="mt-5 rounded-[20px] bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Passage actions</p>
                          <div className="mt-3">
                            <Button variant="outline" className="rounded-[20px]" onClick={() => removeManualHighlight(activeHighlight.id)}>
                              Delete passage
                            </Button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                      Select a stimulus item or highlight text directly in the PDF.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}
