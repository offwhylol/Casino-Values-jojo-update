"use strict";

const http = require("node:http");

const API_BASE = (
  process.env.UPSTREAM_API_BASE ||
  "https://truthful-passion-production.up.railway.app/api/public/v1"
).replace(/\/+$/, "");
const API_KEY = process.env.CASINO_API_KEY;
const SITE_ORIGIN = process.env.SITE_ORIGIN
  ? new URL(process.env.SITE_ORIGIN).origin
  : "";
const PORT = Number(process.env.PORT) || 3000;

const CACHE_TTL_MS = 45_000;
const STALE_TTL_MS = 5 * 60_000;
const RETRY_DELAY_MS = 15_000;
const routes = {
  "/api/stock": { endpoint: "stock", collection: "items" },
  "/api/codes": { endpoint: "codes", collection: "codes" },
};

const cache = new Map();
const inFlight = new Map();

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=30",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  });
  response.end(JSON.stringify(body));
}

function applyCors(request, response) {
  const origin = request.headers.origin;
  response.setHeader("Vary", "Origin");

  // Browser requests are allowed only from the configured GitHub Pages site.
  if (!origin) return true;
  if (!SITE_ORIGIN || origin !== SITE_ORIGIN) return false;

  response.setHeader("Access-Control-Allow-Origin", SITE_ORIGIN);
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Accept");
  return true;
}

async function fetchCollection(route) {
  const currentTime = Date.now();
  const cached = cache.get(route.endpoint);

  if (cached && cached.expiresAt > currentTime) return cached.data;
  if (
    cached &&
    cached.retryAt > currentTime &&
    cached.staleUntil > currentTime
  ) {
    return cached.data;
  }
  if (inFlight.has(route.endpoint)) return inFlight.get(route.endpoint);

  const request = (async () => {
    try {
      if (!API_KEY) throw new Error("API key is not configured.");

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);
      let upstream;

      try {
        upstream = await fetch(API_BASE + "/" + route.endpoint, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + API_KEY,
          },
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }

      if (!upstream.ok) {
        throw new Error("API returned status " + upstream.status + ".");
      }

      const result = await upstream.json();
      if (!Array.isArray(result[route.collection])) {
        throw new Error("API response has an unexpected shape.");
      }

      const data = { [route.collection]: result[route.collection] };
      const savedAt = Date.now();
      cache.set(route.endpoint, {
        data,
        expiresAt: savedAt + CACHE_TTL_MS,
        staleUntil: savedAt + STALE_TTL_MS,
        retryAt: 0,
      });
      return data;
    } catch (error) {
      const previous = cache.get(route.endpoint);
      if (previous && previous.staleUntil > Date.now()) {
        previous.retryAt = Date.now() + RETRY_DELAY_MS;
        return previous.data;
      }

      console.error(
        "[proxy] " +
          route.endpoint +
          " request failed (" +
          (error.name || "error") +
          ")."
      );
      throw error;
    } finally {
      inFlight.delete(route.endpoint);
    }
  })();

  inFlight.set(route.endpoint, request);
  return request;
}

const server = http.createServer(async (request, response) => {
  if (!applyCors(request, response)) {
    sendJson(response, 403, { error: "Origin not allowed." });
    return;
  }

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  let pathname;
  try {
    pathname = new URL(request.url, "http://localhost").pathname;
  } catch {
    sendJson(response, 400, { error: "Invalid request." });
    return;
  }

  if (pathname === "/health" && request.method === "GET") {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method !== "GET") {
    sendJson(response, 405, { error: "Only GET requests are supported." });
    return;
  }

  const route = routes[pathname];
  if (!route) {
    sendJson(response, 404, { error: "Not found." });
    return;
  }

  if (!API_KEY) {
    sendJson(response, 503, { error: "Live API is not configured." });
    return;
  }

  try {
    const data = await fetchCollection(route);
    sendJson(response, 200, data);
  } catch {
    sendJson(response, 502, { error: "Live data is temporarily unavailable." });
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("CasinoValues API proxy listening on port " + PORT + ".");
});
