# Named realms glossary

| Term | Meaning |
| ---- | ------- |
| **Named realm** | Large landmass with a permanent one-word place name. Independent of biome kind. |
| **Realm id** | Stable storage key `latticeX:latticeY` for the realm center. |
| **Place name** | Root from the village name catalog (e.g. Summerchurch). Same as HUD display name. |
| **Title kind** | Currently `place` only: display name equals place name. |
| **Size weight** | Weighted Voronoi claim strength; higher = larger realm. |
| **size_type** | Landmass band from size weight: `tiny`, `small`, `medium`, `big`, `large`. |
| **Biome region cell** | 32×32 tile chunk used for biome assignment (finer than realms). |
| **First discovery** | First time this player enters that realm. Spawn (empty discovery set) uses welcome copy. |
| **worldNotifications** | Shared HUD slot at upper quarter (controls hint + realm names). |
| **Explored biome kind** | Codex progress by biome *kind* (separate store). |

## Code prefixes

| Prefix | Role in this context |
| ------ | -------------------- |
| `defining*` | Lattice, weights, titles, storage keys |
| `resolving*` | Weighted Voronoi realm at tile / world point |
| `managing*` | Discovery set and notification queue |
| `recording*` / `using*` | Poll player position and enqueue reveals |
| `rendering*` | worldNotifications HUD |
