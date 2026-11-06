import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { site } from "@/content/site";
import { localBusinessJsonLd } from "@/lib/seo";
import { QUERIES } from "@/lib/queries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { PageTransitionProvider } from "@/components/layout/PageTransition";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SoundProvider } from "@/components/providers/Sound";
import "./globals.css";

// Fraunces variable (wght 100–900 + axes SOFT / WONK). Axe opsz retiré : police 121 → 62 Ko sur le chemin critique mobile.
const display = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK"],
  display: "swap",
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Décoration & organisation d'événements en Guadeloupe`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#FBFCFD",
  colorScheme: "light",
};

/**
 * Exécuté avant le premier rendu :
 * - data-scene="pending" sur l'accueil si la 3D va se monter → le loader s'affiche
 *   et la séquence CSS du héro attend la scène (secours : libérée après 9 s) ;
 * - data-fonts="pending" jusqu'à document.fonts.ready (max 800 ms) pour que le texte
 *   du héro ne saute pas pendant sa séquence.
 * Sans JS, aucun attribut : la séquence CSS joue seule, le héro reste lisible.
 */
const bootScript = `(function(){var d=document.documentElement;try{if(location.pathname==='/'&&matchMedia(${JSON.stringify(
  QUERIES.scene,
)}).matches){d.setAttribute('data-scene','pending');setTimeout(function(){if(d.getAttribute('data-scene')==='pending')d.setAttribute('data-scene','ready')},9000)}}catch(e){}d.setAttribute('data-fonts','pending');var f=function(){d.removeAttribute('data-fonts')};setTimeout(f,800);try{document.fonts.ready.then(f)}catch(e){f()}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
      </head>
      <body>
        <MotionProvider>
          <SoundProvider>
            <PageTransitionProvider>
              <Header />
              <main id="contenu">{children}</main>
              <Footer />
              <WhatsAppFab />
              <SmoothScroll />
            </PageTransitionProvider>
          </SoundProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
