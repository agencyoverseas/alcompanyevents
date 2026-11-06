# Assets de la scène

Source : mascotte détourée fournie (`mascot-original.png`, 1856×2304, fond transparent).

| Fichier | Rôle | Origine |
|---|---|---|
| `mascot-original.png` | Original fourni | cliente |
| `mascot.png` | Original recadré sur son contenu | généré |
| `mascot.webp` | Héro mobile / sans 3D (servi via next/image) | généré |
| `character.png` / `character.webp` | Audrey sans les ballons, tenant les ficelles (plan 3D, version .webp chargée) | généré : ballons effacés au-dessus du poing |
| `character-depth.png` / `.webp` | Carte de profondeur (dôme de silhouette 80 % + luminance 20 %) | généré |
| `balloons.png`, `balloons-depth.png`, `mascot-depth.png` | Références, non utilisées en 3D | généré |
| `logo-gold.png`, `logo-cream.png` | **PLACEHOLDERS** : logo réel non fourni | à remplacer |

Réglages dans `components/scene/store.ts` : `HAND_UV` (poing mesuré à u 0,3515 / v 0,2769),
`CHARACTER.height / y / xFactor`, `displacementScale` (< 0.35).
Grappe 3D : `CLUSTER_X` / `CLUSTER_Y` dans `components/scene/Balloons.tsx`.

## Audrey articulée (scène 3D bureau)

Découpée dans `character.png` (coordonnées dans `components/scene/store.ts`, objet `RIG`) :

| Fichier | Pièce |
|---|---|
| `character-body.webp` | Corps fixe (sans tête ni bras ; le cou et une bande de veste le long de la manche restent pour éviter un trou) |
| `character-head.webp` | Tête, yeux « vides » (blanc de l'œil redessiné sous l'iris) |
| `character-irises.webp` + `character-eyemask.webp` | Iris décalés dans le shader, limités à l'ouverture de l'œil |
| `character-sleeve.webp` | Manche (bras + manchette), pivot à l'épaule : tout le bras bouge |
| `character-forearm.webp` | Avant-bras + main (prolongé dans la manchette), pivot au coude caché dans la manche |
| `character-cuff.webp` | Ombre de l'intérieur de la manchette, visible quand l'avant-bras s'abaisse |
| `character-strings.webp` | Ficelles tenues dans le poing, lâchées avec les ballons |

Si l'illustration change, régénérer ces fichiers (repérer à nouveau iris, cou, coude).

Pose de repos vérifiée au pixel près (corps + manchette + avant-bras + manche = image d'origine).
La manche déborde de 2 px sur le corps (pas de liseré au filtrage) et utilise la même grille
que le corps (déformation de profondeur identique).
