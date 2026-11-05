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
