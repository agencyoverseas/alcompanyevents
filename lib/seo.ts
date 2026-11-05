import type { Metadata } from "next";
import { site } from "@/content/site";

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${site.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      url,
      siteName: site.name,
      locale: "fr_FR",
      type: "website",
      images: [{ url: "/scene/mascot.png", width: 900, height: 1400, alt: site.name }],
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phone,
    ...(site.email ? { email: site.email } : {}),
    foundingDate: site.founded,
    image: `${site.url}/scene/mascot.png`,
    logo: `${site.url}/scene/logo-gold.png`,
    address: { "@type": "PostalAddress", addressRegion: "Guadeloupe", addressCountry: "GP" },
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
    priceRange: "€€",
    knowsAbout: ["Décoration événementielle", "Organisation d'événements", "Art de la table", "Scénographie"],
  };
}
