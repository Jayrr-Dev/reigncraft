# Wildlife glossary (ubiquitous language)

Terms used consistently across code, docs, and player-facing copy for the Plaza wildlife bounded context.

## Core concepts

| Term                  | Meaning                                                                                                                                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Species**           | A catalogued animal type (`DefiningWildlifeSpeciesDefinition`). Full roster in `definingWildlifeSpeciesRegistry.ts`.                                                                                                                                                            |
| **Species id**        | Stable kebab-case key (`grey-wolf`, `omega-wolf`, …). Used in registry, spawn tables, and meat catalog.                                                                                                                                                                         |
| **Omega Wolf**        | Night-only elite stalker (`omega-wolf`). Spawns with 4 grey-wolf escorts, never sleeps, always pack alpha, forced +3σ, dark-red name tag, siphoning lifesteal.                                                                                                                  |
| **Wildlife instance** | One live animal in the simulation (`DefiningWildlifeInstance`). Carries rolled aggression, sleep sample, size sample, and runtime AI/aggro state.                                                                                                                               |
| **Temperament**       | Behavior tree key: `docile`, `passive`, `skittish`, `retaliator`, `predator`, `ambusher`, `stalker`. One tree per temperament in `definingWildlifeBehaviorTreeRegistry.ts`.                                                                                                     |
| **Docile**            | Friendly stock (dogs/cats). Never opens combat on the player. Approach rolls follow vs flee from **aggression level**. Player hits need **Betray?** confirm.                                                                                                                    |
| **Betray?**           | Outlined white label over unauthorized docile wildlife (same chrome as Chop). Click starts a **Betraying....** windup (**2s**, backstab ring) then applies damage. No melee attack animation. Session auth per instance in `managingWildlifeDocileAttackAuthorizationStore.ts`. |
| **Spawn anchor**      | Deterministic tile placement seed for a pack or solo animal. Drives aggression, sleep, and size bell-curve rolls.                                                                                                                                                               |
| **Known anchor**      | Streamed-in spawn id kept in `knownAnchorIds` so a fled animal is not recreated at its spawn while the player is still nearby.                                                                                                                                                  |
| **Difficulty levers** | Global wildlife balance in `definingWildlifeDifficultyLevers.ts`: spawn spacing, density bias, prey/predator weights, temperament toggles, combat multipliers.                                                                                                                  |
| **Trophic tier**      | Food-chain rank: `1` (herbivore prey), `2` (omnivore / wolf), `3` (apex). Used when explicit prey lists are absent.                                                                                                                                                             |

## Aggro and combat

| Term                            | Meaning                                                                                                                             |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Threat**                      | Per-target aggro meter on an instance. Active combat target requires threat ≥ **1.5** (`DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD`). |
| **Threat per damage**           | Default **2.5** threat added per point of damage taken (species `aggro.threatPerDamage`).                                           |
| **Threat decay**                | Default **0.4/s** off each threat entry (`aggro.threatDecayPerSecond`).                                                             |
| **Aggro radius**                | Grid distance within which proximity threat or on-sight checks apply (`aggro.aggroRadiusGrid`, per species).                        |
| **Leash distance**              | Max grid distance from spawn anchor before predators return (`aggro.leashDistanceGrid`).                                            |
| **Pack threat share**           | When one packmate is damaged, allies within `packShareRadiusGrid` gain **45%** of that hit's threat.                                |
| **Proximity threat (starving)** | Default **0.5** threat/s baseline while starving inside aggro radius; scaled by aggression profile.                                 |
| **Melee range**                 | **1.1** grid units for a landed wildlife swing (`DEFINING_WILDLIFE_MELEE_RANGE_GRID`).                                              |
| **On-hit proc**                 | Optional bleed, poison, or debuff buff rolled per landed swing (`definingWildlifeSpeciesOnHitEffectRegistry.ts`).                   |
| **Passive damage-roll trait**   | Permanent defender roll modifier on a species at spawn (`passiveDamageRollModifiers`). Turtle shell uses `block_bias` **1**.        |
| **Adrenaline Rush**             | Species passive (`adrenalineRush`): on first transition into flee, stamina restores to full and exhaustion clears. Wolves use this. |

## Aggression spawn roll

| Term                            | Meaning                                                                                                                                                        |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Aggression level**            | Per-instance bell-curve roll: `tame` / `normal` / `aggressive`. For **docile** species this is also friendliness (follow chance). Player hits demote one step. |
| **Aggressive attacks on sight** | When true (chicken), aggressive herbivore spawns may melee the player without prior damage.                                                                    |
| **On-sight aggro**              | Predators, ambushers, and stalkers may open combat when aggressive; normal spawns need hunger drive unless already threatened.                                 |

## Food chain and hunting

| Term                        | Meaning                                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Prey allow list**         | Explicit species ids a predator may hunt regardless of trophic math (wolf, crocodile).                             |
| **Prey deny list**          | Species ids never hunted (wolf denies other wolves).                                                               |
| **Favorite prey**           | Priority hunt target on sight (grey-wolf: **sheep**). Sight radius = hunt radius **14** grid.                      |
| **Hunt radius**             | **14** grid to scent huntable prey (`DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID`).                                    |
| **Proximity attack radius** | **6** grid for immediate melee/chase on nearby prey.                                                               |
| **Ground food scent**       | **12** grid to smell edible ground items.                                                                          |
| **Chew timer**              | One ground-food unit takes a rolled **5–10s** chew (`pendingGroundFoodBite`, `DEFINING_WILDLIFE_GROUND_FOOD_BITE_DELAY_MIN/MAX_MS`) before it is consumed. Combat, flee, or chase intents cancel it; returning restarts the full window. |
| **Meat scavenging**         | Carnivores and omnivores (diet ≠ herbivore) select nearby **meat** ground stacks even when sated (`meatOnly` filter in `resolvingWildlifeNearestEdibleGroundFood`). Hunger-motivated foraging still covers all edible food. |
| **Ground food eat ring**    | Reusable progress circle around a ground stack (`RenderingWorldPlazaGroundItemProgressRing`); fills while wildlife is in `forageEat` over the current chew timer. Same ring used for player pickup channels. |
| **Hunter feeding**          | After a kill, predators lock on the corpse meal for **10s** (`DEFINING_WILDLIFE_HUNTER_KILL_FEEDING_DURATION_MS`). |
| **Favorite prey revenge**   | Player damaging a predator's favorite prey locks that predator onto the player for **30s**.                        |

## Sleep and activity

| Term                             | Meaning                                                                                                                                                    |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Activity pattern**             | When the species rests: `diurnal`, `nocturnal`, `crepuscular`, `cathemeral`.                                                                               |
| **Sleep schedule sample**        | Per-spawn standard-normal roll; shifted by optional species `sleepSchedule.bellCurveMeanShift` (none set on current roster).                               |
| **Phase window offset**          | Positive σ widens sleep window edges; negative σ narrows (short sleepers). ±2σ ≈ ±4.8 real minutes total shift.                                            |
| **Cathemeral sleep probability** | Per 12-bucket phase roll; base **42%**, shifted ±6% per σ, clamped **18-72%**.                                                                             |
| **Sleep disturbed**              | First damage hit (or successful bump wake) wakes the animal permanently for that life (`hasSleepBeenDisturbed`).                                           |
| **Bump wake**                    | **33%** chance when the player overlaps a sleeper; rolled once per contact, then locked until overlap ends.                                                |
| **Wake vocalization**            | Species-unique speech bubble (`wake` context) on schedule wake, bump wake, or hit wake.                                                                    |
| **Docile approach vocalization** | Dogs/cats force a speech bubble on approach react: `friendly` (follow → bark/meow) or `flee`. While trailing (`followPlayer`), sustained `friendly` lines. |
| **Nearby wake**                  | **40%** chance per same-species sleeper within **10** grid when one is struck.                                                                             |
| **Post-aggro sleep block**       | **45s** after combat before schedule sleep may resume.                                                                                                     |

## Bestiary codex

| Term                         | Meaning                                                                                                                                             |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sighted**                  | Species logged in the Guide bestiary after the player comes within **18** grid (`DEFINING_WORLD_PLAZA_BESTIARY_SIGHT_RADIUS_GRID`).                 |
| **Studied**                  | Species with at least **1** completed corpse Study; unlocks field notes (temperament, diet, activity, studied summary).                             |
| **Study tier**               | Per-species study milestone: **1 / 10 / 50 / 100 / 200** unlocks deeper combat, proc, ecology, and loot dossier blocks.                             |
| **Study count**              | Cumulative corpse Study completions per species in `studyCounts` localStorage (legacy `killCounts` migrates).                                       |
| **Corpse Study**             | Timed channel on a dead animal (**3–10s** by mass) while the corpse lasts (**60s**). Hides local name + HP/stamina while active. Awards **1–3** study points by mass; pops a rising `+N` float. |
| **Bestiary entry**           | Declarative row in `definingPlazaBestiaryGuideConstants.ts`: icon, sight summary, studied summary, optional Apostle flavor at **200** studies.      |
| **Bestiary discovery store** | Module store for `sighted` set + per-species `studyCounts`; persists to `localStorage` and notifies Guide UI subscribers.                           |
| **Dev bestiary unlock**      | Dev-mode helpers that set sighted/study progress without world studies (`setting*ForDev`, unlock-all / lock-all). Not player-facing.                |
| **Biome Animals chips**      | Explored Biomes **Region details** list spawn-table species; sighted names, else `???` (`resolvingPlazaBiomesGuideAnimalsDisplay.ts`).              |
| **Bestiary habitat chips**   | Species detail lists spawn biomes; explored biomes show names, else `???` (`resolvingPlazaBestiaryGuideDisplayEntries.ts`).                         |

## Pack and herd reactions

| Term                   | Meaning                                                                                                                                                                                                                                                                                   |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pack alpha**         | Largest living nearby pack member (within **14** grid) at first lock; sticky until death. Survivors flee/regroup **8s**, then elect a new alpha. When revealed, name tag uses **Alpha** prefix (same visibility as other wildlife).                                                       |
| **Herd panic**         | Passive herd members flee **10** grid when an ally is hit, blending flee heading.                                                                                                                                                                                                         |
| **Defend young**       | When a baby (σ tier **-2**) is hurt, same-species adults (σ tier **≥0**, age-20+ proxy) within pack share radius attack the attacker. Default on; opt out per species.                                                                                                                    |
| **Separation anxiety** | Young (σ tier **≤ −1**) run to a larger same-species animal when farther than **4** grid; stop within **2** grid. Default on; opt out per species.                                                                                                                                        |
| **Social hunter**      | Opt-in pack gate (`socialBehavior.socialHunter`). Forgoes opening a hunt until living area pack size ≥ **3**; while under strength, runs (`seekPackmate`) toward packmates within **28** grid. Grey-wolf and omega-wolf.                                                                  |
| **Territory warn**     | Retaliators, predators, and **aggressive (pissed) herbivores** face intruders near the spawn anchor before escalating. Species with a `territory` row use that profile; pissed grazers without one get a synthetic warn band (`DEFINING_WILDLIFE_AGGRESSIVE_HERBIVORE_TERRITORY_CONFIG`). |
| **Territory size**     | `warnRadiusGrid`: stand-and-face distance from the animal while the player is still inside the home patch. |
| **Territory threaten size** | `escalateRadiusGrid`: close band that applies high threat/s and forces a fight. |
| **Home patch / territory line** | `anchorRadiusGrid` around spawn. Outside it, territory threat does not build; leaving it can abort a bluff charge. Rhino uses `DEFINING_WILDLIFE_RHINO_TERRITORY_CONFIG` (home **11**, warn **7**, escalate **3.5**), separate from heavy grazers. |
| **Bluff charge**       | First player charge for species with `charge.bluff` (rhino): if the player runs past the territory line, the rush aborts at **50%** stamina and the animal walks back to its charge origin. One-shot per life. |
| **Gap jump**           | Jump-capable animals clear water or jumpable terrain ahead while moving (`resolvingWildlifeTerrainGapJumpPlan`). Detect range **2.5** grid; max height **4** layers.                                                                                                                      |
| **Safe-terrain seeking** | Reusable behavior: jump-capable fleet prey (deer, stag, antilope, oryx, zebra) bias headings toward nearby rivers or tall cliffs so a gap sits between them and a threat. Ostrich excluded (no jump). First consumer: flee intent. |
| **Pounce**             | Predator chase jump at a target inside `maxJumpDistanceGrid` (`resolvingWildlifePounceJumpPlan`). Lands short of the target.                                                                                                                                                              |
| **Fleet prey**           | Deer, stag, antilope, oryx, zebra, ostrich. Shared **75%** exhaust exit; unique speed/jump/stamina/acceleration identities.                                                                                                                                                              |
| **Burst ramp**           | Short-term accel: seconds to lerp walk → base run (`burstRampSeconds`).                                                                                                                                                                                                                  |
| **Momentum**             | Long-term accel: sustained run earns up to `momentumBonusMultiplier` over `momentumRampSeconds`.                                                                                                                                                                                         |
| **Max stamina ratio**    | Species stamina pool capacity (`maxStaminaRatio`, default **1**). Apex frame multiplies by **1.3** (`DEFINING_WILDLIFE_APEX_MAX_STAMINA_RATIO`).                                                                                                                                         |
| **Running for seconds**  | `staminaState.runningForSeconds`: continuous sprint clock. Accumulates while `isRunning`; resets to **0** when the animal stops sprinting. Feeds burst/momentum.                                                                                                                         |
| **Steering turn rate**   | Max heading change while moving (`maxTurnRadiansPerSecond` **2.8**). Keeps flee/chase paths on smooth curves instead of snapping between the **16** candidate headings.                                                                                                                  |
| **Heading continuity**   | Extra score for candidates aligned with the current heading (`headingContinuityBonus` **0.45**) so near-ties do not flip left/right each re-score.                                                                                                                                       |
| **Size scale**           | Render/collision scale for one instance: species `sizeScale` × bell-curve roll (clamped **0.42–1.9**) × rare frame boosts. Drives sprite size and ground-shadow layout.                                                                                                                  |
| **Sprite presentation**  | Per-species `anchorYNormalized` / `footYNormalized` / frame height for Pixi anchor and shadow foot line (`definingWildlifeSpritePresentationConstants.ts`).                                                                                                                              |
| **Ground shadow**        | Soft ellipse under the animal (shared avatar drawer). Foot Y scales with `sizeScale` so empty sheet margin does not float large animals or bury runts.                                                                                                                                  |
| **Planted feet**         | Override where painted feet sit on the grid anchor (`anchorY` = `footY`) and the avatar foot nudge is cancelled. Used for chicken and tall/megafauna sheets with large empty margin under the feet.                                                                                    |

## Stalk hunt (stalker temperament)

| Term                        | Meaning                                                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Stalker**                 | Temperament using the pack stalk pipeline. Only **grey-wolf** today; statechart is species-agnostic.             |
| **Stalk phase**             | Hunt state: `idle`, `shadowing`, `retreating`, `regrouping`, `formingUp`, `surrounding`, `attacking`, `fleeing`. |
| **Shadowing**               | Mandatory **15s** trailing phase after target lock before pack commit triggers.                                  |
| **Kill window**             | Force-commit on prey HP **<50%**, stamina **≤2%**, or still **8s**; else pack-confidence roll after shadow.      |
| **Pack confidence**         | Post-shadow commit chance by hunter count: **10% / 22% / 40% / 62% / 88%** (1–5+). Re-rolls every **4s**.        |
| **Attack burst**            | Once committed: **4s** melee, then peel to **surrounding** to re-flank (does not drop back to passive shadow).   |
| **Pack surround commit**    | Requires **≥3** wolves on one prey plus weakness or a successful confidence roll.                                |
| **Confident pack**          | **≥5** wolves may enter **formingUp** early; **10-15s** formation timer before surround.                         |
| **Stalk aggro timeout**     | **120s** without a kill drops player stalk.                                                                      |
| **Stalk eligibility**       | Only `temperamentId: 'stalker'` runs the statechart. Other species use predator/ambusher trees.                  |
| **Mass-weighted prey pick** | Alpha stalk lock prefers lighter prey (`1 / √mass`); favorites get **1.75×**. Re-roll bucket **15s**.            |
| **Shared pack prey**        | Nearby same-species wolves share one hunt; followers inherit the alpha stalk lock within **14** grid.            |

## Code prefixes (project convention)

| Prefix       | Role in this context                                     |
| ------------ | -------------------------------------------------------- |
| `defining*`  | Species, behavior trees, stalk machine, tuning constants |
| `advancing*` | Simulation, aggro, behavior, stalk ticks                 |
| `applying*`  | Damage, pack events, herd flee, favorite-prey revenge    |
| `checking*`  | On-sight aggro, sleep blocked, stalk phase predicates    |
| `resolving*` | Sleep schedule, on-hit procs, behavior tree lookup       |
| `listing*`   | Stalker prey candidates, species ids                     |
| `spawning*`  | Biome and dev spawn helpers                              |

## Anti-patterns (words to avoid)

| Don't say          | Say instead                                                                            |
| ------------------ | -------------------------------------------------------------------------------------- |
| "Wolf AI"          | **Stalker temperament** pipeline (grey-wolf is the reference species)                  |
| "Aggro range"      | **Aggro radius** (`aggroRadiusGrid`) or **hunt radius** (14 grid) depending on context |
| "Pack attack mode" | **Stalk phase** `surrounding` or `attacking`                                           |
| "Sleeping buff"    | Animal is **asleep** on schedule (`aiState.motionClip: 'sleep'`)                       |

## Cross-context terms

| Term                | Bounded context                                           |
| ------------------- | --------------------------------------------------------- |
| **Raw meat loot**   | [cooking-campfire](../cooking-campfire/) meat catalog row |
| **Disease on eat**  | [disease](../disease/) contract from raw/cooked meat      |
| **Day/night phase** | [day-night](../day-night/) cycle driving sleep windows    |
