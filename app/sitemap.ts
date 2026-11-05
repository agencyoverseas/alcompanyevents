import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/formules`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/realisations`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/prestations`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/mariage`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/anniversaire-enfant`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/comment-ca-se-passe`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/a-propos`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/faq`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/devis`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/journal`, changeFrequency: "weekly", priority: 0.4 },
  ];
}
