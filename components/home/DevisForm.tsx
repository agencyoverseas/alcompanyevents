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
  "w-full rounded-[12px] border border-sky-200 bg-white px-[14px] py-3 text-[0.92rem] text-text placeholder:text-muted transition-colors focus:border-transparent focus:outline-2 focus:outline-offset-1 focus:outline-sky-400 disabled:bg-sky-50 disabled:opacity-60";

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
      <label htmlFor={htmlFor} className="mb-1.5 block text-[0.78rem] font-medium tracking-[0.02em] text-ink">
        {label}
        {required ? (
          <span className="text-terra-d" aria-hidden>
            {" "}
            *
          </span>
        ) : (
          <span className="font-normal text-muted"> — facultatif</span>
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
      ambiance: String(fd.get("ambiance") ?? "").trim() || undefined,
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
    <section id="devis" aria-labelledby="devis-title" className="relative scroll-mt-24 pb-16 pt-28 sm:pb-24 sm:pt-32">
      <Container>
        <div className="relative mx-auto max-w-[860px]">
          <Reveal className="relative max-w-2xl">
            <Eyebrow>Demande de devis</Eyebrow>
            <h1 id="devis-title" className="h2-display text-ink">
              Parlons de <em>votre projet</em>
            </h1>
            <p className="mt-4 text-[1.05rem] text-muted">
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
                className="relative mt-10 flex items-start gap-4 rounded-[20px] border border-sky-400 bg-sky-50 p-6"
              >
                <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-terra-d" aria-hidden />
                <div>
                  <p className="font-display text-2xl font-semibold text-ink">Merci, votre demande est bien partie.</p>
                  <p className="mt-1 text-muted">Audrey revient vers vous très vite, par téléphone ou par email.</p>
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
                className="relative mt-8 grid gap-4 md:grid-cols-6"
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
                  <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm text-text/85">
                    <input
                      type="checkbox"
                      name="sansDate"
                      checked={noDate}
                      onChange={(e) => setNoDate(e.target.checked)}
                      className="size-4 accent-[#A7522F]"
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

                <Field label="Ambiance souhaitée" htmlFor={`${id}-ambiance`} className="md:col-span-6">
                  <input
                    id={`${id}-ambiance`}
                    name="ambiance"
                    placeholder="Chic, bohème, tropicale, pastel… et vos couleurs"
                    className={field}
                  />
                </Field>

                <Field label="Vos envies" htmlFor={`${id}-message`} className="md:col-span-6">
                  <textarea
                    id={`${id}-message`}
                    name="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Thème, contraintes, ce qui compte pour vous…"
                    className={cn(field, "resize-y")}
                  />
                </Field>

                <label className="flex items-start gap-2.5 text-[0.82rem] text-muted md:col-span-6">
                  <input type="checkbox" name="consent" required className="mt-0.5 size-4 shrink-0 accent-[#A7522F]" />
                  J&apos;accepte d&apos;être recontacté·e au sujet de ma demande.
                </label>

                <div className="flex flex-col gap-4 md:col-span-6 md:flex-row md:items-center md:justify-between">
                  <p className="text-xs text-muted">
                    <span className="text-terra-d">*</span> Champs obligatoires. Vos informations servent uniquement à
                    vous répondre.
                  </p>
                  <Button type="submit" size="lg" disabled={status === "sending"} className="md:min-w-64">
                    {status === "sending" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden /> Envoi…
                      </>
                    ) : (
                      "Je demande mon devis"
                    )}
                  </Button>
                </div>

                <div aria-live="polite" className="md:col-span-6">
                  {status === "error" && (
                    <div className="flex flex-col gap-3 rounded-[20px] border border-terra/60 bg-white p-4 text-sm text-text sm:flex-row sm:items-center sm:justify-between">
                      <p>{errorMsg} Écrivez-nous directement sur WhatsApp, on vous répond vite.</p>
                      <a
                        href={`${site.whatsapp}?text=${whatsappText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-label inline-flex shrink-0 items-center gap-2 text-terra-d hover:underline"
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
