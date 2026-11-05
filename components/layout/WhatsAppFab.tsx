import { MessageCircle } from "lucide-react";
import { site } from "@/content/site";
import { SoundToggle } from "@/components/providers/Sound";

/** Bouton WhatsApp flottant (seule pilule du site) + interrupteur de son discret. */
export function WhatsAppFab() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 sm:bottom-6 sm:right-6">
      <SoundToggle />
      <a
        href={`${site.whatsapp}?text=${encodeURIComponent("Bonjour Audrey, je souhaite un devis pour un événement.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-label flex h-12 items-center gap-2 rounded-full bg-[#17703d] px-5 text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,.6)] transition-transform hover:-translate-y-0.5"
      >
        <MessageCircle className="size-4" aria-hidden />
        <span>WhatsApp</span>
        <span className="sr-only"> (nouvel onglet)</span>
      </a>
    </div>
  );
}
