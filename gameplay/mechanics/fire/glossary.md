# Fire glossary (ubiquitous language)

Terms for wildfire, campfires, fuel, and fire cells.

## Core concepts

| Term             | Meaning                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------- |
| **Fire cell**    | One burning tile in Redis (online) or local store (SP): position, kind, fuel, intensity. |
| **Cell kind**    | `spreading` (wildfire on flammable material) or `campfire` (utility campfire block).     |
| **Ignite**       | Start a new fire cell. Costs flint (spread) or wood (campfire light).                    |
| **Refuel**       | Add wood to an existing lit campfire or SP ground fire. Extends `fuelRemainingMs`.       |
| **Spread tick**  | Server lazy sim every **2000 ms**; adjacent flammable tiles may catch fire.              |
| **Flammability** | Per-material **0..1** multiplier on spread roll.                                         |

## Interaction terms

| Term                     | Meaning                                                                                                                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Secondary tile click** | Pointer button that is not primary walk-click. Runs flint ignite / SP ground fire via `usingWorldPlazaFlintIgnitionAttempt` (campfire utility block uses its own popover instead). |
| **Interaction radius**   | **2** Chebyshev tiles from player to target tile (ignite/refuel).                                                                                                                  |
| **Flint mode**           | `mode: 'flint'` � online: ignite flammable **placed block**. SP: light campfire-style cell on ground tile.                                                                         |
| **Campfire mode**        | `mode: 'campfire'` � light `utility:campfire` block with **1 wood** (campfire interaction hook, not flint secondary-click).                                                        |
| **Equipment gate**       | Flint in inventory for spread / SP ground ignite; wood for campfire light/refuel and SP refuel of a burning tile.                                                                  |
| **Reigncraft toast**     | In-game Sonner feedback above the minimap (`showingReigncraftToast`). Used for range, flammability, fuel, and ignite success/fail. Not Devvit `showToast`.                         |

## Fuel terms

| Term                          | Meaning                                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Fuel wood**                 | `basic:floor:wood`, `functional:door:wooden`, `functional:sign:wooden` within **2** tiles of campfire (not on campfire tile itself). |
| **Small fuel tier**           | **1�3** total wood: **180_000 ms** (3 min) per wood.                                                                                 |
| **Big fuel tier**             | **4+** total wood: **60_000 ms** (1 min) per wood.                                                                                   |
| **Max fuel**                  | **1_200_000 ms** (20 min) stored cap.                                                                                                |
| **Inventory fuel wood count** | Wood consumed at light/refuel; drives flame sprite tier with placed wood.                                                            |
| **Fuel dimming**              | Flame scale and light soften as `fuelRemainingMs / initialFuelMs` drops.                                                             |

## Burn tier (visual)

| Tier      | Nearby placed wood | Light radius scale | Brightness |
| --------- | ------------------ | ------------------ | ---------- |
| **weak**  | 0                  | 0.62               | 0.32       |
| **small** | 1�2                | 0.95               | 0.55       |
| **mid**   | 3                  | 1.35               | 0.82       |
| **big**   | 4+                 | 2.2                | 1.0        |

## Spread terms

| Term                   | Meaning                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------- |
| **Spread base chance** | **0.15** per tick � neighbor `flammability`.                                          |
| **Burn duration**      | Per-material ms the spreading cell lasts (e.g. grass **8000**, wood floor **12000**). |
| **Burnt metadata**     | Blocks/grass marked burnt after fire passes; fuel wood excluded if `isBurnt`.         |

## Firelands biome (procedural world heat)

| Term                          | Meaning                                                                                                                                                                                                                             |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Firelands biome**           | Legendary hot-dry volcanic region (`firelands` kind). Ambient floor **62C**; lava tiles, mini-volcanoes, lava plants, ruins. No lava trees, volcanic rocks, or procedural stone columns. Not the same as player-lit **fire cells**. |
| **Firelands spawn exclusion** | Euclidean radius around world origin where Firelands cannot generate. Scales with world linear scale (**3000** tiles at scale **4**).                                                                                               |
| **Firelands body field**      | Low-frequency noise gate on hot-dry climate tiles. Lower frequency = larger volcanic landmasses (~**1040**-tile features at scale **4**).                                                                                           |
| **Firelands structure grid**  | Coarse anchor spacing for volcanoes and ruins (**192**-tile cells at scale **4**).                                                                                                                                                  |
| **Firelands scatter**         | Open-ground prop grid inside Firelands. Large cells: **mini-volcano** only. Small cells: **lava_plant** only. Resolver: `resolvingWorldPlazaFirelandsPropAtTileIndex`.                                                              |

## Render terms

| Term                          | Meaning                                             |
| ----------------------------- | --------------------------------------------------- |
| **Fire glow radius**          | **56** world-local px warm core                     |
| **Max visible glows**         | **24** per frame (viewport cap)                     |
| **Campfire flame base scale** | **0.58** (sheets authored large)                    |
| **Flame intensity tier**      | Sprite sheet tier **1�5** from effective wood count |

## Audio terms

| Term                      | Meaning                                                                                                                                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Campfire ambience**     | Looping bonfire crackle SFX near **lit** campfire cells (`kind: campfire`, `fuelRemainingMs > 0`).                                                                                                                     |
| **Lava ambience**         | Looping fire crackle SFX near **procedural lava tiles** and **Firelands ruin lava** (not player-lit fire cells). Independent of campfire loop.                                                                         |
| **Lava tile scan**        | Square window around player; `checkingWorldPlazaLavaAtTileIndex` per tile inside scan radius.                                                                                                                          |
| **Ambience source point** | Tile center (`tileX + 0.5`, `tileY + 0.5`) on the campfire's `worldLayer`.                                                                                                                                             |
| **Ambience falloff**      | Full volume within **2** grid tiles; silent at **14** grid tiles; squared linear falloff between. Nearest lit campfire on the same layer wins.                                                                         |
| **Lava ambience falloff** | Full volume within **1.5** grid tiles; silent at **12** grid tiles; squared linear falloff between. Nearest lava tile center wins.                                                                                     |
| **Ambience volume gate**  | Effective loop volume = `computingWorldPlazaSfxEffectiveVolume` (base target � falloff � optional clip multiplier � plaza **Ambience volume** slider). Campfire target **0.42**; lava target **0.36**.                 |
| **Ambience loop handle**  | Single star-audio `SoundHandle` per session while the player stays in range. Start via `playingWorldPlazaStarAudioSfx` (SFX group); polls call `updatingWorldPlazaStarAudioActiveSfxPlayVolume` (no per-tick restart). |
| **Bonfire clip**          | Shared loop asset: `public/fire/sfx/campfire/bonfire.ogg` (Butterfly Looped Ambience Sounds pack). Used for campfire (`bonfire` id) and lava (`crackle` id).                                                           |
| **Active tile key set**   | Engine-only: `activeFireTileKeysRef` in `renderingWorldPlazaFireLayer.tsx`. Cleared and refilled each Pixi tick to reconcile the flame visual pool. Not a player mechanic.                                             |

## Persistence modes

| Term                    | Meaning                                                         |
| ----------------------- | --------------------------------------------------------------- |
| **Online room**         | Fire cells in Redis; all players poll `/api/world-fire/cells`.  |
| **Single-player local** | `managingWorldPlazaLocalFireCells` when `onlineUserId` is null. |

## Code prefixes

| Prefix                                           | Role                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| `WORLD_FIRE_DEVVIT_*`                            | Shared spread/API constants                                        |
| `WORLD_CAMPFIRE_*`                               | Fuel duration and burn tiers                                       |
| `igniting*` / `adding*`                          | API and local cell mutations                                       |
| `computingWorldCampfire*`                        | Fuel math and intensity                                            |
| `countingWorldCampfire*`                         | Nearby fuel wood                                                   |
| `computingWorldPlazaCampfireAmbience*`           | Lit-campfire loop volume (`computingWorldPlazaSfxEffectiveVolume`) |
| `computingWorldPlazaLavaAmbience*`               | Lava-tile loop volume (`computingWorldPlazaSfxEffectiveVolume`)    |
| `playingWorldPlazaStarAudioSfx`                  | Shared SFX-group play helper (campfire/lava loops)                 |
| `updatingWorldPlazaStarAudioActiveSfxPlayVolume` | Live loop volume updates on active SFX plays                       |
| `resolvingWorldPlazaLavaAmbience*`               | Lava scan + star-audio manifest ids                                |
| `managingWorldPlazaAmbienceVolumeStore`          | Settings **Ambience volume** slider                                |
| `usingWorldPlazaCampfireAmbience`                | Lit-campfire crackle hook                                          |
| `usingWorldPlazaLavaAmbience`                    | Lava-pool crackle hook                                             |
| `usingWorldPlaza*`                               | React hooks for ignite/refuel/poll                                 |

## Anti-patterns

| Don't say                     | Say instead                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| "Cooking fire"                | **Lit campfire cell** (fire) vs **cook timer** ([cooking-campfire](../cooking-campfire/))  |
| "Flint + wood to light"       | Flint for **spread**; **wood only** for **campfire** light                                 |
| "Fire warmth radius"          | **72�C** on campfire **tile**; neighbor warming via [environment](../environment/) average |
| "Devvit toast" / Reddit toast | **Reigncraft toast** (Sonner stack above minimap)                                          |
