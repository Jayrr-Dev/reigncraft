# Wildlife glossary (ubiquitous language)

Terms used consistently across code, docs, and player-facing copy for the Plaza wildlife bounded context.

## Core concepts

| Term | Meaning |
| ---- | ------- |
| **Species** | A catalogued animal type (`DefiningWildlifeSpeciesDefinition`). Eleven ids in the starter roster. |
| **Species id** | Stable kebab-case key (`grey-wolf`, `brown-bear`, …). Used in registry, spawn tables, and meat catalog. |
| **Wildlife instance** | One live animal in the simulation (`DefiningWildlifeInstance`). Carries rolled aggression, sleep sample, size sample, and runtime AI/aggro state. |
| **Temperament** | Behavior tree key: `passive`, `skittish`, `retaliator`, `predator`, `ambusher`, `stalker`. One tree per temperament in `definingWildlifeBehaviorTreeRegistry.ts`. |
| **Spawn anchor** | Deterministic tile placement seed for a pack or solo animal. Drives aggression, sleep, and size bell-curve rolls. |
| **Trophic tier** | Food-chain rank: `1` (herbivore prey), `2` (omnivore / wolf), `3` (apex). Used when explicit prey lists are absent. |

## Aggro and combat

| Term | Meaning |
| ---- | ------- |
| **Threat** | Per-target aggro meter on an instance. Active combat target requires threat ≥ **1.5** (`DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD`). |
| **Threat per damage** | Default **2.5** threat added per point of damage taken (species `aggro.threatPerDamage`). |
| **Threat decay** | Default **0.4/s** off each threat entry (`aggro.threatDecayPerSecond`). |
| **Aggro radius** | Grid distance within which proximity threat or on-sight checks apply (`aggro.aggroRadiusGrid`, per species). |
| **Leash distance** | Max grid distance from spawn anchor before predators return (`aggro.leashDistanceGrid`). |
| **Pack threat share** | When one packmate is damaged, allies within `packShareRadiusGrid` gain **45%** of that hit's threat. |
| **Proximity threat (starving)** | Default **0.5** threat/s baseline while starving inside aggro radius; scaled by aggression profile. |
| **Melee range** | **1.1** grid units for a landed wildlife swing (`DEFINING_WILDLIFE_MELEE_RANGE_GRID`). |
| **On-hit proc** | Optional bleed, poison, or debuff buff rolled per landed swing (`definingWildlifeSpeciesOnHitEffectRegistry.ts`). |

## Aggression spawn roll

| Term | Meaning |
| ---- | ------- |
| **Aggression level** | Per-instance bell-curve roll: `tame` (~9%), `normal` (~82%), `aggressive` (~9%) before species `bellCurveMeanShift`. |
| **Aggressive attacks on sight** | When true (chicken), aggressive herbivore spawns may melee the player without prior damage. |
| **On-sight aggro** | Predators, ambushers, and stalkers may open combat when aggressive; normal spawns need hunger drive unless already threatened. |

## Food chain and hunting

| Term | Meaning |
| ---- | ------- |
| **Prey allow list** | Explicit species ids a predator may hunt regardless of trophic math (wolf, crocodile). |
| **Prey deny list** | Species ids never hunted (wolf denies other wolves). |
| **Favorite prey** | Priority hunt target on sight (grey-wolf: **sheep**). Sight radius = hunt radius **14** grid. |
| **Hunt radius** | **14** grid to scent huntable prey (`DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID`). |
| **Proximity attack radius** | **6** grid for immediate melee/chase on nearby prey. |
| **Ground food scent** | **12** grid to smell edible ground items. |
| **Hunter feeding** | After a kill, predators lock on the corpse meal for **10s** (`DEFINING_WILDLIFE_HUNTER_KILL_FEEDING_DURATION_MS`). |
| **Favorite prey revenge** | Player damaging a predator's favorite prey locks that predator onto the player for **30s**. |

## Sleep and activity

| Term | Meaning |
| ---- | ------- |
| **Activity pattern** | When the species rests: `diurnal`, `nocturnal`, `crepuscular`, `cathemeral`. |
| **Sleep schedule sample** | Per-spawn standard-normal roll; shifted by optional species `sleepSchedule.bellCurveMeanShift` (none set on current roster). |
| **Phase window offset** | Positive σ widens sleep window edges; negative σ narrows (short sleepers). ±2σ ≈ ±4.8 real minutes total shift. |
| **Cathemeral sleep probability** | Per 12-bucket phase roll; base **42%**, shifted ±6% per σ, clamped **18-72%**. |
| **Sleep disturbed** | First damage hit wakes the animal permanently for that life (`hasSleepBeenDisturbed`). |
| **Nearby wake** | **40%** chance per same-species sleeper within **10** grid when one is struck. |
| **Post-aggro sleep block** | **45s** after combat before schedule sleep may resume. |

## Pack and herd reactions

| Term | Meaning |
| ---- | ------- |
| **Pack alpha** | Closest packmate to the player during stalk/roam; death scatters survivors (**18** grid flee). |
| **Herd panic** | Passive herd members flee **10** grid when an ally is hit, blending flee heading. |
| **Territory warn** | Retaliators and predators face intruders near spawn anchor before escalating (boar, bear, lion, wolf). |

## Stalk hunt (stalker temperament)

| Term | Meaning |
| ---- | ------- |
| **Stalker** | Temperament using the pack stalk pipeline. Only **grey-wolf** today; statechart is species-agnostic. |
| **Stalk phase** | Hunt state: `idle`, `shadowing`, `retreating`, `regrouping`, `formingUp`, `surrounding`, `attacking`, `fleeing`. |
| **Shadowing** | Mandatory **15s** trailing phase after target lock before pack commit triggers. |
| **Kill window** | Commit when prey HP **<50%**, stamina **≤2%**, or standing still **8s**. |
| **Pack surround commit** | Requires **≥3** wolves on one prey. |
| **Confident pack** | **≥5** wolves skip weakness wait; **10-15s** formation timer before surround. |
| **Stalk aggro timeout** | **120s** without a kill trigger drops player stalk. |
| **Stalk eligibility** | Only `temperamentId: 'stalker'` runs the statechart. Other species use predator/ambusher trees. |

## Code prefixes (project convention)

| Prefix | Role in this context |
| ------ | -------------------- |
| `defining*` | Species, behavior trees, stalk machine, tuning constants |
| `advancing*` | Simulation, aggro, behavior, stalk ticks |
| `applying*` | Damage, pack events, herd flee, favorite-prey revenge |
| `checking*` | On-sight aggro, sleep blocked, stalk phase predicates |
| `resolving*` | Sleep schedule, on-hit procs, behavior tree lookup |
| `listing*` | Stalker prey candidates, species ids |
| `spawning*` | Biome and dev spawn helpers |

## Anti-patterns (words to avoid)

| Don't say | Say instead |
| --------- | ----------- |
| "Wolf AI" | **Stalker temperament** pipeline (grey-wolf is the reference species) |
| "Aggro range" | **Aggro radius** (`aggroRadiusGrid`) or **hunt radius** (14 grid) depending on context |
| "Pack attack mode" | **Stalk phase** `surrounding` or `attacking` |
| "Sleeping buff" | Animal is **asleep** on schedule (`aiState.motionClip: 'sleep'`) |

## Cross-context terms

| Term | Bounded context |
| ---- | ---------------- |
| **Raw meat loot** | [cooking-campfire](../cooking-campfire/) meat catalog row |
| **Disease on eat** | [disease](../disease/) contract from raw/cooked meat |
| **Day/night phase** | [day-night](../day-night/) cycle driving sleep windows |
