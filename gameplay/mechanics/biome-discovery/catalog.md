# Named realms catalog

## Sizing and lattice

| Constant               | Value                        | Effect                                                 |
| ---------------------- | ---------------------------- | ------------------------------------------------------ |
| World linear scale     | **4**                        | Biome patches and realm tile spacing vs legacy sandbox |
| Biome region tile size | **128** tiles                | Region grid for blending and realm borders             |
| Lattice spacing        | **6** biome regions          | Candidate center grid                                  |
| Nominal center spacing | **768** tiles                | 6 × 128                                                |
| Center spawn chance    | **0.62**                     | Sparse centers                                         |
| Size weight min / max  | **0.55** / **2.4**           | Small vs large claims                                  |
| size_type bands        | equal fifths of weight range | `tiny` `small` `medium` `big` `large`                  |
| Search lattice radius  | **3**                        | Neighbor centers considered                            |

## Display names

| Kind    | Display form                     |
| ------- | -------------------------------- |
| `place` | {Place} only (e.g. Summerchurch) |

Place roots: `src/client/assets/500_village_names.txt` (deduped). One-word place names; no kingdom/march wrappers.

## Timing

| Constant       | Value       |
| -------------- | ----------- |
| Discovery poll | **1000** ms |
| Name fade in   | **900** ms  |
| Name visible   | **4500** ms |
| Name fade out  | **1200** ms |

## Discovery copy

| Case                              | Display              |
| --------------------------------- | -------------------- |
| First spawn (empty discovery set) | `Welcome to {realm}` |
| Later new realm                   | Place name only      |

## Storage

| Key prefix                            | Contents                                    |
| ------------------------------------- | ------------------------------------------- |
| `world-plaza-discovered-named-realms` | JSON array of `latticeX:latticeY` realm ids |

## Code touchpoints

| Role               | Path                                                         |
| ------------------ | ------------------------------------------------------------ |
| Resolve realm      | `resolvingWorldPlazaNamedRealmAtTileIndex.ts`                |
| size_type bands    | `definingWorldPlazaNamedRealmSizeType.ts`                    |
| Discovery store    | `managingWorldPlazaDiscoveredNamedRealmsStore.ts`            |
| Notification queue | `managingWorldPlazaWorldNotificationsStore.ts`               |
| Poll + enqueue     | `usingWorldPlazaRecordingDiscoveredNamedRealms.ts`           |
| HUD                | `renderingWorldPlazaWorldNotifications.tsx`                  |
| Minimap borders    | `drawingWorldPlazaMiniMapNamedRealmBordersOnTerrainLayer.ts` |
| Wire-in            | `renderingWorldPlazaPixiScene.tsx`                           |

## Edit checklist

1. Tune size / lattice in `definingWorldPlazaNamedRealmConstants.ts`.
2. Add titles in `definingWorldPlazaNamedRealmTitleRegistry.ts`.
3. Edit place names in `500_village_names.txt`.
