import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { Scaled, ScaledPosition } from "react-pdf-highlighter";

export type Tone = "emerald" | "sky" | "amber" | "slate";
export type FrameworkId = "country" | "protest" | "personal-journeys" | "play";

export type EssayParagraph = {
  id: string;
  label: string;
  text: string;
};

export type FeedbackCard = {
  id: string;
  paragraphId: string;
  title: string;
  summary: string;
  nextStep: string;
  rationale: string;
  passageId: string;
  tone: Tone;
  status: string;
  stimulusType: "Quote" | "Image" | "Verse";
  stimulusBody: string;
  stimulusCaption?: string;
};

export type DemoPassage = {
  id: string;
  title: string;
  location: string;
  quote: string;
  tone: Tone;
  position: ScaledPosition;
};

export type GeneratedDemoPdf = {
  url: string;
  passages: DemoPassage[];
  cleanup: () => void;
};

export type StimulusSet = {
  title: string;
  frameworkLabel: string;
  description: string;
  items: FeedbackCard[];
};

const PAGE = {
  width: 612,
  height: 792,
  marginX: 58,
  startY: 722,
};

const BODY_SIZE = 12;
const QUOTE_SIZE = 12.5;
const LINE_GAP = 6;

export const demoDocumentTitle = "Born a Crime - Uploaded teacher text (demo)";
export const frameworkOptions: Array<{ id: FrameworkId; label: string }> = [
  { id: "country", label: "Writing about country" },
  { id: "protest", label: "Writing about protest" },
  { id: "personal-journeys", label: "Writing about personal journeys" },
  { id: "play", label: "Writing about play" },
];

export const essayParagraphs: EssayParagraph[] = [
  {
    id: "para-1",
    label: "Paragraph 1",
    text:
      "Noah presents language as a survival tool shaped by his mother's deliberate choices rather than as a neutral background detail in his childhood.",
  },
  {
    id: "para-2",
    label: "Paragraph 2",
    text:
      "His ability to move between groups shows that language gave him unusual social access and prevented him from being fixed inside one identity.",
  },
  {
    id: "para-3",
    label: "Paragraph 3",
    text:
      "The memoir also suggests that language and humor can create recognition between people who would otherwise stay divided by suspicion or prejudice.",
  },
];

export const stimulusSets: Record<FrameworkId, StimulusSet> = {
  country: {
    title: "'Finding a Place to Stand'",
    frameworkLabel: "Writing about country",
    description: "Generate a set that foregrounds place, belonging, displacement, and the meanings attached to where a person stands.",
    items: [
      {
        id: "country-1",
        paragraphId: "para-1",
        title: "Stimulus 1",
        summary: "Invite students to write about how place shapes identity before a character has the language to explain themselves.",
        nextStep: "Use the passage to move students toward belonging, inheritance, and the pressure to fit a space that may not fully recognise them.",
        rationale: "The line about language defining who you are can be reframed through place: country is not just geography, but a system of recognition.",
        passageId: "passage-1",
        tone: "emerald",
        status: "Belonging and place",
        stimulusType: "Quote",
        stimulusBody: "\"Sometimes the place you stand decides who others believe you are before you speak.\"",
        stimulusCaption: "Quote",
      },
      {
        id: "country-2",
        paragraphId: "para-2",
        title: "Stimulus 2",
        summary: "Push students toward a scene in which moving across spaces means shifting identity, loyalty, or self-presentation.",
        nextStep: "Frame the writing around crossing boundaries, entering unfamiliar ground, or learning how different places demand different selves.",
        rationale: "This source passage already contains movement between groups, which can be translated into movement between worlds or places.",
        passageId: "passage-2",
        tone: "sky",
        status: "Borders and movement",
        stimulusType: "Image",
        stimulusBody: "A solitary figure at the meeting point of several tracks, each path marked by a different landscape and a different waiting audience.",
        stimulusCaption: "Image prompt",
      },
      {
        id: "country-3",
        paragraphId: "para-3",
        title: "Stimulus 3",
        summary: "Offer a verse stimulus about finding connection in a place that first feels guarded or closed.",
        nextStep: "Use this for a more lyrical or reflective task where students show how a place changes once recognition begins.",
        rationale: "Humor becoming connection can be reshaped into the emotional experience of a place softening or opening to someone.",
        passageId: "passage-3",
        tone: "amber",
        status: "Recognition and home",
        stimulusType: "Verse",
        stimulusBody:
          "The ground was not mine\nuntil it answered back.\nOne laugh,\none name,\nand the distance shifted.",
        stimulusCaption: "Verse",
      },
    ],
  },
  protest: {
    title: "'The Moment You Refuse'",
    frameworkLabel: "Writing about protest",
    description: "Generate a set that centres resistance, speaking back, disruption, and the risk that comes with refusing a prescribed role.",
    items: [
      {
        id: "protest-1",
        paragraphId: "para-1",
        title: "Stimulus 1",
        summary: "Ask students to write about learning language as an act of resistance rather than compliance.",
        nextStep: "Lean into the idea that naming yourself, or refusing the label others impose, can itself be a protest.",
        rationale: "The passage treats language as strategy. In a protest framing, that strategy becomes a way of refusing imposed identity.",
        passageId: "passage-1",
        tone: "emerald",
        status: "Voice and resistance",
        stimulusType: "Quote",
        stimulusBody: "\"Sometimes protest begins in the moment you choose the words that others hoped you would never learn.\"",
        stimulusCaption: "Quote",
      },
      {
        id: "protest-2",
        paragraphId: "para-2",
        title: "Stimulus 2",
        summary: "Invite a scene where a character uses performance, code-switching, or tactical adaptation to challenge a barrier in front of them.",
        nextStep: "Frame the conflict around systems of access: who gets through, who is stopped, and what it costs to move anyway.",
        rationale: "The chameleon passage already holds tension, barriers, and a tactic for getting past them, which is a natural basis for protest writing.",
        passageId: "passage-2",
        tone: "sky",
        status: "Crossing the line",
        stimulusType: "Image",
        stimulusBody: "A checkpoint, a crowd, and one person stepping across the painted boundary while every other figure turns to watch.",
        stimulusCaption: "Image prompt",
      },
      {
        id: "protest-3",
        paragraphId: "para-3",
        title: "Stimulus 3",
        summary: "Offer a verse stimulus where connection becomes a quiet challenge to fear, authority, or division.",
        nextStep: "Use it for a response that explores how protest can sometimes begin through human connection rather than confrontation alone.",
        rationale: "The source gives you a softer protest angle: not slogans, but the act of reducing distance and refusing suspicion.",
        passageId: "passage-3",
        tone: "amber",
        status: "Defiance and solidarity",
        stimulusType: "Verse",
        stimulusBody:
          "We did not shout first.\nWe opened a space.\nLaughter crossed it,\nand after that\nsilence could not hold.",
        stimulusCaption: "Verse",
      },
    ],
  },
  "personal-journeys": {
    title: "'Speaking Yourself Into View'",
    frameworkLabel: "Writing about personal journeys",
    description: "Generate a set that focuses on identity, movement, self-discovery, and the way people change as they cross between worlds.",
    items: [
      {
        id: "personal-journeys-1",
        paragraphId: "para-1",
        title: "Stimulus 1",
        summary: "Invite students to craft a narrative or reflective piece where a character learns that language changes how they are seen, trusted, or protected.",
        nextStep: "Frame the task around deliberate teaching, code-switching, or the pressure to read a room before speaking.",
        rationale: "This passage gives the teacher a clear way into identity, performance, and social strategy without handing students a fully formed plot.",
        passageId: "passage-1",
        tone: "emerald",
        status: "Identity and voice",
        stimulusType: "Quote",
        stimulusBody: "\"Language, even more than colour, tells people who you are before you explain yourself.\"",
        stimulusCaption: "Quote",
      },
      {
        id: "personal-journeys-2",
        paragraphId: "para-2",
        title: "Stimulus 2",
        summary: "Ask students to write a scene where a character crosses a social boundary by shifting language, tone, or persona to gain access.",
        nextStep: "Push the class toward tension: what is gained by adaptation, and what gets blurred or compromised in the process?",
        rationale: "The source passage already contains movement, performance, and social friction, so it can seed a strong Creating Texts prompt with minimal extra scaffolding.",
        passageId: "passage-2",
        tone: "sky",
        status: "Belonging and access",
        stimulusType: "Image",
        stimulusBody: "An image of one figure standing where three paths cross, each path leading toward a different crowd, with the figure half-turned as if deciding which version of themselves to perform.",
        stimulusCaption: "Image prompt",
      },
      {
        id: "personal-journeys-3",
        paragraphId: "para-3",
        title: "Stimulus 3",
        summary: "Build a prompt around a moment where humor opens a connection that argument or authority could not create on its own.",
        nextStep: "Use this as a voice-rich stimulus and ask students to show the shift from tension to recognition in a single interaction.",
        rationale: "It gives teachers a compact passage with emotional movement already built in, which makes it easy to derive a believable stimulus.",
        passageId: "passage-3",
        tone: "amber",
        status: "Connection and conflict",
        stimulusType: "Verse",
        stimulusBody:
          "I offered laughter first\nso judgment would wait.\nA room that would not hear me\npaused,\nthen opened.",
        stimulusCaption: "Verse",
      },
    ],
  },
  play: {
    title: "'The Rules of the Game'",
    frameworkLabel: "Writing about play",
    description: "Generate a set that explores play as testing, performance, improvisation, and the tension between freedom and social rules.",
    items: [
      {
        id: "play-1",
        paragraphId: "para-1",
        title: "Stimulus 1",
        summary: "Push students toward a voice that discovers how identity can be rehearsed, tried on, or strategically performed.",
        nextStep: "Use the passage to frame play as experimentation: what happens when a character learns the rules by speaking differently?",
        rationale: "Language here is not just communication but performance, which fits a framework interested in roles, rehearsal, and social play.",
        passageId: "passage-1",
        tone: "emerald",
        status: "Performance and role",
        stimulusType: "Quote",
        stimulusBody: "\"Sometimes you play a part before you understand that the room has already cast you.\"",
        stimulusCaption: "Quote",
      },
      {
        id: "play-2",
        paragraphId: "para-2",
        title: "Stimulus 2",
        summary: "Invite a scene where playfulness, imitation, or role-switching lets a character move between spaces that usually stay separate.",
        nextStep: "Build the task around masks, shifts in persona, or the risk that comes when the game becomes too real.",
        rationale: "The chameleon image naturally supports a play framework because the character is already switching roles in response to audience and context.",
        passageId: "passage-2",
        tone: "sky",
        status: "Masks and movement",
        stimulusType: "Image",
        stimulusBody: "A figure standing backstage between several costumes, each doorway ahead opening onto a different audience and a different version of the self.",
        stimulusCaption: "Image prompt",
      },
      {
        id: "play-3",
        paragraphId: "para-3",
        title: "Stimulus 3",
        summary: "Offer a verse stimulus where humor changes the atmosphere, turning conflict into a moment of improvisation or shared play.",
        nextStep: "Use it for writing that shows how play can reveal truths that serious language cannot reach directly.",
        rationale: "This source passage turns humor into a social mechanism, which maps cleanly onto a framework about play, energy, and shared performance.",
        passageId: "passage-3",
        tone: "amber",
        status: "Humor and release",
        stimulusType: "Verse",
        stimulusBody:
          "We broke the tension\nlike children break a rule:\nwith one wrong grin,\none shared beat,\nand suddenly a game began.",
        stimulusCaption: "Verse",
      },
    ],
  },
};

type PassageSeed = Omit<DemoPassage, "position">;

const passageSeeds: PassageSeed[] = [
  {
    id: "passage-1",
    title: "Language taught as strategy",
    location: "Page 1 · section 1",
    quote:
      "My mother wanted me to learn English, Xhosa, Zulu, Tswana, and Afrikaans. She understood that language, even more than color, defined who you were to people.",
    tone: "emerald",
  },
  {
    id: "passage-2",
    title: "Crossing social boundaries",
    location: "Page 1 · section 2",
    quote:
      "If you spoke to someone in the right language, you could get past whatever walls were between you. I became a chameleon, changing depending on who was in front of me.",
    tone: "sky",
  },
  {
    id: "passage-3",
    title: "Humor creating an opening",
    location: "Page 1 · section 3",
    quote:
      "Humor let me bridge gaps that argument never could. If people laughed with you, they were already listening.",
    tone: "amber",
  },
];

type WrappedLine = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    const candidateWidth = font.widthOfTextAtSize(candidate, fontSize);

    if (candidateWidth <= maxWidth) {
      currentLine = candidate;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
    }
    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function drawWrappedTextBlock(
  page: PDFPage,
  font: PDFFont,
  text: string,
  options: {
    x: number;
    y: number;
    size: number;
    maxWidth: number;
    color: ReturnType<typeof rgb>;
  }
) {
  const lines = wrapText(text, font, options.size, options.maxWidth);
  const rects: WrappedLine[] = [];

  lines.forEach((line, index) => {
    const lineY = options.y - index * (options.size + LINE_GAP);
    const width = font.widthOfTextAtSize(line, options.size);

    page.drawText(line, {
      x: options.x,
      y: lineY,
      size: options.size,
      font,
      color: options.color,
    });

    rects.push({
      x1: options.x - 3,
      y1: lineY - 3,
      x2: options.x + width + 4,
      y2: lineY + options.size + 4,
    });
  });

  return {
    nextY: options.y - lines.length * (options.size + LINE_GAP),
    rects,
  };
}

function toScaledRect(rect: WrappedLine): Scaled {
  return {
    ...rect,
    width: PAGE.width,
    height: PAGE.height,
    pageNumber: 1,
  };
}

function buildPosition(rects: WrappedLine[]): ScaledPosition {
  const boundingRect = {
    x1: Math.min(...rects.map((rect) => rect.x1)),
    y1: Math.min(...rects.map((rect) => rect.y1)),
    x2: Math.max(...rects.map((rect) => rect.x2)),
    y2: Math.max(...rects.map((rect) => rect.y2)),
    width: PAGE.width,
    height: PAGE.height,
    pageNumber: 1,
  };

  return {
    boundingRect,
    rects: rects.map(toScaledRect),
    pageNumber: 1,
    usePdfCoordinates: true,
  };
}

async function makeDemoPdf() {
  const pdfDocument = await PDFDocument.create();
  const page = pdfDocument.addPage([PAGE.width, PAGE.height]);
  const headingFont = await pdfDocument.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdfDocument.embedFont(StandardFonts.Helvetica);
  const accentColor = rgb(0.11, 0.17, 0.24);
  const mutedColor = rgb(0.37, 0.44, 0.5);
  const sectionColor = rgb(0.2, 0.27, 0.35);
  let y = PAGE.startY;

  page.drawText("Uploaded text: Trevor Noah excerpt", {
    x: PAGE.marginX,
    y,
    size: 20,
    font: headingFont,
    color: accentColor,
  });
  y -= 32;

  page.drawText("Prototype artifact for grounded Creating Texts stimuli", {
    x: PAGE.marginX,
    y,
    size: 11,
    font: bodyFont,
    color: mutedColor,
  });
  y -= 34;

  const intro = drawWrappedTextBlock(page, bodyFont, "This sample PDF stands in for a teacher-uploaded text. The prototype focuses on helping a teacher inspect which exact passages could seed a Creating Texts stimulus before assigning it to students.", {
    x: PAGE.marginX,
    y,
    size: BODY_SIZE,
    maxWidth: PAGE.width - PAGE.marginX * 2,
    color: accentColor,
  });
  y = intro.nextY - 18;

  const passages: DemoPassage[] = [];

  for (const [index, seed] of passageSeeds.entries()) {
    page.drawText(`Section ${index + 1}`, {
      x: PAGE.marginX,
      y,
      size: 10.5,
      font: headingFont,
      color: mutedColor,
    });
    y -= 18;

    page.drawText(seed.title, {
      x: PAGE.marginX,
      y,
      size: 13,
      font: headingFont,
      color: sectionColor,
    });
    y -= 24;

    const quoteBlock = drawWrappedTextBlock(page, bodyFont, seed.quote, {
      x: PAGE.marginX + 18,
      y,
      size: QUOTE_SIZE,
      maxWidth: PAGE.width - PAGE.marginX * 2 - 24,
      color: accentColor,
    });

    passages.push({
      ...seed,
      position: buildPosition(quoteBlock.rects),
    });

    y = quoteBlock.nextY - 14;

    const contextBlock = drawWrappedTextBlock(
      page,
      bodyFont,
      index === 0
        ? "This moment is where language becomes a deliberate strategy for how Noah will be perceived."
        : index === 1
          ? "The social movement here comes from code-switching, not from confidence alone."
          : "The point is not just that humor is entertaining, but that it lowers resistance and creates an opening."
      ,
      {
        x: PAGE.marginX,
        y,
        size: 11,
        maxWidth: PAGE.width - PAGE.marginX * 2,
        color: mutedColor,
      }
    );

    y = contextBlock.nextY - 28;
  }

  const bytes = await pdfDocument.save();
  const blobBytes = new Uint8Array(bytes.byteLength);
  blobBytes.set(bytes);
  const blob = new Blob([blobBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  return {
    url,
    passages,
    cleanup: () => URL.revokeObjectURL(url),
  };
}

export async function createGeneratedDemoPdf(): Promise<GeneratedDemoPdf> {
  return makeDemoPdf();
}
