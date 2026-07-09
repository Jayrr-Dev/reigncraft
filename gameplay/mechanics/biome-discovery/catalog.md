# Named realms catalog

## Sizing and lattice

| Constant | Value | Effect |
| -------- | ----- | ------ |
| Lattice spacing | **6** biome regions | Candidate center grid |
| Center spawn chance | **0.62** | Sparse centers |
| Size weight min / max | **0.55** / **2.4** | Small vs large claims |
| size_type bands | equal fifths of weight range | `tiny` `small` `medium` `big` `large` |
| Search lattice radius | **3** | Neighbor centers considered |

## Titles

| Kind | Display form |
| ---- | ------------ |
| `kingdom` | Kingdom of {Place} |
| `realm` | Realm of {Place} |
| `march` | The {Place} March |
| `reach` | The {Place} Reach |
| `lands` | The {Place} Lands |
| `hold` | {Place} Hold |

Place roots: `src/client/assets/500_village_names.txt` (deduped).

## Timing

| Constant | Value |
| -------- | ----- |
| Discovery poll | **1000** ms |
| Name fade in | **900** ms |
| Name visible | **4500** ms |
| Name fade out | **1200** ms |

## Discovery copy

| Case | Display |
| ---- | ------- |
| First spawn (empty discovery set) | `Welcome to {realm}` |
| Later new realm | Realm title only |

## Storage

| Key prefix | Contents |
| ---------- | -------- |
| `world-plaza-discovered-named-realms` | JSON array of `latticeX:latticeY` realm ids |

## Code touchpoints

| Role | Path |
| ---- | ---- |
| Resolve realm | `resolvingWorldPlazaNamedRealmAtTileIndex.ts` |
| size_type bands | `definingWorldPlazaNamedRealmSizeType.ts` |
| Discovery store | `managingWorldPlazaDiscoveredNamedRealmsStore.ts` |
| Notification queue | `managingWorldPlazaWorldNotificationsStore.ts` |
| Poll + enqueue | `usingWorldPlazaRecordingDiscoveredNamedRealms.ts` |
| HUD | `renderingWorldPlazaWorldNotifications.tsx` |
| Minimap borders | `drawingWorldPlazaMiniMapNamedRealmBordersOnTerrainLayer.ts` |
| Wire-in | `renderingWorldPlazaPixiScene.tsx` |

## Edit checklist

1. Tune size / lattice in `definingWorldPlazaNamedRealmConstants.ts`.
2. Add titles in `definingWorldPlazaNamedRealmTitleRegistry.ts`.
3. Edit place names in `500_village_names.txt`.
