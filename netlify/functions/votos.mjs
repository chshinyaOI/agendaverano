// Netlify Function: guarda y lee los votos de Operación Volantín en Netlify Blobs.
// GET  /api/votos  -> [{id, n, c, d, t}, ...]
// POST /api/votos  {id, n, c, d} -> guarda/actualiza el volantín de esa persona
import { getStore } from "@netlify/blobs";

const NCOLORS = 10;
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const ID = /^[a-f0-9]{8,40}$/;

function clean(body) {
  const n = typeof body.n === "string" ? body.n.trim().slice(0, 24) : "";
  const c = Number.isInteger(body.c) && body.c >= 0 && body.c < NCOLORS ? body.c : null;
  const d = {};
  const src = body.d && typeof body.d === "object" ? body.d : {};
  for (const k of Object.keys(src).slice(0, 80)) {
    if (DAY.test(k) && (src[k] === "si" || src[k] === "q")) d[k] = src[k];
  }
  return { n, c, d, t: Date.now() };
}

export default async (req) => {
  const store = getStore({ name: "volantin", consistency: "strong" });

  if (req.method === "GET") {
    const { blobs } = await store.list();
    const rows = await Promise.all(
      blobs.map(async (b) => {
        const v = await store.get(b.key, { type: "json" });
        return v ? { id: b.key, ...v } : null;
      })
    );
    return Response.json(rows.filter(Boolean), { headers: { "Cache-Control": "no-store" } });
  }

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return new Response("JSON inválido", { status: 400 }); }
    if (!body || typeof body.id !== "string" || !ID.test(body.id)) {
      return new Response("id inválido", { status: 400 });
    }
    const { blobs } = await store.list();
    if (blobs.length >= 40 && !blobs.some((b) => b.key === body.id)) {
      return new Response("Demasiados volantines", { status: 429 });
    }
    await store.setJSON(body.id, clean(body));
    return Response.json({ ok: true });
  }

  return new Response("Método no permitido", { status: 405 });
};

export const config = { path: "/api/votos" };
