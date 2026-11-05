# Audrey.L Company — site immersif 3D

Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · three.js + React Three Fiber + drei ·
GSAP + ScrollTrigger · Motion · Lenis · base shadcn/ui (cn + cva, tokens réhabillés).

## Démarrer

```bash
npm install
cp .env.example .env.local   # renseigner DEVIS_WEBHOOK_URL
npm run dev
```

```bash
npm run build && npm start
```

## Ce qui est livré

Style : maquette « ciel & terracotta » (Fraunces + Inter, boutons pilule, grandes cartes arrondies),
avec la scène 3D d'Audrey dans la carte bleue du héro.

| Page | Contenu |
|---|---|
| `/` | Héro 3D (pin, ballons qui s'envolent) → réalisations (rail horizontal) → formules (4 familles, 3 niveaux en fenêtre) → CTA → comment ça se passe → avis → références → Audrey → CTA |
| `/formules` | Familles en 3 paliers, comparatif, mariage, mini-concepts |
| `/prestations` | Événements privés / pros / scénographie, **bars gourmands** (gaufres-pancakes, pop-corn, barbe à papa, sweet table), **services complémentaires**, références |
| `/realisations` | Anneau 3D + galerie filtrable par catégorie (anniversaires, baptêmes / religieux, pros, scénographies / photocalls, clé en main, mariages) |
| `/comment-ca-se-passe` | Les 4 étapes, textes de la cliente |
| `/faq`, `/a-propos`, `/journal` | FAQ (JSON-LD FAQPage), À propos (faits validés), Journal (vide) |
| `/mariage`, `/anniversaire-enfant` | Pages de référencement local |
| `/devis` | Formulaire « Parlons de votre projet » (pré-remplissable) |

« Parlons de votre projet » / « Je demande mon devis » : header, héro, après les formules,
après les réalisations, en fin de chaque page, footer.

## Règles d'architecture

| Contexte | WebGL | GSAP | Lenis | Curseur |
|---|---|---|---|---|
| ≥ 768px + souris + mouvement normal | oui | oui | > 1024px | oui |
| Mobile / tactile | non (image fixe) | non chargé | non | non |
| `prefers-reduced-motion` | non | pas de pin | non | non |

- three.js et GSAP ne sont chargés qu'en `next/dynamic` côté bureau : vérifié, aucun des deux
  n'est téléchargé sur mobile.
- La séquence d'entrée du héro est en CSS : le héro reste lisible sans JavaScript.
- Variantes Motion : `lib/motion.ts`. Réglages de scroll : `lib/gsap.ts`. Requêtes média :
  `lib/queries.ts`. Données : `content/*.ts`.
- `cacheComponents` est désactivé volontairement : avec `<Activity>`, les pages quittées
  restent montées, ce qui garderait des contextes WebGL et des pins GSAP actifs hors écran.

## À fournir / valider par la cliente

Tout est isolé dans `content/` et signalé par `⚠️` dans le code.

- **Logo** : non fourni, marque typographique en attendant (`components/layout/Logo.tsx`).
- **Mascotte** : intégrée (version sans ballons générée pour la 3D, voir `public/scene/README.md`).
- **Photos HD et vidéos** des réalisations ; **photos des bars gourmands** ; **logos clients** ;
  **portrait d'Audrey** ; **prix du bar à gaufres / pancakes**.
- **Textes de la maquette non validés** (non affichés) : « +120 événements », avis, histoire 2020,
  délais, horaires, email, FAQ d'origine. Acompte : 50 % (mail de la cliente), pas 30 %.
- **Mentions légales / confidentialité** : à rédiger (SIRET, hébergeur, RGPD).
- **Prix** (`content/formules.ts`, `content/univers.ts`) : non validés.
- **Email** et **nombre d'événements** (`content/site.ts`) : `null`, non affichés tant que non validés.
- **Avis clients** (`content/avis.ts`) : liste vide (prénom, type d'événement, texte, photo).
- **Communes** des réalisations (`content/realisations.ts`) : non fournies, « Guadeloupe » affiché
  par défaut. À compléter pour le référencement local.
- **Classement** des photos « arbre de Noël » (entreprise) et « autre / prestations »
  (scénographie) : déduit des noms de fichiers.

## Formulaire de devis

`POST /api/devis` valide les champs puis transmet le JSON à `DEVIS_WEBHOOK_URL`
(ex. n8n : email à Audrey + ligne dans une base). Sans webhook, réponse 503 et le formulaire
propose WhatsApp. L'envoi fonctionne aussi sans JavaScript (POST natif puis redirection) ; dans
ce cas la case « pas de date » ne libère pas le champ date (il faut JS pour ça).
Pré-remplissage : `/devis?type=Anniversaire%20enfant&formule=Signature`.

## Déploiement Vercel

Importer le dépôt, ajouter `DEVIS_WEBHOOK_URL` dans les variables d'environnement, déployer.
Les photos sont servies depuis `alcompanyevents.fr/wp-content/uploads/` (autorisé dans
`next.config.ts`) : si l'ancien WordPress est coupé, il faudra les rapatrier dans `public/`.
