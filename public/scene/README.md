# Assets de la scène

Les fichiers de ce dossier sont des PLACEHOLDERS générés. Ils doivent être remplacés par
les vrais fichiers fournis par la cliente, avec exactement les mêmes noms :

| Fichier | Rôle |
|---|---|
| `character.png` | Audrey + fauteuil, ballons retirés, tenant les ficelles (plan 3D) |
| `character-depth.png` | Carte de profondeur du personnage (niveaux de gris) |
| `balloons.png`, `balloons-depth.png` | Grappe seule (non utilisée en 3D : les ballons sont des sphères) |
| `mascot.png` | Mascotte complète (héro mobile, image OpenGraph) |
| `mascot-depth.png` | Carte de profondeur de l'ensemble |
| `logo-gold.png`, `logo-cream.png` | Logos |
| `mascot-original.png` | Original pleine résolution |

Après remplacement, recaler dans `components/scene/store.ts` :
- `HAND_UV` : position de la main qui tient les ficelles (coordonnées UV de character.png) ;
- `CHARACTER.height / y / xFactor` si le cadrage diffère ;
- `CHARACTER.displacementScale` (rester < 0.35, vérifier que les cheveux ne se creusent pas).

Et dans `components/layout/Logo.tsx` : `LOGO_RATIO` si le format du logo diffère.
