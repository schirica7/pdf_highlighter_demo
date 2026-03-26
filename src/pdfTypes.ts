import type { IHighlight } from "react-pdf-highlighter";
import type { Tone } from "./demoPdf";

export type DemoHighlight = IHighlight & {
  kind: "grounded" | "manual";
  tone: Tone;
  title: string;
  location: string;
  quote: string;
  paragraphId?: string;
  summary?: string;
};
