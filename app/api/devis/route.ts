import { NextResponse } from "next/server";
import type { DevisPayload } from "@/content/devis";

// Les demandes sont transmises au webhook DEVIS_WEBHOOK_URL (ex. un workflow n8n
// qui envoie l'email / crée la fiche). Sans webhook configuré, on renvoie une
// erreur explicite : jamais de faux « envoyé » qui ferait perdre une demande.

const MAX = 2000;
const clip = (v: unknown, n = 200) => (typeof v === "string" ? v.trim().slice(0, n) : "");

function normalize(input: Record<string, unknown>): DevisPayload | string {
  const sansDate = input.sansDate === true || input.sansDate === "on" || input.sansDate === "true";
  const p: DevisPayload = {
    nom: clip(input.nom),
    telephone: clip(input.telephone, 40),
    email: clip(input.email, 200),
    type: clip(input.type, 80),
    date: sansDate ? null : clip(input.date, 20) || null,
    sansDate,
    invites: clip(input.invites, 10) || undefined,
    budget: clip(input.budget, 60) || undefined,
    lieu: clip(input.lieu) || undefined,
    ambiance: clip(input.ambiance) || undefined,
    message: clip(input.message, MAX) || undefined,
    formule: clip(input.formule, 60) || undefined,
  };
  if (!p.nom) return "Merci d'indiquer votre nom.";
  if (!/^[0-9+().\s-]{8,}$/.test(p.telephone)) return "Merci d'indiquer un numéro de téléphone valide.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) return "Merci d'indiquer un email valide.";
  if (!p.type) return "Merci de choisir un type d'événement.";
  if (!p.sansDate && !p.date) return "Merci d'indiquer une date, ou de cocher « Je n'ai pas encore de date ».";
  return p;
}

async function forward(payload: DevisPayload) {
  const url = process.env.DEVIS_WEBHOOK_URL;
  if (!url) return { ok: false, error: "Le formulaire n'est pas encore relié à notre messagerie." };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, source: "site", receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok ? { ok: true } : { ok: false, error: "Envoi impossible pour le moment." };
  } catch {
    return { ok: false, error: "Envoi impossible pour le moment." };
  }
}

export async function POST(req: Request) {
  const isJson = req.headers.get("content-type")?.includes("application/json");
  let input: Record<string, unknown>;
  try {
    input = isJson ? await req.json() : Object.fromEntries((await req.formData()).entries());
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  if (input.site) return NextResponse.json({ ok: true }); // pot de miel : on ignore

  const payload = normalize(input);
  if (typeof payload === "string") {
    return isJson
      ? NextResponse.json({ error: payload }, { status: 422 })
      : new NextResponse(payload, { status: 422, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  const result = await forward(payload);
  if (!isJson) {
    // Envoi sans JS : retour sur le formulaire.
    const to = new URL(result.ok ? "/devis?devis=ok" : "/devis?devis=erreur", req.url);
    return NextResponse.redirect(to, 303);
  }
  return result.ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: result.error }, { status: 503 });
}
