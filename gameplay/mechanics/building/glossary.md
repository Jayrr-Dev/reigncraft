# Building glossary (ubiquitous language)

Terms for plots, claims, build modes, and placement limits.

## Core concepts

| Term | Meaning |
| ---- | ------- |
| **Plot** | Axis-aligned rectangle of claimed tiles owned by one Reddit user in a room. |
| **Tile claim** | `POST /plots/claim` creates a 1×1 plot at `(tileX, tileY)`. |
| **Owned plot** | Plot where `owner_id` matches the current user. |
| **Placed block** | Block instance on a plot tile with `definitionId`, `worldLayer`, metadata. |
| **Room scope** | Redis namespace per Devvit post room shard. |

## Claim types

| Term | Meaning |
| ---- | ------- |
| **Permanent claim** | `isTemporary: false`; counts toward **64** tile claim cap. |
| **Temporary tile** | `isTemporary: true`; max **5** concurrent per player. |
| **Claimable tile** | Unclaimed, outside other owners' buffer, within user limits. |
| **Other-owner buffer** | New claim must be ≥ **3** Chebyshev tiles from any other player's plot bounds. |

## Limits (defaults)

| Term | Default | Override |
| ---- | ------- | -------- |
| **Max owned plots** | **1** | `user_profile.world_plot_max_count` |
| **Max tile claims** | **64** | `user_profile.world_tile_claim_max_count` |
| **Max temporary tiles** | **5** | profile (future) |
| **Max blocks per plot** | **256** | `DEFINING_WORLD_BUILDING_PLOT_MAX_BLOCK_COUNT` |

## Modes and controls

| Term | Meaning |
| ---- | ------- |
| **Build mode** | Hotkey **B** — place/remove blocks on owned plots. |
| **Claim mode** | Hotkey **C** — view plot map, claim/unclaim tiles, teleport to own plots. |
| **Claim popover** | Double-tap tile within **350 ms**, **28 px** drift max. |

## Plot row fields

| Field | Meaning |
| ----- | ------- |
| `min_tile_x/y`, `max_tile_x/y` | Inclusive bounds |
| `owner_id` | Reddit user id |
| `is_temporary` | Temporary vs permanent claim |
| `expires_at` | Optional expiry for temporary plots |
| `created_at` | ISO timestamp |

## Realtime and queries

| Term | Meaning |
| ---- | ------- |
| **Plot realtime topic** | `world-building-plot` prefix for block changes |
| **Plots query key** | `world-building-plots` |
| **Placed blocks query key** | `world-building-placed-blocks` |
| **Registry max plots** | **512** plots returned per registry query |

## Errors (player-facing)

| Message | Cause |
| ------- | ----- |
| "That tile is already claimed." | Tile inside existing plot |
| "Too close to another player's claim." | Within **3** tiles of other owner bounds |
| "You can only claim 64 tiles." | Permanent cap reached |
| "You can only have 5 temporary tiles at a time." | Temporary cap |
| "You can only build on plots you own." | Place on foreign plot |

## Code prefixes

| Prefix | Role |
| ------ | ---- |
| `definingWorldBuilding*` | Client constants, block registry |
| `WORLD_BUILDING_DEVVIT_*` | Shared server limits and API |
| `usingWorldPlazaBuild*` | Build mode hooks |
| `fetchingWorldBuilding*` | Owner limits API |

## Anti-patterns

| Don't say | Say instead |
| --------- | ----------- |
| "Free build anywhere" | Build only on **owned plot** tiles |
| "Unlimited claims" | **64** permanent + **5** temporary defaults |
| "Plot per chunk" | **Per-tile claim** forming plot bounds |
