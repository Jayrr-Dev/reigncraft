# Reigncraft game mechanics — AI reference

|                  |            |
| ---------------- | ---------- |
| **Version**      | 1.0.0      |
| **Last updated** | 2026-07-09 |

Read this when tuning **player-facing rules**: numbers, thresholds, status effects, wildlife behavior outcomes, and survival loops.

For engine wiring (hooks, Pixi ticks, registries, folder layout), see [game-engines-reference.md](./game-engines-reference.md).

## Quick orientation

| Concept                    | Location                                                                     |
| -------------------------- | ---------------------------------------------------------------------------- |
| In-game time scale         | `src/client/world/domains/computingWorldPlazaInGameDurationMs.ts`            |
| Day/night phase            | `src/client/world/domains/definingWorldPlazaDayNightCycleConstants.ts`       |
| Player health tuning       | `src/client/world/health/domains/definingWorldPlazaEntityHealthConstants.ts` |
| Hunger tuning              | `src/client/world/hunger/domains/definingWorldPlazaHungerConstants.ts`       |
| Stamina tuning             | `src/client/world/domains/definingWorldPlazaRunStaminaConstants.ts`          |
| Wildlife behavior numbers  | `src/client/world/wildlife/domains/definingWildlifeSpeciesRegistry.ts`       |
| Meat / disease on eat      | `src/client/world/wildlife/domains/definingWildlifeMeatRegistry.ts`          |
| Item enhancements / enchantments | `src/client/world/inventory/domains/definingWorldPlazaInventoryEnchantmentRegistry.ts` (`family`) |
| Tutorial player copy       | `src/client/components/home/domains/definingPlazaTutorialConstants.ts`       |
| Mechanics UI (home screen) | `src/client/components/home/domains/definingPlazaMechanicsConstants.ts`      |

**Time scale:** 1 in-game day = **40 real minutes** (`DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS`). All clients share phase from UTC epoch anchor; no server clock sync needed for day/night.

---

## 1. Time and day/night

**Gameplay docs:** [day-night](../gameplay/mechanics/day-night/), [in-game-time](../gameplay/shared/in-game-time.md)

**What happens**

- Sunrise phase **0.2**, sunset **0.82**; midnight darkness curve exponent **2.4**.
- Night applies **−8°C** ambient cooling (`definingWorldPlazaTemperatureConstants.ts`).
- Night drives screen darkness, shadow length, emissive campfire boost, frozen surface water (cold climates), and wildlife sleep windows.
- 1 in-game hour = cycle duration / 24; used for disease incubation and symptom delays.

**Key files**

- `definingWorldPlazaDayNightCycleConstants.ts`
- `resolvingWorldPlazaDayNightCycleSample.ts`
- `checkingWorldPlazaWaterIsFrozenAtTileIndex.ts`

**Tune**

- Day length / twilight feel → day/night constants
- Wildlife sleep timing → `resolvingWildlifeShouldSleepAtCyclePhase.ts`, `definingWildlifeSleepScheduleConstants.ts`

---

## 2. Movement and stamina

**Gameplay docs:** [movement-stamina](../gameplay/mechanics/movement-stamina/)

**What happens**

- Hold pointer **150ms** to upgrade walk to run.
- Sprint burst: walk→**75%** of walk→run gap in **1s**, then last **25%** in **3s** (full run at **4s**; `DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_*`).
- Exhaustion fade: from **20%** stamina to **0**, sprint speed lerps toward walk (`DEFINING_WORLD_PLAZA_RUN_STAMINA_EXHAUSTION_FADE_START_RATIO`).
- Run clip fps scales with current/full run speed (`resolvingWorldPlazaRunAnimationSpeedScale`).
- Full stamina bar drains in **12.8s** running; refills in **4.5s** resting.
- Jump costs **6.25%** stamina standing, **8.75%** run jump; roll = **3×** jump cost (~**18.75%**).
- After full empty: **2s** regen delay; action spend pauses regen **600ms**.
- Fatigue tiers (`fresh` through `collapsed`) gate re-use until bar refills to tier threshold; collapsed needs **15%** before run/jump/roll again.
- Default jump reach: **4** layers above current standing layer.

**Key files**

- `definingWorldPlazaRunStaminaConstants.ts`
- `definingWorldPlazaPlayerStaminaFatigueConstants.ts`
- `definingWorldBuildingWorldLayerConstants.ts` (`WORLD_LAYER_JUMP_HEIGHT_MAX = 4`)
- `resolvingWorldPlazaHungerMovementEffects.ts` (hunger slows sprint at low tiers)

**Tune**

- Sprint economy → run stamina + fatigue constants
- Hunger interaction with movement → hunger constants + movement effects resolver

---

## 2b. Tile gravity wells

**Gameplay docs:** [tile-gravity](../gameplay/mechanics/tile-gravity/)

**What happens**

- Wells accelerate movers toward a tile/point (grid / s²). Walk/run/steering stay additive.
- Defaults: radius **4**, acceleration **1.8**, settle **0.12**, max speed **4.5**.
- Projectile `gravityPull` defaults: radius **8**, acceleration **3.5**, max speed **10**.
- Example archetype `gravity-well-bolt`: launch **5**, gravity **4**, radius **10** (frozen aim).
- Dev chase archetype `gravity-ball`: launch **3.5**, gravity **5.5**, radius **14**, `tracksLiveTarget`.

**Key files**

- `definingWorldPlazaTileGravityWellConstants.ts`
- `computingWorldPlazaTileGravityWellStep.ts`
- `creatingWorldPlazaTileGravityWell.ts`
- `resolvingWorldPlazaProjectileAimPoint.ts`
- `definingWorldPlazaProjectileMovementBehaviorRegistry.ts` (`gravityPull`)

---

## 3. Combat

**Gameplay docs:** [combat](../gameplay/mechanics/combat/)

### Damage roll tiers

Deviation score (σ) maps to tiers in `definingWorldPlazaDamageOutcomeTierRegistry.ts`:

| Tier        | Threshold (σ) | Outcome                    |
| ----------- | ------------- | -------------------------- |
| Fatal       | ≥ +3          | Highest damage band        |
| Lethal      | ≥ +2          |                            |
| Critical    | ≥ +1          |                            |
| Normal      | default       |                            |
| True Strike | forced        | Expected damage, no spread |
| Softened    | ≤ −1          | Reduced                    |
| Blocked     | ≤ −2          | Shield-like outcome        |
| Dodged      | ≤ −3          | No/minimal damage          |

Roll spread: base SD = **20%** of expected damage, min SD **1** (`rollingWorldPlazaDamageEngine.ts`).

Kinds using roll engine (`definingWorldPlazaEntityDamageKindRegistry.ts`): `physical`, `fall`, `potential_damage`, `soulbreak`. Shield absorbs **physical only**.

### Player health baseline

(`definingWorldPlazaEntityHealthConstants.ts`)

- Base max HP **1000**; regen **2 HP/s** after **5s** post-damage
- Below **50%** HP: incoming damage × **0.75**
- Fall: safe for **≤5** layers; **15 HP/layer** beyond
- Lava: **15** instant + **25/s**; climate heat **8/s** above 0.72 temp; cold **6/s** below 0.3
- Respawn invincibility **10s**

### Roll dodge (Girl Sample default avatar)

- Active window: roll progress **15%–75%** of animation
- Physical damage reduction **75%–95%** (peak mid-window); only `physical` kind
- Roll travel **2.25** grid units; chain blocked until roll finishes + **150ms**
- Files: `definingWorldPlazaGirlSampleCombatMotionConstants.ts`, `computingWorldPlazaGirlSampleRollDodgeIncomingDamageMultiplier.ts`

### Melee and projectiles

- Player click-melee wildlife in reach; attack power/speed from character engine
- Player wildlife hits floor at **normal** tier (`minimumOutcomeTier`); soften/block/dodge miss floats skipped on connect (`resolvingWildlifePlayerOutgoingPhysicalDamageOptions.ts`)
- Gray **Miss** float: out-of-reach melee start on wildlife; jump-dodged projectiles on player (`miss` float kind)
- Wildlife melee range **1.1** grid (`definingWildlifeAggroConstants.ts`)
- Example projectile `arrow-straight`: **12** EV physical, **9** grid/s, jump-dodgeable
- Wildlife on-hit player procs: per-species bleed/poison/buff (`resolvingWildlifeSpeciesOnHitPlayerProcs.ts`); flat EV = max(**4**, meleeDamage × **0.25**)
- Turtle shell passive: incoming `block_bias` **1** at spawn; obese turtles **2×** size and **2×** obese HP (`definingWildlifeSpeciesPassiveTraitConstants.ts`)
- Adrenaline Rush: grey/omega wolf restore stamina to full on flee entry (`adrenalineRush` + `applyingWildlifeAdrenalineRushOnFleeEntry.ts`)

### Bleed and poison escalation

- **10** bleeding stacks → hemorrhaging; **5** hemorrhaging → exsanguinating (`definingWorldPlazaEntityBleedStackConstants.ts`)
- Poison front-loaded: **15%** damage in first **50%** of duration, **50%** in final **15%** (`definingWorldPlazaEntityPoisonRampConstants.ts`)

**Tune**

- Crit/dodge cutoffs → tier registry + damage engine
- Roll i-frames → Girl Sample combat motion constants
- New damage source → damage kind registry

---

## 4. Health and incapacitation

**Gameplay docs:** [combat](../gameplay/mechanics/combat/) (incapacitation), [buffs](../gameplay/mechanics/buffs/)

**Sleep** (`definingWorldPlazaEntitySleepConstants.ts`, buff `sleep-debuff`)

- Default **8s**; **physical** damage wakes + **30** bonus wake damage (DoT / cold / fall do not wake)
- Locks movement and actions

**Deep sleep** (buff `deep-sleep-debuff`)

- Default **12s**; `canWakeFromDamage: false` — hits cannot wake until timer ends
- Same incapacitation presentation as sleep; no wake bonus

**Stun** (`definingWorldPlazaEntityStunConstants.ts`)

- Default **4s**; locks movement and actions

**Player death**

- Wildlife in sim radius despawned; threat cleared elsewhere (`clearingWildlifeAreaOnPlayerDeath.ts`)

---

## 5. Temperature and environment

**Gameplay docs:** [environment](../gameplay/mechanics/environment/)

**Comfort and damage** (`definingWorldPlazaTemperatureConstants.ts`)

- No cold damage above **−10°C**; no heat damage at or below **50°C** (base comfort)
- Heat/cold tolerance buffs widen band by **+15°C** each (`heat-tolerance-buff` / `cold-tolerance-buff`)
- Heat DoT: **0.35 HP/s per °C** above comfort; cold: **0.3 HP/s per °C** below
- Resist/weakness multiplier: `(1 − resistance) × (1 + weakness)`; immunity → **0**
- Local sources: lava **920°C**, campfire tile **72°C**, frozen water **−14°C**
- Climate noise **0..1** maps to **−25°C..48°C**
- Night cooling **−8°C**
- HUD °C/°F: Settings **Fahrenheit (°F)** under Auto jump (`managingWorldPlazaTemperatureDisplayUnitStore.ts`); sim stays °C

**Frost movement**

- At or below **0°C** effective: walk/run speed scales linearly to **0** at absolute zero
- Cold-immune characters ignore (`computingWorldPlazaEnvironmentalFrostMovementSpeedMultiplier.ts`)

**Frostbite stacks** ([frostbite](../gameplay/mechanics/frostbite/))

- Each cold tick adds **1 stack per °C below comfort low**; warm recovery requires **local temp above comfort low** (default comfort low **−10°C**)
- Each warm tick removes **1 stack per °C above comfort low** (same 1s interval as cold); e.g. local **59°C** at default comfort low **−10°C** → **−69 stacks/tick**
- Stages at **50 / 100 / 200 / 500 / 750 / 1000**: Chilled → Numb → Frostnip → Hypothermia → Frostbite → Necrotic
- Walk speed and stamina regen linear: **75% slow at 1000 stacks** (`1 - 0.75 × stacks/1000`); frostbite walk slow does not block sprint; tier buffs inherit for stamina max/jump/damage
- Frostnip+: ambient cold DoT **plus** `(stacks × 0.01)%` max HP per tick; Frostbite+ takes **3×** frost damage
- Tunables: `definingWorldPlazaEntityFrostbiteConstants.ts` + stage registry

---

## 6. Hunger and food

**Gameplay docs:** [hunger](../gameplay/mechanics/hunger/), [inventory-food](../gameplay/mechanics/inventory-food/)

**Item metadata:** every item type has required **rarity** (basic→godly); optional tags (Godforge/Unique/Quest Reward), forge level, cost, createdBy; equipment `attackEvModifier` / `defenseEvModifier` (additive or multiplicative). See inventory-food glossary.

**Drain** (`definingWorldPlazaHungerConstants.ts`)

- Idle full drain: **1.5 in-game days** (60 real min)
- Walk × **1.15**, sprint × **2.0**
- Health regen blocked below **30%** hunger

**Tiers** (`resolvingWorldPlazaHungerMovementEffects.ts`)

| Tier     | Ratio  | Effects                                      |
| -------- | ------ | -------------------------------------------- |
| Well fed | ≥75%   | +10% stamina regen                           |
| Content  | 40–75% | Normal                                       |
| Peckish  | 20–40% | +25% stamina drain and jump cost             |
| Hungry   | 5–20%  | −10% speed, +50% jump cost, **no sprint**    |
| Starving | 0–5%   | −20% speed, **no sprint/jump**, health drain |

**Starvation**

- Tick every **2s**; time-to-death from full HP = **2 in-game days** (80 real min)
- Per-tick variance **0.7–1.4×**

**Food restore examples**

- Berries **15%**, apple **25%**, cooked meat **60%** (generic constants)
- Species meat values in meat catalog
- Eat channel **1–10 s** by food/species (`definingWorldPlazaInventoryFoodEatDurationRegistry.ts`); damage, walk, jump, or roll cancels (`checkingWorldPlazaInventoryFoodEatShouldContinue.ts`)
- Ground pickup channel **0.5–10 s** by item weight (`resolvingWorldPlazaGroundItemPickupDurationMs.ts`); leave range cancels

---

## 7. Disease and raw meat

**16 diseases** (`definingWorldPlazaEntityDiseaseRegistry.ts`), scaled by in-game time. Each has a **severity** tier (`mild` → `critical`). Raw meat also carries **per-species intensity** (`definingWildlifeMeatDiseaseIntensityRegistry.ts`) that scales symptom strength and illness duration at contract. Global disease time scale is **1/3** (`DEFINING_WORLD_PLAZA_ENTITY_DISEASE_TIME_SCALE`). Dev tools → Health → Diseases grants any disease at **5×** speed (`DEFINING_WORLD_PLAZA_ENTITY_DISEASE_DEV_PREVIEW_DURATION_SCALE`).

**DDD docs:** [gameplay/mechanics/disease/](../gameplay/mechanics/disease/) (glossary, mechanics, catalog with per-disease code map).

`salmonellosis`, `chronic-wasting`, `trichinellosis`, `mad-cow`, `liver-fluke`, `sleeping-sickness`, `wolf-fever`, `bear-worm`, `toxoplasmosis`, `vibrio-infection`

Examples:

- **Salmonellosis** (chicken): 8h incubation; nausea + delayed toxic poison
- **Liver fluke** (sheep): nausea (−30% move) from onset; stamina sick after **4h** (2× sprint drain, 0.5× regen)
- **Chronic wasting** (deer): prion; confusion waves; **5%** chance even when cooked
- **Mad cow** (beef): prion; delayed potential damage **35** EV
- **Sleeping sickness** (zebra): confusion + sleep waves

Incubation / grant fire times use **world epoch** (`Date.now()`). Fired grant effects (movement, poison, bleed) stamp on **simulation clock** (`performance.now()`) so health ticks can see them.

**Eating pipeline** (`resolvingWorldPlazaInventoryFoodEatEffects.ts`)

- Raw: roll species `rawDiseaseChance`; fallback generic poison/sickness
- Cooked: roll `cookedWellFedBuffId` + residual prion chance where defined
- Food sickness / active disease: hunger restore × **0.5**
- Disease HUD badge tap shows severity + active/upcoming stages

---

## 8. Characters and skills

**Gameplay docs:** [characters](../gameplay/mechanics/characters/)

**Playable avatars** (`registeringWorldPlazaCharacterEngineDefinitions.ts`)

| Skin                   | Notable mechanics                                                         |
| ---------------------- | ------------------------------------------------------------------------- |
| Girl (default)         | 1000 HP, atk **300** EV, def 5; minor-heal + swift-stride                 |
| Husky                  | Faster run (3.2), **cold immune**, +15% hunger drain                      |
| Grizzly                | 1400 HP, atk **300** EV, def 10, slower move; **bleed immune**; heat-ward |
| Penguin                | Smaller, **cold immune**, −15% hunger drain                               |
| Fox Peach / Cat Orange | Faster run, lighter frames                                                |

All skins share melee EV **300** at level 1; player hits on wildlife always roll EV (never flat) and floor at **normal** on connect. Equipped sword attack EV uses `resolvingWorldPlazaEquippedAttackEv` (tier multiplicative modifiers on gold sword = **1.45×**).

**Skills** (`definingWorldPlazaCharacterEngineSkillRegistry.ts`)

| skillId        | Effect                | CD  |
| -------------- | --------------------- | --- |
| `minor-heal`   | **120** HP flat heal  | 8s  |
| `swift-stride` | +20% speed 60s        | 15s |
| `heat-ward`    | Toggles heat immunity | 20s |

---

## 9. Buffs and debuffs (summary)

**Gameplay docs:** [buffs](../gameplay/mechanics/buffs/)

Full registry: `definingWorldPlazaEntityBuffRegistry.ts` (~80 entries). Summarize by category when editing:

- **Combat roll mods**: power, rage, assassin, true strike, exposed/vulnerable/condemned, braced/guarded
- **Damage reduction**: iron/heavy armor (−20/30% EV), half-damage 30s
- **Movement**: swift stride, sprint surge, lead boots, featherweight
- **Temperature**: +25% resist, +25% weakness, heat/cold immunity toggles, heat/cold tolerance (**+15°C** comfort)
- **Food well-fed**: species-specific cooked meat buffs (hearty meal, fleet footed, predator strength, …)
- **Disease symptoms**: nausea, muscle lock, joint lock, roll lock, weakness, stamina sick
- **Incapacitation**: sleep, stun, confusion

Mechanics UI badge guide: `resolvingPlazaMechanicsBuffBadgeGuideEntries.ts`, `resolvingPlazaMechanicsDiseaseBadgeGuideEntries.ts`

---

## 10. Wildlife ecology

**Gameplay docs:** [wildlife](../gameplay/mechanics/wildlife/)

**43 species**, **6 temperaments** (`definingWildlifeSpeciesRegistry.ts`, `definingWildlifeBehaviorTreeRegistry.ts`)

**Difficulty levers:** `definingWildlifeDifficultyLevers.ts` (spawn spacing, density bias, prey/predator weights, temperament toggles, HP/attack scale, aggro/hunt radius multipliers).

**Night-only elites (Omega Wolf):** biome `nightOnly` + sunrise despawn (`despawningWildlifeNightOnlyInstancesDuringDaytime`); killed Omegas skip `pendingRespawns` so they do not recycle 20–26 tiles from the player.

**Bestiary codex:** Guide → Bestiary; sight within **18** grid; study corpses (**60s** body lifetime, **3–10s** Study channel by mass, hides local name + HP/stamina while channeling, **1–3** study points by mass with rising `+N` float); tiers at **1 / 10 / 50 / 100 / 200** studies per species (`definingPlazaBestiaryStudyTier.ts`). Same tiers gate wildlife meat item-detail reveal (0 title-only → 200 full disease/buff %). Explored Biomes **Region details** list spawn-table **Animals** chips (sighted name / `???`). Progress in `managingWorldPlazaBestiaryDiscoveryStore.ts`; Dev Mode can set sighted/studies or unlock/lock all (`definingWorldPlazaDevModeBestiaryUnlockConstants.ts`).

| Temperament        | Behavior (high level)                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| passive / skittish | Flee when hurt; graze when hungry; aggressive (pissed) herbivores warn on territory then fight |
| retaliator         | Territory warnings then combat (boar, bear, **rhino** home **11** / warn **7** / escalate **3.5**; rhino first charge may **bluff** at **50%** stamina if player left home patch) |
| predator           | Hunt prey in **14** grid radius; engage within **6**                                           |
| ambusher           | Short-range ambush patterns                                                                    |
| stalker            | Grey-wolf pack pipeline (section 11)                                                           |

**Aggro** (`definingWildlifeAggroConstants.ts`)

- Threat threshold **1.5** to acquire target
- Pack threat share **45%** on ally damage
- Proximity threat **0.8/s** when starving
- Melee range **1.1** grid

**Food chain**

- Per-species `preyAllowSpeciesIds`, `favoritePreySpeciesIds` (wolf favorite: **sheep**)
- Favorite prey sight radius = hunt radius **14**
- Player hitting favorite prey locks predator revenge **30s** (`definingWildlifeFavoritePreyConstants.ts`)
- Hunters feed on kill **50%** chance for **10s** lock (`DEFINING_WILDLIFE_HUNTER_KILL_FEED_CHANCE`); else meat drops and hunter hunts again
- Meal theft: pickup while animal eating stack → contested channel **2–10s** + hard player aggro until death (`definingWildlifeMealTheftConstants.ts`)
- Ground food scent **12** grid
- Forage-eat UI: ground stack ring fills over the current chew timer (`pendingGroundFoodBite`)

**Sleep**

- Per-species activity: diurnal / nocturnal / crepuscular / cathemeral
- Bell-curve schedule per spawn; waking nearby sleepers on hit
- Player bump on sleeper: **33%** wake once per contact; woken animals flee or attack via sleep-wake startle
- Deep sleep health effect (`canWakeFromDamage: false`) blocks hit/bump/nearby wake until timer ends

**Pack / herd reactions** (`definingWildlifePackConstants.ts`, `definingWildlifeDefendYoungConstants.ts`)

- Passive/skittish herd panic flee **10** grid on ally hit
- Defend young: baby (σ **−2**) hurt → same-species adults (σ **≥0**) attack attacker within pack share radius (default **8**); threat share × **2.5**
- Separation anxiety: young (σ **≤ −1**) run to larger same-species ally when > **4** grid (stop ≤ **2**, search **14**)
- Name tags: size σ prefix pools in `definingWildlifeNameTagConstants.ts` (+1σ only Mama / Dada / Daddy / Mommy); pack alpha forces **Alpha**
- Distance-despawned animals keep `knownAnchorIds` until spawn leaves despawn ring (**36**), so combat flee does not rehydrate clones at the fight site

- Alpha death: flee **18** grid
- Herd panic flee **10** grid on ally hit

---

## 11. Stalk and pack hunts (grey-wolf)

**Gameplay docs:** [wildlife](../gameplay/mechanics/wildlife/) (stalk section in mechanics + catalog)

**Phases:** `idle` → `shadowing` → `retreating` → `regrouping` → `formingUp` → `surrounding` → `attacking` → `fleeing`

Statechart: `definingWildlifeStalkerBehaviourMachine.ts` + `definingWildlifeStalkerBehaviourRegistry.ts`

**Commit rules** (`definingWildlifeStalkConstants.ts`)

| Rule                                                                       | Value                                                  |
| -------------------------------------------------------------------------- | ------------------------------------------------------ |
| Mandatory shadow phase after aggro                                         | **15s**                                                |
| Commit if prey HP low                                                      | **<50%** (force)                                       |
| Commit if prey stamina depleted                                            | **≤2%** (force)                                        |
| Commit if prey standing still                                              | **8s** (force)                                         |
| Commit from pack confidence (1–5+ wolves)                                  | **10% / 22% / 40% / 62% / 88%**                        |
| Pack surround minimum                                                      | **≥3** wolves                                          |
| Confident pack (formingUp early)                                           | **≥5** wolves                                          |
| Attack burst then re-flank (once committed)                                | **4s** → **surrounding**                               |
| Stalk aggro timeout without kill                                           | **120s**                                               |
| Alpha prey pick (mass-weighted)                                            | `1 / √mass`; favorite **1.75×**; **15s** bucket        |
| Pack alpha (sticky largest)                                                | Lock on first election; **Alpha** prefix when revealed |
| Alpha death scatter / regroup                                              | Shared flee **18** grid; re-elect after **8s**         |
| Shared pack prey                                                           | Followers inherit alpha stalk lock                     |
| Damage during stalk: pack abandons hunt                                    | **65%** chance                                         |
| Player rushing shadowing wolf (within **5.5** grid, closing dot **≥0.35**) | **⅓** flee, **⅓** enrage, **⅓** regroup                |

**Grey wolf stamina** (`DEFINING_WILDLIFE_SPECIES_STAMINA`): drain **0.28×**, regen **2.4×**, exhaust exit **22%** (~**16s** sprint, ~**3s** refill).

**Howl rally:** each howl gives every idle wolf within **45** grid a **45%** roll to run to the howl point for up to **25s** (arrive **4** grid); constants in `definingWildlifeWolfVocalizationConstants.ts` (see [wildlife mechanics](../gameplay/mechanics/wildlife/mechanics.md)).

**Fleet prey locomotion** (deer, stag, antilope, oryx, zebra, ostrich): exhaust exit **75%**; raised `maxStaminaRatio`; per-species burst/momentum accel in `definingWildlifeSpeciesAccelerationRegistry.ts` (see [wildlife mechanics](../gameplay/mechanics/wildlife/mechanics.md)).

**Safe-terrain seeking** (deer, stag, antilope, oryx, zebra): flee headings bias toward nearby rivers/cliffs (`definingWildlifeSafeTerrainSeekingConstants.ts`); ostrich excluded.

**Steering curves:** max turn **2.8** rad/s + heading continuity **0.45** (`definingWildlifeSteeringWeights.ts`) so flee/chase arcs instead of left/right flips.

Engine wiring for stalk ticks: [game-engines-reference § Wildlife](./game-engines-reference.md).

---

## 12. Meat, loot, and cooking

**Gameplay docs:** [cooking-campfire](../gameplay/mechanics/cooking-campfire/), [disease](../gameplay/mechanics/disease/) (infection)

**Catalog** (`definingWildlifeMeatRegistry.ts`): all species (registry throws if one is missing)

- Raw/cooked hunger ratios; loot qty **1**
- Cook channel **2.5s–10s** (chicken → bear)
- Raw disease id + chance (**30–45%** typical)
- Cooked well-fed buff + chance (**35–45%**)
- Prion residual on cook: deer **5%**, cow **3%**

**Campfire cooking**

- Requires lit campfire + raw meat in inventory + bag space
- Fuel: **3 min/wood** (1–3 wood), **1 min/wood** (4+); max fuel **20 min** (`src/shared/worldCampfireFuel.ts`)
- Campfire tile warmth **72°C**

---

## 13. World interaction

**Gameplay docs:** [harvest](../gameplay/mechanics/harvest/), [fire](../gameplay/mechanics/fire/), [building](../gameplay/mechanics/building/)

**Harvest / trees** (`definingWorldPlazaTreeChopConstants.ts`)

- **2** wood per layer; **3** layers per swing
- Base swing **500ms** + **75ms** per remaining layer
- Player range **2** tiles Chebyshev; requires axe equipped

**Harvest / rocks** (`definingWorldPlazaRockMineConstants.ts` / `worldRockMine.ts`)

- **2** stone per layer; **3** layers per swing
- Base swing **500ms** + **75ms** per remaining layer
- Player range **2** tiles Chebyshev to boulder footprint center; requires pickaxe equipped
- Depleted rocks remove column mesh and collision

**Harvest / pebbles** (`definingWorldPlazaPebblePickConstants.ts` / `worldPebblePick.ts`)

- **1** stone per pick straight to inventory; fixed **350ms**; range **2**; no tool; fails if bag full; hides floor pebble (`surfaceWorldLayer === null`)

**Fire and campfires**

- Ignite/refuel within **2** tiles
- Flint + wood to light; wood refuel extends burn
- Spreading fire: tick **2s**, base spread chance **0.15** × flammability

**Building and claims** (`definingWorldBuildingPlotConstants.ts`)

- Default: **1** owned plot, **64** tile claims, **5** temporary tiles, **256** blocks/plot
- Other players' plots: min **3** tile buffer
- Build mode **B**, claim mode **C**

**Named realms** ([biome-discovery](../gameplay/mechanics/biome-discovery/))

- Variable-size kingdoms / marches / reaches spanning multiple biomes (weighted Voronoi)
- Place names from `500_village_names.txt`; first visit fades title in **worldNotifications**
- Minimap: thin black lines on realm borders
- Discovery keys persist per storage owner (`world-plaza-discovered-named-realms`)

**Equipment gates**

- Axe for chop, flint for fire (see equipment engine in engines reference)

---

## 14. Multiplayer rules

**Gameplay docs:** [multiplayer](../gameplay/mechanics/multiplayer/)

**Room** (`src/shared/plazaDevvitOnline.ts`)

- Max **3** players per post room
- Position sync POST every **150ms**; poll remotes **400ms**
- Player TTL **5s** in Redis

**What syncs**

- Player motion, health, shields, invincibility, avatar skin
- Projectile spawn events (max **8** per sync)
- Wildlife: leader sim publishes snapshots + damage events; followers consume

**Wildlife leader**

- Lowest lexicographic `userId` runs full sim

**What stays local**

- Hunger/stamina tick (not in sync payload)
- Single-player fire cells when no online room

---

## 15. Tutorials and player-facing copy

**Source of truth:** `definingPlazaTutorialConstants.ts` + `renderingPlazaHowToPlayPanel.tsx`

Tabs: **Movement**, **Combat**, **Realm**, **Survival** — each maps to a mechanic above (stamina bar, roll dodge, plot claims, cook meat, buff badges).

In-world overlay: `definingWorldPlazaTutorialOverlayConstants.ts`, `renderingWorldPlazaTutorialOverlay.tsx`

Home-screen mechanics deep-dive: `definingPlazaMechanicsConstants.ts`, `renderingPlazaMechanicsPanel.tsx`

When changing tutorial text, keep numbers in sync with this doc and the constants files above.

---

## Task → where to start

| Task                           | Start here                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------ |
| Starvation too fast/slow       | `definingWorldPlazaHungerConstants.ts`                                         |
| Sprint lockout after empty bar | `definingWorldPlazaPlayerStaminaFatigueConstants.ts`                           |
| Roll i-frame strength          | `definingWorldPlazaGirlSampleCombatMotionConstants.ts`                         |
| Crit/dodge tier cutoffs        | `definingWorldPlazaDamageOutcomeTierRegistry.ts`                               |
| Raw chicken disease rate       | `definingWildlifeMeatRegistry.ts` (chicken entry)                              |
| Cooked meat buff               | meat catalog `cookedWellFedBuffId` + `definingWorldPlazaEntityBuffRegistry.ts` |
| Wolf pack commit distance      | `definingWildlifeStalkConstants.ts`                                            |
| Wolf favorite prey revenge     | `definingWildlifeFavoritePreyConstants.ts`                                     |
| Species attack DPS             | `definingWildlifeSpeciesRegistry.ts` vitals                                    |
| Night wildlife sleep           | `resolvingWildlifeShouldSleepAtCyclePhase.ts`                                  |
| Frost slow severity            | `definingWorldPlazaTemperatureConstants.ts`                                    |
| Plot claim cap                 | `definingWorldBuildingPlotConstants.ts`                                        |
| Campfire burn duration         | `src/shared/worldCampfireFuel.ts`                                              |
| Multiplayer room size          | `plazaDevvitOnline.ts`                                                         |
| Tutorial cook-meat text        | `definingPlazaTutorialConstants.ts`                                            |
| Engine hook / tick wiring      | [game-engines-reference.md](./game-engines-reference.md)                       |

---

## Cross-links

| This doc (mechanics)             | Engines doc                        |
| -------------------------------- | ---------------------------------- |
| Damage tier σ thresholds         | Damage roll engine implementation  |
| Stalk phase commit rules         | Wildlife sim tick pipeline         |
| Hunger tier effects              | Hunger hook wiring                 |
| Multiplayer leader election rule | Online room hooks + snapshot types |
| Disease symptom debuffs          | Entity health engine + persistence |

---

## Version history

| Version | Date       | Note                                                            |
| ------- | ---------- | --------------------------------------------------------------- |
| 1.0.0   | 2026-07-08 | Initial mechanics map; pairs with game-engines-reference v1.1.0 |
