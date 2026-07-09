# Combat glossary (ubiquitous language)

Terms used consistently across code, docs, and player-facing copy for the Plaza combat bounded context.

## Core concepts

| Term                        | Meaning                                                                                                                      |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Expected damage (EV)**    | Mean instant hit before statistical spread. Callers pass flat EV or max-health percent depending on damage kind.             |
| **Rolled damage**           | Final HP subtracted after the damage engine samples deviation and clamps at zero.                                            |
| **Deviation score (σ)**     | How many standard deviations the roll sits from EV: `(rolledDamage - EV) / SD`. Drives tier classification and float sizing. |
| **Standard deviation (SD)** | Roll spread width: max(**1**, EV × **0.2**) unless overridden by caller.                                                     |
| **Damage outcome tier**     | Label for a roll band: `fatal`, `lethal`, `critical`, `normal`, `true_strike`, `softened`, `blocked`, `dodged`.              |
| **Damage kind**             | Source category (`physical`, `fall`, `toxic`, `bleeding`, …) with its own roll rules, float icon, and shield behavior.       |
| **Shield points**           | Temporary buffer that absorbs **physical** hits only. Other kinds bypass shield.                                             |
| **DoT tick**                | Periodic damage from poison, bleed, environmental heat/cold, or starvation. Default interval **1s**.                         |

## Damage roll tiers

| Tier            | Threshold (σ)                                   | Player feel                            |
| --------------- | ----------------------------------------------- | -------------------------------------- |
| **fatal**       | ≥ +3                                            | Highest damage band; scythe float icon |
| **lethal**      | ≥ +2                                            | Heavy orange skull float               |
| **critical**    | ≥ +1                                            | Amber target float                     |
| **normal**      | between −1 and +1 (exclusive of low thresholds) | Default red sword float                |
| **true_strike** | forced (`lock_in` roll mode)                    | Exact EV, no spread; crosshairs float  |
| **softened**    | ≤ −1                                            | Reduced hit; shield-half icon          |
| **blocked**     | ≤ −2                                            | Shield-like outcome                    |
| **dodged**      | ≤ −3                                            | Minimal or zero damage; runner icon    |

High tiers are checked first (fatal before lethal). Low tiers are checked after normal band fails.

## Damage kinds (summary)

| Kind                                           | Uses roll engine | Shield absorbs | Notes                             |
| ---------------------------------------------- | ---------------- | -------------- | --------------------------------- |
| `physical`                                     | yes              | yes            | Melee, projectiles, wildlife hits |
| `fall`                                         | yes              | no             | Safe ≤ **5** layer delta          |
| `potential_damage`                             | yes              | no             | Fated delayed EV hit              |
| `soulbreak`                                    | yes              | no             | EV = max-health percent input     |
| `environmental_*`                              | no               | no             | Lava, heat, cold DoT              |
| `toxic` / `venomous` / `lethal`                | no               | no             | Poison potency lanes              |
| `bleeding` / `hemorrhaging` / `exsanguinating` | no               | no             | Bleed severity lanes              |
| `healing`                                      | no               | no             | Restores HP                       |
| `starvation`                                   | no               | no             | Hunger death DoT                  |

Full table: [catalog.md](./catalog.md).

## Vitals and mitigation

| Term                      | Meaning                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Base max health**       | Default **1000** HP (`DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX`). Character engine can override per skin. |
| **Low-health threshold**  | Below **50%** HP, incoming damage × **0.75** (25% reduction).                                                |
| **Health regen**          | **2 HP/s** after **5s** since last damage (character can override regen rate).                               |
| **Respawn invincibility** | **10s** after death; sprite blinks every **180ms** at alpha **0.2**.                                         |
| **Roll dodge**            | Girl Sample roll animation window reduces **physical** damage. See [movement-stamina](../movement-stamina/). |

## DoT systems

| Term                | Meaning                                                                                                         |
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Bleed pool**      | Front-loaded damage over severity duration. Repeat hits add stacks.                                             |
| **Bleed stack**     | Counter toward next severity tier: **10** `bleeding` → `hemorrhaging`; **5** `hemorrhaging` → `exsanguinating`. |
| **Poison pool**     | Total toxic damage dealt over effect duration with ramp curve.                                                  |
| **Poison ramp**     | **15%** pool in first **50%** of time, **35%** in next **35%**, **50%** in final **15%**.                       |
| **Poison min tick** | Each tick deals at least **1** damage while pool is active.                                                     |

## Player targeting

| Term               | Meaning                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **Combat lock-on** | Clicking wildlife locks chase + auto-melee on that instance until cancel, death, or a new target. |
| **Chase**          | Run path toward the locked animal while outside melee reach (**1.8** grid).                       |
| **Auto-melee**     | Repeated swings while locked and in reach; each strip roots the avatar until it finishes.         |
| **Click-away**     | Empty-ground click (or other non-target interact) clears lock-on and starts a normal walk.        |
| **Lock crosshair** | Amber ring+ticks marker on the locked animal; same glyph as the attack-hover CSS cursor.          |

## Incapacitation

| Term          | Meaning                                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sleep**     | Cannot move or act. Default **8s**. Slow death-strip fall, then **Zzz** bubbles. Any damage wakes target and adds **30** bonus wake damage. |
| **Stun**      | Cannot move or act. Default **4s**. Gold dots orbit the avatar head.                                                                        |
| **Confusion** | Input direction scramble (owned by buff/disease contexts, applied via health state).                                                        |

## Environmental hazards

| Term                      | Meaning                                    |
| ------------------------- | ------------------------------------------ |
| **Fall safe delta**       | Falls of ≤ **5** layers deal no damage.    |
| **Fall damage per layer** | **15 HP** per layer beyond safe threshold. |
| **Lava instant**          | **15** HP on tile entry.                   |
| **Lava DoT**              | **25 HP/s** while standing in lava.        |
| **Heat climate DoT**      | **8 HP/s** when climate temp ≥ **0.72**.   |
| **Cold climate DoT**      | **6 HP/s** when climate temp ≤ **0.3**.    |

## UI and presentation

| Term                      | Meaning                                                    |
| ------------------------- | ---------------------------------------------------------- |
| **Combat float**          | Floating damage/heal number with tier styling and icon.    |
| **Status effect HUD row** | Sleep, stun, bleed, poison icons under the health bar.     |
| **Death screen title**    | Per damage kind string (e.g. `YOU BURNED`, `FATED DEATH`). |

## Code prefixes (project convention)

| Prefix       | Role in this context                                              |
| ------------ | ----------------------------------------------------------------- |
| `defining*`  | Tier registry, damage kinds, health constants, bleed/poison ramps |
| `rolling*`   | Statistical damage engine                                         |
| `computing*` | Damage pipeline, poison tick math, roll dodge multiplier          |
| `applying*`  | Poison/bleed pool application                                     |
| `advancing*` | Health tick (DoT, regen, incapacitation expiry)                   |
| `checking*`  | Shield absorption, action locks during sleep/stun                 |
| `listing*`   | HUD status rows, dev tier button order                            |

## Anti-patterns (words to avoid)

| Don't say              | Say instead                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| "Crit roll"            | **Critical tier** (σ ≥ +1) or specific buff id                        |
| "Dodge stat"           | **Dodged tier** from low σ, or **roll dodge** animation mitigation    |
| "Damage type"          | **Damage kind** (`physical`, `fall`, …)                               |
| "DoT damage"           | Name the pool: **bleed pool**, **poison pool**, or environmental kind |
| "Invincibility frames" | **Roll dodge window** (physical only) or **respawn invincibility**    |
