import { memo } from "react";
import "react-pdf-highlighter/dist/style.css";
import type { ScaledPosition } from "react-pdf-highlighter";
import { PdfHighlighter, PdfLoader } from "react-pdf-highlighter";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type { DemoHighlight } from "./pdfTypes";

type ViewportRect = {
  left: number;
  top: number;
  width: number;
  height: number;
  pageNumber?: number;
};

type ViewportHighlight = Omit<DemoHighlight, "position"> & {
  position: {
    boundingRect: ViewportRect;
    rects: ViewportRect[];
    pageNumber: number;
  };
};

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

function clearBrowserSelection() {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  selection.removeAllRanges();
}

function HighlightTip({ highlight }: { highlight: DemoHighlight | ViewportHighlight }) {
  return (
    <div className="max-w-xs rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {highlight.kind === "manual" ? "Manual highlight" : highlight.location}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{highlight.title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{highlight.quote}</p>
    </div>
  );
}

function TextHighlight({
  highlight,
  active,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  highlight: ViewportHighlight;
  active: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const background = active ? "rgba(255, 226, 143, 0.92)" : "rgba(148, 163, 184, 0.28)";
  const border = active ? "rgba(217, 119, 6, 0.95)" : "rgba(100, 116, 139, 0.62)";

  return (
    <div>
      {highlight.position.rects.map((rect, index) => (
        <button
          key={`${highlight.id}-${index}`}
          type="button"
          data-highlight-overlay="true"
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="absolute rounded-md transition focus:outline-none focus:ring-0"
          style={{
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            background,
            border: `1px solid ${border}`,
            boxShadow: active ? `0 0 0 2px ${border}` : "none",
          }}
        />
      ))}
    </div>
  );
}

type PdfViewerPaneProps = {
  currentPdfUrl: string;
  viewerError: string | null;
  allHighlights: DemoHighlight[];
  activeHighlightId: string | null;
  onViewerError: (message: string) => void;
  onStoreScrollTo: (scrollTo: (highlight: DemoHighlight) => void) => void;
  onManualSelection: (position: ScaledPosition, text?: string) => void;
  onHighlightSelect: (highlightId: string) => void;
  onClearActiveHighlight: () => void;
};

export default memo(
  function PdfViewerPane({
    currentPdfUrl,
    viewerError,
    allHighlights,
    activeHighlightId,
    onViewerError,
    onStoreScrollTo,
    onManualSelection,
    onHighlightSelect,
    onClearActiveHighlight,
  }: PdfViewerPaneProps) {
    if (viewerError) {
      return <LoadingShell message={viewerError} />;
    }

    if (!currentPdfUrl) {
      return <LoadingShell message="Preparing the generated sample PDF..." />;
    }

    return (
      <PdfLoader
        url={currentPdfUrl}
        workerSrc={pdfWorkerUrl}
        beforeLoad={<LoadingShell message="Rendering the PDF viewer..." />}
        onError={(error) => onViewerError(error.message)}
      >
        {(pdfDocument) => (
          <div
            className="pdf-shell relative h-full"
            onMouseDownCapture={(event) => {
              if (!(event.target instanceof HTMLElement)) {
                return;
              }

              if (event.target.closest("[data-highlight-overlay='true']")) {
                return;
              }

              onClearActiveHighlight();
            }}
          >
            <PdfHighlighter<DemoHighlight>
              pdfDocument={pdfDocument}
              highlights={allHighlights}
              onScrollChange={() => undefined}
              scrollRef={(scrollTo) => {
                onStoreScrollTo(scrollTo);
              }}
              pdfScaleValue="page-width"
              enableAreaSelection={() => false}
              onSelectionFinished={(position, content, hideTipAndSelection) => {
                onManualSelection(position, content.text);
                hideTipAndSelection();
                clearBrowserSelection();
                return null;
              }}
              highlightTransform={(highlight, _index, setTip, hideTip) => (
                <TextHighlight
                  highlight={highlight}
                  active={activeHighlightId === highlight.id}
                  onClick={() => onHighlightSelect(highlight.id)}
                  onMouseEnter={() => setTip(highlight, () => <HighlightTip highlight={highlight} />)}
                  onMouseLeave={hideTip}
                />
              )}
            />
          </div>
        )}
      </PdfLoader>
    );
  },
  (prev, next) =>
    prev.currentPdfUrl === next.currentPdfUrl &&
    prev.viewerError === next.viewerError &&
    prev.activeHighlightId === next.activeHighlightId &&
    prev.allHighlights === next.allHighlights
);
