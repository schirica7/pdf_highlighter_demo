import type { ButtonHTMLAttributes, ChangeEvent, HTMLAttributes, ReactNode } from "react";
import { Suspense, forwardRef, lazy, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Check, ChevronDown, ChevronUp, FileText, Highlighter, Image as ImageIcon, Quote, Sparkles, Upload, Wand2 } from "lucide-react";
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

const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cls("rounded-[28px] border border-black/5 bg-white shadow-[0_20px_70px_-28px_rgba(15,23,42,0.28)]", className)}
      {...props}
    />
  );
});

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

function InfoPanel({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cls("rounded-[24px] border bg-white/80 p-5 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.34)]", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{eyebrow}</p>
      <p className="mt-3 font-serif text-2xl leading-tight text-slate-950">{title}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function WorkflowStep({
  step,
  title,
  description,
  active = false,
}: {
  step: string;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div
      className={cls(
        "rounded-[22px] border p-4 transition",
        active ? "border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/10" : "border-slate-200 bg-white"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cls(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
            active ? "border-white/15 bg-white/10 text-white" : "border-slate-300 bg-slate-50 text-slate-700"
          )}
        >
          {step}
        </div>
        <div>
          <p className={cls("text-sm font-semibold", active ? "text-white" : "text-slate-950")}>{title}</p>
          <p className={cls("mt-1 text-sm leading-6", active ? "text-slate-300" : "text-slate-600")}>{description}</p>
        </div>
      </div>
    </div>
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

type GeneratedStimulus = {
  title: string;
  imagePrompt: string;
  verse: string;
  imageBase64?: string;
  imageMimeType?: string;
  imageError?: string;
};

export default function BringYourOwnTextDemo() {
  const [demoPdf, setDemoPdf] = useState<GeneratedDemoPdf | null>(null);
  const [customPdf, setCustomPdf] = useState<{ url: string; name: string } | null>(null);
  const [manualHighlights, setManualHighlights] = useState<DemoHighlight[]>([]);
  const [generatedStimulus, setGeneratedStimulus] = useState<GeneratedStimulus | null>(null);
  const [feedbackGenerated, setFeedbackGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<FrameworkId>("personal-journeys");
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);
  const [sourcePassageText, setSourcePassageText] = useState("");
  const [sourcePassageMeta, setSourcePassageMeta] = useState<Pick<DemoHighlight, "id" | "title" | "location" | "kind" | "tone"> | null>(null);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerPrimed, setViewerPrimed] = useState(false);
  const [savedEvidenceOpen, setSavedEvidenceOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState({
    unit: true,
    stimulus: true,
    settings: false,
    preview: false,
  });
  const scrollToHighlightRef = useRef<((highlight: DemoHighlight) => void) | null>(null);
  const pendingScrollHighlightIdRef = useRef<string | null>(null);
  const scrollRetryTimeoutsRef = useRef<number[]>([]);
  const stimulusSectionRef = useRef<HTMLDivElement | null>(null);

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

  const groundedHighlights = useMemo<DemoHighlight[]>(() => {
    if (!usingSamplePdf || !samplePassages.length) {
      return [];
    }

    return samplePassages.map((passage, index) => ({
      id: passage.id,
      kind: "grounded" as const,
      tone: passage.tone,
      title: passage.title,
      location: passage.location,
      quote: passage.quote,
      summary: `Sample quote ${index + 1} from the demo source text.`,
      position: passage.position,
      content: { text: passage.quote },
      comment: { text: "Source quote", emoji: "AI" },
    }));
  }, [samplePassages, usingSamplePdf]);

  const allHighlights = useMemo(() => [...groundedHighlights, ...manualHighlights], [activeHighlightId, groundedHighlights, manualHighlights]);
  const activeHighlight = allHighlights.find((item) => item.id === activeHighlightId) ?? null;

  function resetForNewDocument() {
    setManualHighlights([]);
    setSourcePassageText("");
    setSourcePassageMeta(null);
    setFeedbackGenerated(false);
    setGeneratedStimulus(null);
    setGenerationError(null);
    setActiveHighlightId(null);
    setViewerError(null);
    setViewerOpen(false);
    setViewerPrimed(false);
    setSavedEvidenceOpen(false);
    pendingScrollHighlightIdRef.current = null;
    scrollRetryTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    scrollRetryTimeoutsRef.current = [];
  }

  async function handleGenerateFeedback() {
    const trimmedPassage = sourcePassageText.trim();
    if (!trimmedPassage) {
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch("/api/generate-stimulus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          frameworkId: selectedFramework,
          frameworkLabel: currentStimulusSet.frameworkLabel,
          sourceTitle: currentDocumentName,
          sourcePassageText: trimmedPassage,
          sourcePassageMeta,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Could not generate stimulus");
      }

      setGeneratedStimulus(data.stimulus);
      setFeedbackGenerated(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not generate stimulus";
      setGenerationError(message);
      setFeedbackGenerated(false);
      setGeneratedStimulus(null);
    } finally {
      setIsGenerating(false);
    }
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
      title: "Highlighted source passage",
      location: usingSamplePdf ? "Demo PDF selection" : "Uploaded PDF selection",
      quote: trimmed,
      position,
      content: { text: trimmed },
      comment: { text: "Highlighted source passage", emoji: "Note" },
    };

    setManualHighlights((current) => [manualHighlight, ...current].slice(0, 5));
    setActiveHighlightId(manualHighlight.id);
    setFeedbackGenerated(false);
    setGeneratedStimulus(null);
    setGenerationError(null);
  }

  function removeManualHighlight(highlightId: string) {
    setManualHighlights((current) => current.filter((item) => item.id !== highlightId));

    if (activeHighlightId === highlightId) {
      setActiveHighlightId(null);
    }

    if (sourcePassageMeta?.id === highlightId) {
      setSourcePassageMeta(null);
    }
  }

  function clearActiveHighlight() {
    setActiveHighlightId(null);
    pendingScrollHighlightIdRef.current = null;
  }

  function useActiveHighlightAsSourcePassage() {
    if (!activeHighlight) {
      return;
    }

    setSourcePassageText(activeHighlight.quote);
    setSourcePassageMeta({
      id: activeHighlight.id,
      title: activeHighlight.title,
      location: activeHighlight.location,
      kind: activeHighlight.kind,
      tone: activeHighlight.tone,
    });
    setFeedbackGenerated(false);
    setGeneratedStimulus(null);
    setGenerationError(null);
  }

  function clearSourcePassage() {
    setSourcePassageText("");
    setSourcePassageMeta(null);
    setFeedbackGenerated(false);
    setGeneratedStimulus(null);
    setGenerationError(null);
  }

  function loadHighlightIntoSourcePassage(highlight: DemoHighlight) {
    focusHighlight(highlight.id);
    setSourcePassageText(highlight.quote);
    setSourcePassageMeta({
      id: highlight.id,
      title: highlight.title,
      location: highlight.location,
      kind: highlight.kind,
      tone: highlight.tone,
    });
    setFeedbackGenerated(false);
    setGeneratedStimulus(null);
    setGenerationError(null);
  }

  function toggleSection(section: keyof typeof sectionOpen) {
    setSectionOpen((current) => ({
      ...current,
      [section]: !current[section],
    }));
  }

  function handleContinue() {
    setSectionOpen((current) => ({
      ...current,
      unit: false,
      stimulus: true,
    }));

    window.setTimeout(() => {
      stimulusSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);
  }

  const savedEvidenceHighlights = useMemo(
    () => (usingSamplePdf ? [...manualHighlights, ...groundedHighlights] : manualHighlights),
    [groundedHighlights, manualHighlights, usingSamplePdf]
  );
  const currentDocumentName = usingSamplePdf ? demoDocumentTitle : customPdf?.name ?? "No document loaded";
  const outputArtifactLabel = isGenerating
    ? "Calling OpenAI..."
    : generationError
      ? "Generation failed"
      : feedbackGenerated
        ? "Stimulus set drafted"
        : sourcePassageText.trim()
          ? "Passage ready"
          : "Waiting for source passage";

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f8f7f4_0%,#f1f3f7_54%,#eef2f8_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1480px] space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }} className="space-y-5">
          <Card className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/95 shadow-[0_28px_80px_-42px_rgba(15,23,42,0.24)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700">1</div>
                <div>
                  <p className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">Unit</p>
                  <p className="mt-1 text-sm text-slate-500">Choose the writing mode and framework first.</p>
                </div>
              </div>
              <button type="button" onClick={() => toggleSection("unit")} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                {sectionOpen.unit ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
              </button>
            </div>

            {sectionOpen.unit ? <div className="space-y-6 p-6">
              <div className="grid gap-4 lg:grid-cols-2">
                <button type="button" className="flex items-center gap-4 rounded-[24px] border border-slate-200 bg-white px-8 py-8 text-left text-slate-900 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.25)]">
                  <BookOpen className="h-8 w-8 text-slate-500" />
                  <span className="text-2xl font-medium">Text Response</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-between gap-4 rounded-[24px] border-2 border-blue-500 bg-white px-8 py-8 text-left text-slate-950 shadow-[0_14px_36px_-24px_rgba(37,99,235,0.35)]"
                >
                  <div className="flex items-center gap-4">
                    <Wand2 className="h-8 w-8 text-slate-500" />
                    <span className="text-2xl font-medium">Creating Texts</span>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Check className="h-5 w-5" />
                  </div>
                </button>
              </div>

              <div>
                <p className="text-[32px] font-medium tracking-[-0.03em] text-slate-900">Select framework</p>
                <div className="mt-4 grid gap-4">
                  {frameworkOptions.map((framework) => (
                    <button
                      key={framework.id}
                      type="button"
                      onClick={() => setSelectedFramework(framework.id)}
                      className={cls(
                        "flex items-center justify-between rounded-[22px] border px-6 py-6 text-left text-2xl transition",
                        selectedFramework === framework.id
                          ? "border-2 border-blue-500 bg-blue-50/60 text-slate-950"
                          : "border-slate-200 bg-white text-slate-900 hover:border-slate-300"
                      )}
                    >
                      <span>{framework.label}</span>
                      {selectedFramework === framework.id ? (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                          <Check className="h-5 w-5" />
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="default" className="rounded-full bg-[linear-gradient(135deg,#5b3df5_0%,#4133e6_100%)] px-8 py-4 text-lg font-medium shadow-[0_16px_40px_-24px_rgba(91,61,245,0.65)] hover:bg-[linear-gradient(135deg,#5338e2_0%,#3528cf_100%)]" onClick={handleContinue}>
                  Continue
                </Button>
              </div>
            </div> : null}
          </Card>

          <Card ref={stimulusSectionRef} className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/95 shadow-[0_28px_80px_-42px_rgba(15,23,42,0.24)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700">2</div>
                <div>
                  <p className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">Stimulus</p>
                  <p className="mt-1 text-sm text-slate-500">Paste a source passage first, then optionally use the PDF helper when you want inspectable grounding.</p>
                </div>
              </div>
              <button type="button" onClick={() => toggleSection("stimulus")} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                {sectionOpen.stimulus ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
              </button>
            </div>

            {sectionOpen.stimulus ? <div className="space-y-6 p-6">
                <div className="space-y-6">
                  <div>
                    <p className="flex items-center gap-3 text-[20px] font-semibold text-slate-900">
                      <BookOpen className="h-5 w-5 text-slate-500" />
                      Source material
                    </p>
                    <div className="mt-3 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge tone={usingSamplePdf ? "emerald" : "neutral"}>{usingSamplePdf ? "Demo book" : "Uploaded PDF"}</Badge>
                        <span className="text-sm font-medium text-slate-700">{currentDocumentName}</span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500">{outputArtifactLabel}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <label className="cursor-pointer rounded-[18px] border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-slate-400">
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            <span>Upload book PDF</span>
                          </div>
                          <input type="file" accept="application/pdf" className="hidden" onChange={handleCustomPdfUpload} />
                        </label>
                        <Button variant="outline" className="rounded-[18px]" onClick={() => openViewer(activeHighlightId ?? undefined)} disabled={!currentPdfUrl}>
                          <FileText className="h-4 w-4" />
                          Open PDF helper
                        </Button>
                        {!usingSamplePdf ? (
                          <Button variant="ghost" className="rounded-[18px]" onClick={handleLoadDemoDocument}>
                            Use demo book
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
                    <div className="space-y-5">
                      <div>
                        <p className="text-[20px] font-semibold text-slate-900">Source passage</p>
                        <div className="mt-3 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                          <textarea
                            value={sourcePassageText}
                            onChange={(event) => {
                              setSourcePassageText(event.target.value);
                              setSourcePassageMeta(null);
                              setFeedbackGenerated(false);
                              setGeneratedStimulus(null);
                              setGenerationError(null);
                            }}
                            placeholder="Paste a quote or short passage here. You can also pull one in from the PDF helper."
                            className="min-h-[180px] w-full resize-y rounded-[20px] border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-800 outline-none transition focus:border-slate-400"
                          />
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <Button
                              variant="default"
                              className="rounded-full bg-[linear-gradient(135deg,#5b3df5_0%,#4133e6_100%)] px-6 py-3 text-sm font-medium shadow-[0_16px_40px_-24px_rgba(91,61,245,0.65)] hover:bg-[linear-gradient(135deg,#5338e2_0%,#3528cf_100%)]"
                              onClick={handleGenerateFeedback}
                              disabled={!sourcePassageText.trim() || isGenerating}
                            >
                              <Sparkles className="h-4 w-4" />
                              {isGenerating ? "Generating..." : feedbackGenerated ? "Regenerate stimulus set" : "Generate stimulus set"}
                            </Button>
                            <Button variant="ghost" className="rounded-[18px] px-3 py-2 text-xs" onClick={clearSourcePassage} disabled={!sourcePassageText && !sourcePassageMeta}>
                              Clear passage
                            </Button>
                          </div>
                          {sourcePassageMeta ? (
                            <p className="mt-3 text-xs leading-6 text-slate-500">
                              Current source: {sourcePassageMeta.kind === "manual" ? "teacher-saved PDF highlight" : "source PDF"} · {sourcePassageMeta.title}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => setSavedEvidenceOpen((current) => !current)}
                          className="flex w-full items-center justify-between rounded-[20px] border border-slate-200 bg-slate-50 px-5 py-4 text-left"
                        >
                          <span className="text-[20px] font-semibold text-slate-900">Passage Library</span>
                          {savedEvidenceOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                        </button>
                        {savedEvidenceOpen ? (
                          savedEvidenceHighlights.length ? (
                            <div className="mt-3 space-y-3">
                              {savedEvidenceHighlights.map((highlight) => (
                                <div key={highlight.id} className="rounded-[20px] border border-slate-200 bg-white p-4">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Badge tone={highlight.kind === "manual" ? "slate" : highlight.tone}>
                                      {highlight.kind === "manual" ? "Reviewer-saved evidence" : "Demo source passage"}
                                    </Badge>
                                    <span className="text-sm text-slate-500">{highlight.location}</span>
                                  </div>
                                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-700">"{highlight.quote}"</p>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    <Button variant="outline" className="rounded-[18px] px-3 py-2 text-xs" onClick={() => focusHighlight(highlight.id, { openViewer: true, scroll: true })}>
                                      View in PDF
                                    </Button>
                                    <Button variant="outline" className="rounded-[18px] px-3 py-2 text-xs" onClick={() => loadHighlightIntoSourcePassage(highlight)}>
                                      Use in box
                                    </Button>
                                    {highlight.kind === "manual" ? (
                                      <Button variant="ghost" className="rounded-[18px] px-3 py-2 text-xs" onClick={() => removeManualHighlight(highlight.id)}>
                                        Remove
                                      </Button>
                                    ) : null}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="mt-3 rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                              No saved evidence yet. Open the PDF helper and highlight text if you want reusable passages from the document.
                            </div>
                          )
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                        <p className="text-[20px] font-semibold text-slate-900">Stimulus set</p>

                        <div className="mt-5">
                          <p className="flex items-center gap-3 text-[18px] font-semibold text-slate-900">
                            <Sparkles className="h-5 w-5 text-slate-500" />
                            Title
                          </p>
                          <div className="mt-3 rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-5">
                            <p className="text-sm leading-7 text-slate-700">
                              {generatedStimulus?.title ?? "Generate a stimulus set to draft a VCE-style task title from the source passage."}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5">
                          <p className="flex items-center gap-3 text-[18px] font-semibold text-slate-900">
                            <Quote className="h-5 w-5 text-slate-500" />
                            Stimulus 1 (Quote)
                          </p>
                          <div className="mt-3 rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-5">
                            <p className="text-sm leading-7 text-slate-700">
                              {sourcePassageText.trim() ? `"${sourcePassageText.trim()}"` : "Enter a source passage to anchor the final stimulus set."}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5">
                          <p className="flex items-center gap-3 text-[18px] font-semibold text-slate-900">
                            <ImageIcon className="h-5 w-5 text-slate-500" />
                            Stimulus 2 (Image)
                          </p>
                          {generatedStimulus?.imageBase64 ? (
                            <div className="mt-3 overflow-hidden rounded-[20px] border border-slate-200 bg-white">
                              <img
                                src={`data:${generatedStimulus.imageMimeType || "image/png"};base64,${generatedStimulus.imageBase64}`}
                                alt={generatedStimulus.title}
                                className="block h-auto w-full"
                              />
                            </div>
                          ) : (
                            <div className="mt-3 rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-5">
                              <p className="text-sm leading-7 text-slate-700">
                                {generatedStimulus?.imageError
                                  ? `Image generation did not complete: ${generatedStimulus.imageError}`
                                  : "Generate a stimulus set to create an image from the source passage."}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mt-5">
                          <p className="flex items-center gap-3 text-[18px] font-semibold text-slate-900">
                            <BookOpen className="h-5 w-5 text-slate-500" />
                            Stimulus 3 (Verse)
                          </p>
                          <div className="mt-3 rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-5">
                            <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                              {generatedStimulus?.verse ?? "Generate a stimulus set to draft a short verse from the source passage."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {generationError ? (
                      <p className="rounded-[16px] border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                        {generationError}
                      </p>
                    ) : (
                      <p className="text-sm leading-6 text-slate-500">Input a source passage, then generate a title, image, and verse aligned to the selected framework.</p>
                    )}
                  </div>
                </div>
            </div> : null}
          </Card>

          <Card className="rounded-[32px] border border-slate-200/80 bg-white/95 shadow-[0_28px_80px_-42px_rgba(15,23,42,0.24)]">
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-700">
                  <Check className="h-5 w-5" />
                </div>
                <p className="text-2xl font-medium text-slate-500">Settings  - Due: Term 1, Week 9, Monday  - Instant Chat</p>
              </div>
              <button type="button" onClick={() => toggleSection("settings")} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                {sectionOpen.settings ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
              </button>
            </div>
            {sectionOpen.settings ? (
              <div className="border-t border-slate-100 px-6 py-5 text-sm leading-6 text-slate-600">
                Settings are stubbed in this prototype, but the pane now behaves like a real collapsible step. This is where scheduling, due date, and delivery controls would live.
              </div>
            ) : null}
          </Card>

          <Card className="rounded-[32px] border border-slate-200/80 bg-white/95 shadow-[0_28px_80px_-42px_rgba(15,23,42,0.24)]">
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700">4</div>
                <p className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">Preview Instructions</p>
              </div>
              <button type="button" onClick={() => toggleSection("preview")} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                {sectionOpen.preview ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
              </button>
            </div>
            {sectionOpen.preview ? (
              <div className="border-t border-slate-100 px-6 py-5 text-sm leading-6 text-slate-600">
                Preview instructions are also stubbed, but the collapse control now works. This section would eventually show the final assignment instructions generated from the selected framework and source passage.
              </div>
            ) : null}
          </Card>
        </motion.div>
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
            aria-label="Close input document modal"
          />
          <motion.div
            initial={false}
            animate={viewerOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-[min(1440px,96vw)] overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-[0_40px_120px_-48px_rgba(15,23,42,0.65)]"
          >
            <div className="flex items-center justify-between border-b border-slate-200 bg-[linear-gradient(180deg,#fffdf8_0%,#f8f6ef_100%)] px-6 py-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Input document inspection</p>
                <h2 className="mt-2 font-serif text-2xl text-slate-950">{currentDocumentName}</h2>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone="neutral">Select text to save reviewer evidence</Badge>
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
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">PDF helper context</p>
                  {activeHighlight ? (
                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={activeHighlight.tone}>{activeHighlight.kind === "manual" ? "Reviewer-saved evidence" : activeHighlight.location}</Badge>
                        {sourcePassageMeta?.id === activeHighlight.id ? <Badge tone="neutral">Inserted into passage box</Badge> : null}
                      </div>
                      <p className="mt-4 font-serif text-2xl text-slate-950">{activeHighlight.title}</p>
                      <p className="mt-4 text-sm leading-7 text-slate-700">"{activeHighlight.quote}"</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button variant="outline" className="rounded-[20px]" onClick={useActiveHighlightAsSourcePassage}>
                          Use in passage box
                        </Button>
                        {activeHighlight.kind === "manual" ? (
                          <Button variant="ghost" className="rounded-[20px]" onClick={() => removeManualHighlight(activeHighlight.id)}>
                            Delete evidence
                          </Button>
                        ) : null}
                      </div>
                      {generatedStimulus ? (
                        <>
                          <div className="mt-5 rounded-[20px] bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Stimulus title</p>
                            <p className="mt-2 text-sm leading-6 text-slate-700">{generatedStimulus.title}</p>
                          </div>
                          <div className="mt-4 rounded-[20px] bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Stimulus 3 (Verse)</p>
                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{generatedStimulus.verse}</p>
                          </div>
                          <div className="mt-4 rounded-[20px] bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Stimulus 2 (Image)</p>
                            <p className="mt-2 text-sm leading-6 text-slate-700">
                              {generatedStimulus.imageError
                                ? `Image generation failed: ${generatedStimulus.imageError}`
                                : "Image asset generated from the current source passage."}
                            </p>
                          </div>
                        </>
                      ) : null}
                    </div>
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                      Select text in the PDF if you want to pull a passage into the main textbox or save evidence for later.
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
