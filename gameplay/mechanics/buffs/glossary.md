# Buffs glossary (ubiquitous language)

Terms used consistently across code, docs, and player-facing copy for temporary entity buffs and debuffs.

## Core concepts

| Term                | Meaning                                                                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Buff descriptor** | Static catalog row `DefiningWorldPlazaEntityBuffDescriptor`: id, label, description, polarity, category, duration, effect.               |
| **Buff instance**   | Runtime entry on health state (movement modifier, incoming damage modifier, sleep effect, etc.) keyed by buff `id` or scoped disease id. |
| **Polarity**        | `buff` (positive) or `debuff` (negative). HUD styling and mechanics guide label.                                                         |
| **Category**        | `combat`, `defence`, `utility`, or `character`. Display order in mechanics guide.                                                        |
| **Duration kind**   | `toggle` (on/off until cleared), `timed` (expires at `nowMs + durationMs`), or `instant` (one-shot max HP / resist change).              |
| **Effect kind**     | Discriminated union on `effect`: roll modifiers, movement, incapacitation, resistances, etc.                                             |
| **Apply**           | `applyingWorldPlazaEntityBuff(state, buffId, nowMs)` mutates health state per effect kind.                                               |
| **Toggle**          | Re-applying an active toggle buff removes it (movement, incoming damage, sleep, stun, confusion, lifesteal, …).                          |

## Damage roll buffs

| Term                      | Meaning                                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Damage roll modifiers** | `effect.kind === 'damage_roll_modifiers'`. Side `attacker` or `defender`.                                                      |
| **Preset id**             | Buff id doubles as damage roll preset id in `DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_PRESETS`.                          |
| **Modifier id**           | Runtime id `{buffId}:{modifierIndex}` on attacker/defender modifier lists.                                                     |
| **Toggle preset**         | `togglingWorldPlazaEntityHealthDamageRollPreset` in health hook for roll-mod buffs.                                            |
| **Roll modifier kinds**   | `expected`, `variance`, `stability`, `luck`, `block_bias`, `dodge_bias`, `critical_bias`, `chaotic`, `lock_in`, `forced_tier`. |

## Movement and incapacitation

| Term                    | Meaning                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Movement modifier**   | Timed or toggle adjustment on `movementModifiers`: `speed` (walk and run), `walk_speed` (walk only), jump, stamina drain/regen, max stamina, or jump cost. |
| **Speed vs walk speed** | `speed` multiplies both walk and run. `walk_speed` multiplies walk only; sprint/run keeps other speed multipliers. Frostbite linear slow uses `walk_speed`. |
| **Companion modifiers** | Extra movement rows applied with same expiry (e.g. stamina-sick drain + regen, skybound jump arc + layer reach).                                 |
| **Action lock**         | `actionLocks`: blocks jump, roll, or sprint while buff instance active (`checkingWorldPlazaEntityActionLocked`).                                 |
| **Incapacitate sleep**  | Player cannot act; damage wakes with bonus `wakeBonusDamage` (default **30**) unless deep sleep. Presentation: slow death-strip fall, then **Zzz** speech bubbles. |
| **Deep sleep**          | Sleep with `canWakeFromDamage: false`. Timer must expire; hits/bumps do not clear it. Buff id `deep-sleep-debuff` (default **12s**). |
| **Incapacitate stun**   | Player cannot act until expiry (default **4000 ms**).                                                                                            |
| **Movement confusion**  | Input direction wobble at `intensity` (default **50**, range 1–100).                                                                             |

## Food and disease buffs

| Term                          | Meaning                                                                                                                                                               |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Well-fed buff**             | `well-fed-*` timed buffs rolled on cooked meat eat (`cookedWellFedChance`), stamped on the **simulation clock**.                                                      |
| **Disease symptom buff**      | `disease-*` debuffs granted by disease stage scheduler. Often `hideFromHud: true`. Effect expiry uses the **simulation clock**; grant fire times use **world epoch**. |
| **Disease grant instance id** | `disease-grant:{diseaseInstanceId}:{grantIndex}:{buffId}`. Hidden from buff HUD row.                                                                                  |
| **Food sickness debuff**      | `food-sickness-debuff`: sprint lock when movement modifier active; hunger halving is separate in eat resolver.                                                        |
| **Frostbite scoped buff** | `frostbite-*` registry rows with `hideFromHud: true`. Applied by frostbite stage sync (`applyingWorldPlazaEntityFrostbiteStageEffects.ts`), not `applyingWorldPlazaEntityBuff`. Instance ids use prefix `frostbite-stage:`. |

## HUD and guide

| Term                      | Meaning                                                                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Active buff HUD entry** | Row under health bar: label, icon, polarity, optional countdown (`expiresAtMs`).                                                              |
| **Disease HUD entry**     | Separate row from symptomatic `diseaseEffects` (not a buff catalog id). Includes `severityLabel` and stage `detailLines` for the tap popover. |
| **Mechanics badge guide** | Home UI cards from `listingPlazaMechanicsBuffBadgeGuideEntries` (all non-hidden registry entries).                                            |
| **Remaining seconds**     | `computingWorldPlazaEntityBuffHudRemainingSeconds` for timed rows. Disease badges count against world epoch.                                  |

## Stacking and limits

| Term                   | Meaning                                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Toggle exclusivity** | Same buff id toggles off if already active (per effect list).                                                              |
| **Damage-to-heal cap** | Stacked lifesteal/absorb ratios cap at **100%** (`DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_TO_HEAL_MAX_RATIO`).                  |
| **Heal amplifier cap** | Stacked incoming/outgoing heal amp bonus caps at **+200%** (`DEFINING_WORLD_PLAZA_ENTITY_HEAL_AMPLIFIER_MAX_BONUS_RATIO`). |
| **Temporary max HP**   | Rolled EV amount from `baseExpectedAmount` for timed temp HP buffs.                                                        |

## Code prefixes (project convention)

| Prefix                               | Role in this context        |
| ------------------------------------ | --------------------------- |
| `definingWorldPlazaEntityBuff*`      | Registry, categories, types |
| `applyingWorldPlazaEntityBuff`       | Apply/toggle mutations      |
| `checkingWorldPlazaEntityBuff*`      | Active predicates           |
| `listingWorldPlazaEntity*Buff*`      | HUD and guide list builders |
| `mappingWorldPlazaEntityBuffHudIcon` | Icon name per buff id       |

## Anti-patterns (words to avoid)

| Don't say                     | Say instead                                                                |
| ----------------------------- | -------------------------------------------------------------------------- |
| "Status effect" (generic)     | **Buff descriptor** or name the effect kind                                |
| "Disease buff" in HUD         | **Disease badge** (visible) vs **disease-grant instance** (hidden symptom) |
| "Passive buff" for roll mods  | **Toggle** damage roll preset (still player-activated in dev/mechanics UI) |
| "Stacking buffs" without kind | Specify list: movement modifiers stack entries; toggle ids flip off        |
| "Well fed hunger tier"        | **Well-fed buff** (cooked meat) vs **well_fed hunger tier** (≥75% ratio)   |
