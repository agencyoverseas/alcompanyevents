"use client";

import { AnimatePresence, m } from "motion/react";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { useId, useState, useSyncExternalStore, type FormEvent } from "react";
import { budgets, eventTypes, type DevisPayload } from "@/content/devis";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { fade } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-[10px] border border-night-3 bg-night px-4 py-3 text-[0.95rem] text-light placeholder:text-muted-d/70 transition-colors focus:border-gold-l focus:outline-none focus-visible:outline-2 focus-visible:outline-gold-l disabled:opacity-40";

function Field({
  label,
  required,
  children,
  className,
  htmlFor,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  htmlFor: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="smallcaps mb-2 block text-muted-d">
        {label}
        {required ? (
          <span className="text-gold-l" aria-hidden>
            {" "}
            *
          </span>
        ) : (
          <span className="normal-case tracking-normal"> (facultatif)</span>
        )}
      </label>
      {children}
    </div>
  );
}

/**
 * Formulaire de devis : 8 champs, 5 obligatoires (nom, téléphone, email, type, date).
 * « Je n'ai pas encore de date » désactive le champ date → envoyable sans date.
 * Pré-rempli depuis une formule : /?type=…&formule=…#devis.
 * Fonctionne sans JS (POST natif vers /api/devis, redirection).
 */
// La query string ne change qu'à la navigation : pas d'abonnement nécessaire.
const noop = () => () => {};
const readSearch = () => window.location.search;

type Prefill = { type: string; formule: string; message: string; sent: boolean };

function parsePrefill(search: string): Prefill {
  const q = new URLSearchParams(search);
  const t = q.get("type");
  const f = q.get("formule") ?? "";
  return {
    type: t ? ((eventTypes as readonly string[]).includes(t) ? t : "Autre") : "",
    formule: f,
    message: f ? `Formule qui m'intéresse : ${f}${t ? ` (${t})` : ""}.\n` : "",
    sent: q.get("devis") === "ok",
  };
}

export function DevisForm() {
  // Serveur et hydratation : "" ; ensuite la vraie query string. Le formulaire est
  // remonté (key) avec le pré-remplissage venu d'une formule.
  const search = useSyncExternalStore(noop, readSearch, () => "");
  return <DevisFormInner key={search} prefill={parsePrefill(search)} />;
}

function DevisFormInner({ prefill }: { prefill: Prefill }) {
  const id = useId();
  const [type, setType] = useState(prefill.type);
  const formule = prefill.formule;
  const [message, setMessage] = useState(prefill.message);
  const [noDate, setNoDate] = useState(false);
  const [status, setStatus] = useState<Status>(prefill.sent ? "sent" : "idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("site")) return; // pot de miel
    const payload: DevisPayload = {
      nom: String(fd.get("nom") ?? "").trim(),
      telephone: String(fd.get("telephone") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      type: String(fd.get("type") ?? ""),
      date: noDate ? null : String(fd.get("date") ?? "") || null,
      sansDate: noDate,
      invites: String(fd.get("invites") ?? "") || undefined,
      budget: String(fd.get("budget") ?? "") || undefined,
      lieu: String(fd.get("lieu") ?? "").trim() || undefined,
      message: String(fd.get("message") ?? "").trim() || undefined,
      formule: formule || undefined,
    };
    setStatus("sending");
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Envoi impossible pour le moment.");
      setStatus("sent");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Envoi impossible pour le moment.");
      setStatus("error");
    }
  }

  const whatsappText = encodeURIComponent(
    `Bonjour Audrey, je souhaite un devis${type ? ` pour : ${type}` : ""}${formule ? ` (formule ${formule})` : ""}.`,
  );

  return (
    <section id="devis" aria-labelledby="devis-title" className="relative scroll-mt-24 py-20 sm:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-[16px] border border-night-3 bg-night-2 p-5 sm:p-10 lg:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full [background:radial-gradient(circle,rgba(201,162,91,.18),transparent_65%)]"
          />
          <Reveal className="relative max-w-2xl">
            <Eyebrow>Demande de devis</Eyebrow>
            <h2 id="devis-title" className="h2-display mt-4 text-light">
              Parlez-nous de <em className="text-gold-l">votre événement</em>
            </h2>
            <p className="mt-4 text-muted-d">
              Quelques infos suffisent pour un premier devis. Pas encore de date ? Cochez la case : on vous aide à y
              voir clair.
            </p>
          </Reveal>

          <AnimatePresence mode="wait" initial={false}>
            {status === "sent" ? (
              <m.div
                key="ok"
                variants={fade}
                initial="hidden"
                animate="show"
                exit="hidden"
                role="status"
                className="relative mt-10 flex items-start gap-4 rounded-[10px] border border-gold/40 bg-night p-6"
              >
                <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-gold-l" aria-hidden />
                <div>
                  <p className="font-display text-2xl text-light">Merci, votre demande est bien partie.</p>
                  <p className="mt-1 text-muted-d">Audrey revient vers vous très vite, par téléphone ou par email.</p>
                </div>
              </m.div>
            ) : (
              <m.form
                key="form"
                variants={fade}
                initial="hidden"
                animate="show"
                exit="hidden"
                action="/api/devis"
                method="post"
                onSubmit={onSubmit}
                className="relative mt-10 grid gap-5 md:grid-cols-6"
                noValidate={false}
              >
                <input type="hidden" name="formule" value={formule} />
                {/* Pot de miel anti-spam */}
                <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
                  <label>
                    Site web <input name="site" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <Field label="Nom" required htmlFor={`${id}-nom`} className="md:col-span-2">
                  <input id={`${id}-nom`} name="nom" required autoComplete="name" className={field} />
                </Field>
                <Field label="Téléphone" required htmlFor={`${id}-tel`} className="md:col-span-2">
                  <input
                    id={`${id}-tel`}
                    name="telephone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    pattern="[0-9+().\s-]{8,}"
                    className={field}
                  />
                </Field>
                <Field label="Email" required htmlFor={`${id}-email`} className="md:col-span-2">
                  <input id={`${id}-email`} name="email" type="email" required autoComplete="email" className={field} />
                </Field>

                <Field label="Type d'événement" required htmlFor={`${id}-type`} className="md:col-span-2">
                  <select
                    id={`${id}-type`}
                    name="type"
                    required
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={cn(field, "appearance-none")}
                  >
                    <option value="" disabled>
                      Choisir…
                    </option>
                    {eventTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Date" required={!noDate} htmlFor={`${id}-date`} className="md:col-span-2">
                  <input
                    id={`${id}-date`}
                    name="date"
                    type="date"
                    required={!noDate}
                    disabled={noDate}
                    className={cn(field, "[color-scheme:dark]")}
                  />
                  <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm text-light/85">
                    <input
                      type="checkbox"
                      name="sansDate"
                      checked={noDate}
                      onChange={(e) => setNoDate(e.target.checked)}
                      className="size-4 accent-[#C9A25B]"
                    />
                    Je n&apos;ai pas encore de date
                  </label>
                </Field>

                <Field label="Nombre d'invités" htmlFor={`${id}-invites`} className="md:col-span-2">
                  <input
                    id={`${id}-invites`}
                    name="invites"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    className={field}
                  />
                </Field>

                <Field label="Budget" htmlFor={`${id}-budget`} className="md:col-span-3">
                  <select id={`${id}-budget`} name="budget" defaultValue="" className={cn(field, "appearance-none")}>
                    <option value="">Choisir…</option>
                    {budgets.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Lieu" htmlFor={`${id}-lieu`} className="md:col-span-3">
                  <input
                    id={`${id}-lieu`}
                    name="lieu"
                    placeholder="Commune, salle, domicile…"
                    className={field}
                  />
                </Field>

                <Field label="Message" htmlFor={`${id}-message`} className="md:col-span-6">
                  <textarea
                    id={`${id}-message`}
                    name="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Thème, couleurs, envies…"
                    className={cn(field, "resize-y")}
                  />
                </Field>

                <div className="flex flex-col gap-4 md:col-span-6 md:flex-row md:items-center md:justify-between">
                  <p className="text-xs text-muted-d">
                    <span className="text-gold-l">*</span> Champs obligatoires. Vos informations servent uniquement à
                    vous répondre.
                  </p>
                  <Button type="submit" size="lg" disabled={status === "sending"} className="md:min-w-64">
                    {status === "sending" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden /> Envoi…
                      </>
                    ) : (
                      "Envoyer ma demande"
                    )}
                  </Button>
                </div>

                <div aria-live="polite" className="md:col-span-6">
                  {status === "error" && (
                    <div className="flex flex-col gap-3 rounded-[10px] border border-terracotta/60 bg-night p-4 text-sm text-light sm:flex-row sm:items-center sm:justify-between">
                      <p>{errorMsg} Écrivez-nous directement sur WhatsApp, on vous répond vite.</p>
                      <a
                        href={`${site.whatsapp}?text=${whatsappText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-label inline-flex shrink-0 items-center gap-2 text-gold-l hover:underline"
                      >
                        <MessageCircle className="size-4" aria-hidden /> WhatsApp
                        <span className="sr-only"> (nouvel onglet)</span>
                      </a>
                    </div>
                  )}
                </div>
              </m.form>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
