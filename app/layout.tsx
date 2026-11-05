import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { site } from "@/content/site";
import { localBusinessJsonLd } from "@/lib/seo";
import { QUERIES } from "@/lib/queries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { Cursor } from "@/components/layout/Cursor";
import { PageTransitionProvider } from "@/components/layout/PageTransition";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SoundProvider } from "@/components/providers/Sound";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal"],
  display: "swap",
  variable: "--font-display",
});

// Italique : uniquement dans des titres sous la ligne de flottaison → pas de
// préchargement, pour libérer la bande passante du LCP mobile.
const displayItalic = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  display: "swap",
  preload: false,
  variable: "--font-display-italic",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
  themeColor: "#13161C",
  colorScheme: "dark",
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
    <html lang="fr" className={`${display.variable} ${displayItalic.variable} ${body.variable}`} suppressHydrationWarning>
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
              <Cursor />
              <SmoothScroll />
            </PageTransitionProvider>
          </SoundProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
