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

- **Accueil** : héro WebGL (personnage déplacé par carte de profondeur, 8 ballons procéduraux,
  ficelles, caméra pilotée par le scroll et la souris), pin GSAP sur trois hauteurs d'écran,
  loader avec rideau ; univers en cartes inclinables ; réalisations en scroll horizontal ;
  déroulé ; avis ; bandeau clients ; formulaire de devis.
- **Formules** : 4 familles × 3 paliers, modale de détail, comparatif à colonne figée,
  mariage à part, compléments, services, mini-concepts.
- **Réalisations** : carrousel en anneau (scroll, glissement, boutons clavier), galerie
  immersive filtrable.
- Transition « ballon » entre pages, curseur personnalisé, son (coupé par défaut).

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

- **Assets** : `public/scene/*` sont des placeholders (voir `public/scene/README.md`).
- **Prix** (`content/formules.ts`, `content/univers.ts`) : non validés.
- **Email** et **nombre d'événements** (`content/site.ts`) : `null`, non affichés tant que non validés.
- **Avis clients** (`content/avis.ts`) : emplacements, aucun avis n'a été fourni.
- **Communes** des réalisations (`content/realisations.ts`) : non fournies, « Guadeloupe » affiché
  par défaut. À compléter pour le référencement local.
- **Classement** des photos « arbre de Noël » (entreprise) et « autre / prestations »
  (scénographie) : déduit des noms de fichiers.
- **Logos clients** : affichés en texte (aucun fichier logo fourni).
- **Mariage** : traité en section dédiée sur /formules (le périmètre est de 3 pages).

## Formulaire de devis

`POST /api/devis` valide les champs puis transmet le JSON à `DEVIS_WEBHOOK_URL`
(ex. n8n : email à Audrey + ligne dans une base). Sans webhook, réponse 503 et le formulaire
propose WhatsApp. L'envoi fonctionne aussi sans JavaScript (POST natif puis redirection) ; dans
ce cas la case « pas de date » ne libère pas le champ date (il faut JS pour ça).
Pré-remplissage : `/?type=Anniversaire%20enfant&formule=Signature#devis`.

## Déploiement Vercel

Importer le dépôt, ajouter `DEVIS_WEBHOOK_URL` dans les variables d'environnement, déployer.
Les photos sont servies depuis `alcompanyevents.fr/wp-content/uploads/` (autorisé dans
`next.config.ts`) : si l'ancien WordPress est coupé, il faudra les rapatrier dans `public/`.
