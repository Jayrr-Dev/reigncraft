# Disease glossary (ubiquitous language)

Terms used consistently across code, docs, and player-facing copy for the Plaza disease bounded context.

## Core concepts

| Term                 | Meaning                                                                                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Disease**          | A catalogued illness (`DefiningWorldPlazaEntityDiseaseDescriptor`) with incubation, symptomatic duration, severity, and an ordered list of **grants**.                                            |
| **Disease id**       | Stable string key (`salmonellosis`, `mad-cow`, …). Used in registry, save data, and meat catalog.                                                                                                 |
| **Disease instance** | One active infection on the player (`DefiningWorldPlazaEntityHealthDiseaseEffect`). Has its own `id`, timestamps, and `pendingGrants` queue. Multiple instances can coexist (different diseases). |
| **Contract**         | The moment infection is applied (`applyingWorldPlazaEntityDisease`). Sets `contractedAtMs` and schedules symptoms.                                                                                |
| **Incubation**       | Silent period after contract. Player has no disease HUD badge and grants do not fire. Ends at `symptomsStartAtMs`.                                                                                |
| **Symptomatic**      | Post-incubation illness window. HUD badge visible; staged grants fire; food sickness hunger penalty applies. Ends at `expiresAtMs`.                                                               |
| **Grant**            | One staged symptom definition (`DefiningWorldPlazaEntityDiseaseStageGrant`) with `delayMs` relative to symptom start. Fired once, then removed from `pendingGrants`.                              |
| **Pending grant**    | Scheduler entry `{ grantIndex, fireAtMs }` waiting for wall-clock time before dispatch.                                                                                                           |
| **Severity**         | Balance label on a definition: `mild`, `moderate`, `severe`, `critical`. Used for sorting and design review, not runtime math.                                                                    |

## Grant kinds

| Kind               | Dispatches to                      | Player feel                                                     |
| ------------------ | ---------------------------------- | --------------------------------------------------------------- |
| `buff`             | `disease-*` entry in buff registry | Movement slow, stamina drain, action locks, incoming damage amp |
| `poison`           | Poison stack on health state       | Green toxic DoT with ramping ticks                              |
| `bleed`            | Bleed stack on health state        | Red bleed DoT                                                   |
| `confusion`        | Confusion effect                   | Input direction scramble at given intensity                     |
| `sleep`            | Sleep effect                       | Incapacitation; wake may apply bonus damage                     |
| `potential_damage` | Fated damage queue                 | Delayed EV hit that resolves after `resolveDelayMs`             |

## Infection sources

| Term                   | Meaning                                                                                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Raw disease chance** | Per-species probability on eating **raw** meat (`rawDiseaseChance`). Roll `<` chance contracts that species' `rawDiseaseId`.                             |
| **Residual disease**   | Prion-style risk on **cooked** meat (`cookedResidualDiseaseId` + `cookedResidualDiseaseChance`). Cooking does not fully remove prions for deer and beef. |
| **Fallback poison**    | If raw meat roll misses disease, generic toxic DoT may still apply (`rawPoisonFlatEv` / duration on food definition).                                    |
| **Food sickness**      | While symptomatic (or just rolled sick on eat), hunger restore is multiplied by `0.5` (`DEFINING_WILDLIFE_FOOD_SICKNESS_HUNGER_MULTIPLIER`).             |

## Time model

| Term              | Meaning                                                                                                                                         |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **World epoch**   | Wall-clock ms (`Date.now()` via `resolvingWorldPlazaEntityDiseaseWorldEpochMs`). Diseases progress while logged out.                            |
| **In-game time**  | Narrative scale for tuning: 1 in-game day = 40 real minutes. Incubation and grant delays are authored in in-game hours/days, stored as real ms. |
| **Symptom delay** | `grant.delayMs` offset from `symptomsStartAtMs`, not from contract time.                                                                        |

## UI and persistence

| Term                      | Meaning                                                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Disease HUD badge**     | Lime/purple/amber icon row shown only when symptomatic. Separate from hidden `disease-grant:*` buff instances. Tap opens severity + stage detail lines. |
| **Simulation clock**      | Frame time (`performance.now()`) used for health ticks, movement multipliers, and grant effect `expiresAtMs` stamps.                                    |
| **Player conditions**     | Save-slot payload holding active `diseaseEffects` + `pendingGrants` for hydration on load.                                                              |
| **Mechanics guide entry** | Home-screen disease card built from registry via `listingPlazaMechanicsDiseaseBadgeGuideEntries`.                                                       |

## Severity tiers

| Tier         | Design intent                                                             |
| ------------ | ------------------------------------------------------------------------- |
| **mild**     | Introductory gut bugs; slow and small DoT, little fight impact            |
| **moderate** | Long debilitation without burst damage or hard incapacitation             |
| **severe**   | Action locks, strong poison/bleed, or prion length; high exploration cost |
| **critical** | Sleep waves, peak confusion, or large fated damage; fight-stoppers        |

## Code prefixes (project convention)

| Prefix                      | Role in this context                             |
| --------------------------- | ------------------------------------------------ |
| `defining*`                 | Disease registry, meat catalog, buff definitions |
| `applying*`                 | Contract disease, fire grants                    |
| `advancing*`                | Per-tick scheduler step                          |
| `resolving*`                | Food eat side effects, epoch, descriptors        |
| `listing*` / `grouping*`    | HUD and guide list builders                      |
| `checking*`                 | Incubating / symptomatic / infected predicates   |
| `serializing*` / `parsing*` | Save-slot round trip                             |

## Anti-patterns (words to avoid)

| Don't say           | Say instead                                                                |
| ------------------- | -------------------------------------------------------------------------- |
| "Debuff disease"    | Disease **grant** of kind `buff` referencing a `disease-*` buff id         |
| "Sickness debuff"   | **Food sickness** hunger penalty or generic `food-sickness-debuff`         |
| "Real-time disease" | Disease keyed to **world epoch** (wall clock)                              |
| "Disease buff"      | **Disease HUD badge** (visible) vs **disease-grant buff** (hidden symptom) |
