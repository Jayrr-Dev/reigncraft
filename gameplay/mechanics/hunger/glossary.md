# Hunger glossary (ubiquitous language)

Terms used consistently across code, docs, and player-facing copy for the Plaza hunger bounded context.

## Core concepts

| Term                          | Meaning                                                                                                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hunger ratio**              | Normalized fill `0..1` on the hunger bar. `1` = full (`DEFINING_WORLD_PLAZA_HUNGER_INITIAL_RATIO`), `0` = empty. Mirrors the run-stamina ratio pattern.                       |
| **Hunger tier**               | Named band from `resolvingWorldPlazaHungerTier`: well fed, content, peckish, hungry, starving. Drives movement/stamina modifiers.                                             |
| **Tier threshold**            | Inclusive lower bound in `DEFINING_WORLD_PLAZA_HUNGER_TIER_THRESHOLD`. Ratio at or above the bound lands in that tier or better.                                              |
| **Idle drain**                | Baseline hunger loss per second while standing still: `DEFINING_WORLD_PLAZA_HUNGER_IDLE_DRAIN_PER_SECOND`. Full bar empties in **1.5 in-game days** (60 real minutes).        |
| **Activity drain multiplier** | Walk **×1.15**, sprint **×2.0** applied on top of idle drain for the current frame.                                                                                           |
| **Metabolism multiplier**     | Per-avatar `hungerDrainMultiplier` from character engine stats. Scales drain and jump hunger cost (default **1**).                                                            |
| **Jump hunger cost**          | Flat ratio spend per jump: **0.004** standing/walk, **0.006** run jump. Multiplied by metabolism.                                                                             |
| **Regen gate**                | Passive health regen allowed only when hunger ratio is **above 30%** (`DEFINING_WORLD_PLAZA_HUNGER_HEALTH_REGEN_MIN_RATIO`).                                                  |
| **Starvation**                | When ratio hits **0**, periodic damage ticks drain effective max health until death or food arrives.                                                                          |
| **Starvation tick**           | Gated every **2000 ms** (`DEFINING_WORLD_PLAZA_HUNGER_STARVATION_TICK_INTERVAL_MS`). Damage is a percent of effective max HP with **0.7–1.4×** variance.                      |
| **Effective hunger restore**  | Ratio added by eating. May be halved when food sickness applies (resolved in inventory-food, not in the hunger hook).                                                         |
| **Forage restore constant**   | Named hunger fill for non-meat foods in `definingWorldPlazaHungerConstants.ts` (berries, apple, fish, wheat). Wired on the matching inventory item `food.hungerRestoreRatio`. |

## Tier effects (movement aggregate)

| Term                 | Meaning                                                                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Movement effects** | `ResolvingWorldPlazaHungerMovementEffects`: speed, stamina drain/regen, jump cost multipliers, sprint/jump disable flags, `isHealthDraining`. |
| **Well fed bonus**   | At ≥75%: **+10%** stamina regen (`DEFINING_WORLD_PLAZA_HUNGER_WELL_FED_STAMINA_REGEN_MULTIPLIER` = 1.1).                                      |
| **Peckish penalty**  | At 20–40%: **+25%** stamina drain and jump cost (multipliers 1.25).                                                                           |
| **Hungry penalty**   | At 5–20%: **−10%** walk speed (0.9), **+50%** jump cost (1.5), **sprint disabled**.                                                           |
| **Starving penalty** | Below 5%: **−20%** walk speed (0.8), **sprint and jump disabled**, **health draining** active.                                                |

## Runtime and UI

| Term                     | Meaning                                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------- |
| **Client-authoritative** | Hunger state lives in refs inside `usingWorldPlazaPlayerHunger`. Not synced over multiplayer payload.   |
| **HUD push interval**    | React snapshot updates at most every **200 ms** (`DEFINING_WORLD_PLAZA_HUNGER_HUD_PUSH_INTERVAL_MS`).   |
| **HUD epsilon**          | Ratio change smaller than **0.005** does not force a re-render if tier and starving flag are unchanged. |
| **Max frame delta**      | Hunger advancement caps frame delta at **0.05 s** to survive tab stalls.                                |
| **eatingFoodRef**        | Callback that adds restore ratio, clears starvation tick timer, returns `false` when already full.      |
| **resettingHungerRef**   | Sets ratio back to full (respawn, hunger disabled).                                                     |

## Code prefixes (project convention)

| Prefix                        | Role in this context                    |
| ----------------------------- | --------------------------------------- |
| `definingWorldPlazaHunger*`   | Constants, types, initial state         |
| `resolvingWorldPlazaHunger*`  | Pure tier and movement effect resolvers |
| `advancingWorldPlazaHunger*`  | Per-frame drain and starvation roll     |
| `usingWorldPlazaPlayerHunger` | React hook owning the hunger loop       |

## Anti-patterns (words to avoid)

| Don't say                           | Say instead                                                                                     |
| ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| "Hunger points" or "calories"       | **Hunger ratio** (0..1)                                                                         |
| "Starving tier" when ratio is 5–20% | **Hungry tier** (starving is below 5%)                                                          |
| "Hunger debuff"                     | **Hunger tier effect** or name the tier (peckish, hungry, starving)                             |
| "Server hunger"                     | **Local player hunger** (client-only today)                                                     |
| "Food fills hunger instantly"       | **Restore ratio** applied via `eatingFoodRef` after eat effects resolve                         |
| "Starvation bypasses shields"       | Starvation uses `applyStarvationDamageRef` (direct HP loss, no shield/regen-delay side effects) |
