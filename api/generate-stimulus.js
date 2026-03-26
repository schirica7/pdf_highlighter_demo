const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const OPENAI_IMAGE_API_URL = "https://api.openai.com/v1/images/generations";
const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-5-mini";
const DEFAULT_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";

const stimulusSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "imagePrompt", "verse"],
  properties: {
    title: {
      type: "string",
      description: "A concise, classroom-appropriate title for the final writing task.",
    },
    imagePrompt: {
      type: "string",
      description: "An exam-safe image prompt derived from the framework. It should be tangentially inspired by the source passage but not closely based on it, and should be suitable for generating an image that complements the verse stimulus.",
    },
    verse: {
      type: "string",
      description: "A short free-verse style stimulus that relates to the framework. It should be tangentially inspired by the source passage but not closely based on it.",
    },
  },
};

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function extractStructuredJson(data) {
  if (data?.output_parsed && typeof data.output_parsed === "object") {
    return data.output_parsed;
  }

  const outputTextFromArray = data?.output
    ?.flatMap((item) => item?.content ?? [])
    ?.find((contentItem) => contentItem?.type === "output_text" && typeof contentItem?.text === "string")
    ?.text;

  if (outputTextFromArray) {
    return JSON.parse(outputTextFromArray);
  }

  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return JSON.parse(data.output_text);
  }

  return null;
}

async function generateImage(prompt) {
  const response = await fetch(OPENAI_IMAGE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEFAULT_IMAGE_MODEL,
      prompt,
      size: "1024x1024",
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const message = data?.error?.message || data?.message || "Image generation failed";
    throw new Error(message);
  }

  const image = data?.data?.[0];
  if (!image?.b64_json) {
    throw new Error("Image API returned no image data");
  }

  return {
    imageBase64: image.b64_json,
    imageMimeType: image?.mime_type || "image/png",
  };
}

function getRequestBody(req) {
  if (typeof req.body === "object" && req.body !== null) {
    return req.body;
  }

  if (typeof req.body === "string" && req.body.trim()) {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }

  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw.trim()) {
        resolve(null);
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve(null);
      }
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return json(res, 500, { error: "Missing OPENAI_API_KEY" });
  }

  const body = await getRequestBody(req);
  if (!body || typeof body !== "object") {
    return json(res, 400, { error: "Invalid JSON body" });
  }

  const {
    frameworkId,
    frameworkLabel,
    sourceTitle,
    sourcePassageText,
    sourcePassageMeta,
    quotePassage,
    imagePassage,
    versePassage,
  } = body;

  if (!frameworkId || !frameworkLabel) {
    return json(res, 400, { error: "frameworkId and frameworkLabel are required" });
  }

  const normalizedSourcePassage =
    typeof sourcePassageText === "string" && sourcePassageText.trim()
      ? {
          quote: sourcePassageText.trim(),
          title: sourcePassageMeta?.title || "Source passage",
          location: sourcePassageMeta?.location || "Typed or pasted passage",
        }
      : null;

  const primaryPassage = normalizedSourcePassage || quotePassage || imagePassage || versePassage || null;
  if (!primaryPassage?.quote) {
    return json(res, 400, { error: "A source passage is required" });
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      input: [
        {
          role: "developer",
          content: [
            {
              type: "input_text",
              text:
                "You are helping a teacher build VCE English Creating Texts stimuli. Return JSON only. Generate materials that feel classroom-ready, specific, and imaginative without copying the source passage too closely. Keep outputs exam-safe and age-appropriate.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: [
                `Framework: ${frameworkLabel} (${frameworkId})`,
                `Source text: ${sourceTitle || "Teacher-uploaded text"}`,
                `Source passage: "${primaryPassage.quote}" (${primaryPassage.title || "Selected passage"}; ${primaryPassage.location || "Unknown location"})`,
                "Create one concise Creating Texts stimulus set with a title, an image prompt, and a short verse stimulus.",
                "The title should feel like a plausible VCE-style task title.",
                "Treat the supplied source passage as the anchor for the full set.",
              ].join("\n"),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "stimulus_set",
          strict: true,
          schema: stimulusSchema,
        },
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.error?.message || data?.message || "OpenAI request failed";
    return json(res, response.status, { error: message });
  }

  try {
    const parsed = extractStructuredJson(data);
    if (!parsed) {
      return json(res, 502, { error: "OpenAI returned no structured output" });
    }

    try {
      const generatedImage = await generateImage(parsed.imagePrompt);
      parsed.imageBase64 = generatedImage.imageBase64;
      parsed.imageMimeType = generatedImage.imageMimeType;
    } catch (imageError) {
      parsed.imageError = imageError instanceof Error ? imageError.message : "Image generation failed";
    }

    return json(res, 200, { stimulus: parsed });
  } catch {
    return json(res, 502, { error: "Could not parse OpenAI response JSON" });
  }
}
