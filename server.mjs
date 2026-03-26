import http from "node:http";
import { createServer as createViteServer, loadEnv } from "vite";
import openAiHandler from "./api/generate-stimulus.js";

const mode = process.env.NODE_ENV || "development";
const env = loadEnv(mode, process.cwd(), "");

for (const [key, value] of Object.entries(env)) {
  if (!(key in process.env)) {
    process.env[key] = value;
  }
}

async function start() {
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
    },
    appType: "spa",
  });

  const server = http.createServer(async (req, res) => {
    if (!req.url) {
      res.statusCode = 400;
      res.end("Missing request URL");
      return;
    }

    if (req.url.startsWith("/api/generate-stimulus")) {
      try {
        await openAiHandler(req, res);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected server error";
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: message }));
      }
      return;
    }

    vite.middlewares(req, res, () => {
      res.statusCode = 404;
      res.end("Not Found");
    });
  });

  const port = Number(process.env.PORT || 5173);
  server.listen(port, () => {
    console.log(`Local dev server running at http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
