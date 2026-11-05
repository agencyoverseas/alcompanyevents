import { Hero } from "@/components/home/Hero";
import { Univers } from "@/components/home/Univers";
import { HorizontalRail } from "@/components/home/HorizontalRail";
import { Process } from "@/components/home/Process";
import { Avis } from "@/components/home/Avis";
import { LogoMarquee } from "@/components/home/LogoMarquee";
import { DevisForm } from "@/components/home/DevisForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Décoration & organisation d'événements clé en main en Guadeloupe",
  description:
    "Anniversaires, baptêmes, mariages, événements d'entreprise : Audrey.L Company décore et organise votre événement clé en main en Guadeloupe, Marie-Galante, Les Saintes, La Désirade et Saint-Martin.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <Univers />
      <HorizontalRail />
      <Process />
      <Avis />
      <LogoMarquee />
      <DevisForm />
    </>
  );
}
