# Wildlife SFX catalog (behavior-first)

How plaza animals should sound, mapped to simulation events, source packs, and implementation status.

**Shipped audio today:** **omega-wolf** (`public/sfx/werewolf/`) plus **farm and predator species vocals** (`public/sfx/farm-animal/`, wired in `usingWildlifeSpeciesSfx.ts`).

**Primary farm pack (user source):** Orange Free Sounds _Farm Animal Sounds_ at
`Projects/reigncraft/1- sounds/Animal Sounds/` (mostly WAV; a few MP3).

**Target ship path:** `public/sfx/farm-animal/` (kebab-case filenames after copy + rename).

**Code pattern (match omega-wolf):** `definingWildlife*SfxConstants.ts` → manifest/resolvers → `notifyingWildlife*SfxEvent` → one shared `usingWildlifeSpeciesSfx.ts` hook (species filter inside resolver).

---

## 1. Event taxonomy (what behaviors play sound)

Every species uses a **subset** of these events. Events align with speech contexts in `definingWildlifeSpeechConstants.ts` plus combat hooks already used for omega-wolf.

| Event kind     | When it fires (simulation)                          | Typical volume          | Cooldown notes            |
| -------------- | --------------------------------------------------- | ----------------------- | ------------------------- |
| `idle_ambient` | Sustained neutral / graze (`neutral` speech bucket) | Quiet (0.18–0.28)       | 8–14s per instance        |
| `idle_eating`  | Chewing ground food (`eating` context)              | Quiet                   | 3.5s bucket               |
| `wake`         | Leaves sleep schedule (`wake` context)              | Medium                  | Once per wake             |
| `sleep`        | Enters sleep (optional; most species silent)        | Very quiet              | Rare                      |
| `friendly`     | Docile follow / approach roll (`friendly`)          | Medium                  | 6s+                       |
| `flee_start`   | Intent → `flee` (first frame)                       | Medium–loud             | 4s min between flees      |
| `flee_mid`     | Sustained flee bucket (optional)                    | Quiet                   | 2s bucket                 |
| `warn`         | Intent → `territoryWarn`                            | Loud                    | Per warn entry            |
| `stalk`        | Stalker `shadowing` phase ambient                   | Quiet                   | 12s+                      |
| `howl`         | Pack alpha hunt open / forming up (`howl` speech)   | Loud + distance falloff | Wolf howl cooldown (~14s) |
| `chase_call`   | Stalker alpha rush (`stalk` → `chase`/`attack`)     | Loud                    | Shared with howl family   |
| `attack`       | Attack motion clip start (bite/charge/snap)         | Medium                  | Per swing                 |
| `hit_taken`    | `applyingWildlifeInstancePhysicalDamage`            | Medium                  | 0.8s min                  |
| `death`        | Death tick (future)                                 | Medium                  | Once                      |

**Distance:** predators and megafauna use grid falloff like omega-wolf (`computingWildlifeOmegaWolfSfxEffectiveVolume.ts`). Farm stock uses shorter radius (~12–18 grid). Ambient idle ignores distance or uses very short radius (~8 grid).

**Volume slider:** all wildlife SFX multiply `gettingWorldPlazaSfxVolume()` (Settings → SFX volume).

---

## 2. Temperament → event matrix

Which events each temperament should implement. Empty cells = skip (no clip needed).

| Event          | passive | docile | skittish | retaliator | stalker | predator | ambusher |
| -------------- | ------- | ------ | -------- | ---------- | ------- | -------- | -------- |
| `idle_ambient` | ✓       | ✓      | ·        | ✓          | ·       | ·        | ·        |
| `idle_eating`  | ✓       | ✓      | ·        | ✓          | ·       | ·        | ·        |
| `wake`         | ✓       | ✓      | ✓        | ✓          | ✓       | ✓        | ✓        |
| `friendly`     | ·       | ✓      | ·        | ·          | ·       | ·        | ·        |
| `flee_start`   | ✓       | ✓      | **✓**    | ·          | ✓       | ·        | ·        |
| `warn`         | ·       | ·      | ·        | **✓**      | **✓**   | ✓        | ·        |
| `stalk`        | ·       | ·      | ·        | ·          | ✓       | ·        | ·        |
| `howl`         | ·       | ·      | ·        | ·          | **✓**   | ·        | ·        |
| `chase_call`   | ·       | ·      | ·        | ·          | ✓       | ✓        | ·        |
| `attack`       | ✓¹      | ·      | ·        | **✓**      | **✓**   | **✓**    | **✓**    |
| `hit_taken`    | ✓       | ✓      | ✓        | ✓          | ✓       | ✓        | ✓        |

¹ Chicken only (`aggressiveAttacksOnSight` passive farm exception).

**Retaliator charge (rhino):** map windup start to `warn`, impact frame to `attack` (same clip pool, higher volume on impact).

**Crocodile ambush:** only `attack` + `hit_taken`; optional quiet water idle (future ambient layer, not in farm pack).

---

## 3. Sound pools (Farm Animal pack → game)

Reuse pools across species; rotate clips per event like omega-wolf.

| Pool id            | Source files (Farm Animal pack)         | Suggested kebab names   | Shared by                                        |
| ------------------ | --------------------------------------- | ----------------------- | ------------------------------------------------ |
| `cow_moo`          | Cow-moo ×5, Cow-sounds                  | `cow-moo-01` …          | cow, bull, bison, water-buffalo, yak             |
| `sheep_baa`        | Sheep-baa, Sheep-sounds                 | `sheep-baa-01` …        | sheep, ram, llama, alpaca                        |
| `chicken_cluck`    | Chicken ×4                              | `chicken-cluck-01` …    | chicken                                          |
| `chicken_crow`     | Rooster ×4                              | `rooster-crow-01` …     | chicken (dawn idle only)                         |
| `pig_grunt`        | Pig ×3                                  | `pig-grunt-01` …        | pig, boar                                        |
| `dog_bark`         | Dog-barking ×3                          | `dog-bark-01` …         | shepherd-dog                                     |
| `cat_meow`         | Cat ×2, House Cat Cries MP3             | `cat-meow-01` …         | cat-black, cat-white, cat-large                  |
| `horse_whinny`     | Horse-whinny ×2                         | `horse-whinny-01` …     | brown-horse, work-horse, arabian-horse           |
| `donkey_bray`      | Donkey ×2                               | `donkey-bray-01` …      | donkey                                           |
| `goat_bleat`       | Goat-sounds                             | `goat-bleat-01` …       | ram, llama, alpaca (until dedicated)             |
| `elephant_trumpet` | elephant.wav, Elephant-sound-effect.mp3 | `elephant-trumpet-01` … | elephant, elephant-female, mammoth               |
| `bear_growl`       | Bear Growl ×3 MP3                       | `bear-growl-01` …       | brown-bear, polar-bear                           |
| `tiger_growl`      | Tiger Growls MP3                        | `tiger-growl-01` …      | tiger, jaguar, lion, lioness                     |
| `wolf_howl`        | Wolf Howls 3 MP3                        | `wolf-howl-01` …        | grey-wolf (not omega; omega keeps Werewolf pack) |

**Not in game roster (pack extras):** cricket, dove, goose, guinea fowl, peacock, pigeon → biome ambience later, not wildlife instance SFX.

**External packs already used:**

| Species    | Pack                     | Path                   |
| ---------- | ------------------------ | ---------------------- |
| omega-wolf | Atelier Magicae Werewolf | `public/sfx/werewolf/` |

---

## 4. Species checklist (48)

Status key: **WIRED** · **PARTIAL** (stand-in pool, events fire) · **MISSING** (no profile / clips)

### passive (farm stock)

| speciesId | Pool(s)                     | Events wired                                   | Status  |
| --------- | --------------------------- | ---------------------------------------------- | ------- |
| cow       | cow_moo                     | idle, eating, flee, warn, attack, hit          | WIRED   |
| sheep     | sheep_baa                   | idle, wake, flee, hit                          | WIRED   |
| chicken   | chicken_cluck, chicken_crow | idle (cluck/crow alt), wake, flee, attack, hit | WIRED   |
| pig       | pig_grunt                   | idle, eating, flee, warn, attack, hit          | WIRED   |
| camel     | —                           | idle, flee                                     | MISSING |
| turtle    | —                           | hit only (future)                              | MISSING |
| tortoise  | —                           | hit only                                       | MISSING |
| llama     | goat_bleat                  | idle, warn, flee, hit                          | PARTIAL |
| alpaca    | goat_bleat                  | idle, warn, flee, hit                          | PARTIAL |

### docile

| speciesId    | Pool(s)  | Events wired                    | Status |
| ------------ | -------- | ------------------------------- | ------ |
| shepherd-dog | dog_bark | friendly, flee, hit, chase_call | WIRED  |
| cat-black    | cat_meow | friendly, wake, flee, hit       | WIRED  |
| cat-white    | cat_meow | friendly, wake, flee, hit       | WIRED  |
| cat-large    | cat_meow | friendly, wake, flee, hit       | WIRED  |

### skittish (prey)

| speciesId     | Pool(s)      | Events wired      | Status  |
| ------------- | ------------ | ----------------- | ------- |
| deer          | —            | flee, hit         | MISSING |
| stag          | —            | flee, hit         | MISSING |
| zebra         | —            | flee, hit         | MISSING |
| antilope      | —            | flee, hit         | MISSING |
| oryx          | —            | flee, hit         | MISSING |
| ostrich       | —            | flee, hit         | MISSING |
| brown-horse   | horse_whinny | idle, wake, flee  | WIRED   |
| work-horse    | horse_whinny | idle, wake, flee  | WIRED   |
| arabian-horse | horse_whinny | idle, wake, flee  | WIRED   |
| donkey        | donkey_bray  | idle, wake, flee  | WIRED   |
| monkey        | —            | flee, idle        | MISSING |
| chimp         | —            | warn, attack, hit | MISSING |

### retaliator

| speciesId       | Pool(s)          | Events wired                    | Status  |
| --------------- | ---------------- | ------------------------------- | ------- |
| boar            | pig_grunt        | idle, warn, attack, flee, hit   | PARTIAL |
| ram             | goat_bleat       | idle, warn, attack, hit         | PARTIAL |
| yak             | cow_moo          | idle, flee, hit                 | PARTIAL |
| bison           | cow_moo          | idle, warn, flee, hit           | PARTIAL |
| bull            | cow_moo          | idle, warn, attack, flee, hit   | PARTIAL |
| water-buffalo   | cow_moo          | idle, warn, flee, hit           | PARTIAL |
| brown-bear      | bear_growl       | warn, stalk, chase, attack, hit | WIRED   |
| giraffe         | —                | warn, attack                    | MISSING |
| elephant        | elephant_trumpet | warn, attack, hit, chase        | WIRED   |
| elephant-female | elephant_trumpet | warn, attack, hit, chase        | WIRED   |
| rhino           | —                | warn, attack                    | MISSING |
| rhino-female    | —                | warn, attack                    | MISSING |
| hippo           | —                | warn, attack                    | MISSING |
| mammoth         | elephant_trumpet | warn, attack, hit, chase        | PARTIAL |

### stalker

| speciesId  | Pool(s)       | Events wired                                    | Status    |
| ---------- | ------------- | ----------------------------------------------- | --------- |
| grey-wolf  | wolf_howl     | howl, warn, chase_call, attack, hit             | WIRED     |
| omega-wolf | werewolf pack | howl, chase_call, territory_warn, attack×3, hit | **WIRED** |
| hyena      | —             | howl, chase_call, attack, hit                   | MISSING   |

### predator

| speciesId  | Pool(s)     | Events wired                    | Status  |
| ---------- | ----------- | ------------------------------- | ------- |
| lion       | tiger_growl | stalk, chase, warn, attack, hit | PARTIAL |
| lioness    | tiger_growl | stalk, chase, warn, attack, hit | PARTIAL |
| polar-bear | bear_growl  | stalk, chase, warn, attack, hit | WIRED   |
| tiger      | tiger_growl | stalk, chase, warn, attack, hit | WIRED   |
| jaguar     | tiger_growl | stalk, chase, warn, attack, hit | PARTIAL |

### ambusher

| speciesId | Pool(s) | Events wired | Status  |
| --------- | ------- | ------------ | ------- |
| crocodile | —       | attack, hit  | MISSING |

---

## 5. Simulation hook map (where events emit)

| Event                                          | Hook today                                                         | Notes                                              |
| ---------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------- |
| `attack`                                       | `advancingWildlifeSimulationTick.ts`                               | Omega-wolf → werewolf pack; others → species bus   |
| `howl` / `chase_call` / `warn`                 | `advancingWildlifeWolfHowlTick.ts`                                 | Omega-wolf werewolf clips; grey-wolf → species bus |
| `hit_taken`                                    | `applyingWildlifeInstancePhysicalDamage.ts`                        | Player melee only; species profile gate            |
| `flee_start` / `warn` / `chase_call` / `stalk` | `notifyingWildlifeSpeciesSfxOnIntentTransition` in simulation tick | Intent mode edge triggers                          |
| `idle_*` / `friendly` / `wake` / combat speech | `applyingWildlifeSpeechTickWithSpeciesSfx.ts`                      | Fires when speech bubble emits                     |

Notifier: `notifyingWildlifeSpeciesSfxEvent.ts` → `usingWildlifeSpeciesSfx.ts` (mounted in Pixi scene).

## 5b. Wildlife footstep hook map

| Concern     | Hook / file                                                                                                                 |
| ----------- | --------------------------------------------------------------------------------------------------------------------------- |
| Enable flag | `DEFINING_WILDLIFE_FOOTSTEP_SFX_ENABLED` in `definingWildlifeFootstepSfxConstants.ts`                                       |
| Scene mount | `renderingWildlifeFootsteps.tsx`                                                                                            |
| Poll + play | `usingWildlifeFootsteps.ts` (reads `wildlifeStoreRef`, player position for falloff)                                         |
| Short clips | `resolvingFilmcowFootstepWildlifeClipIdsForSurfaceAndMotion` + duration cap via `resolvingFilmcowFootstepPlaybackDurationS` |
| Shared bus  | `managingWorldPlazaStarAudio.ts` (same acquire/release pattern as harvest impacts)                                          |

---

## 6. Implementation waves (recommended order)

### Wave A — Farm pack (files ready)

- [x] Copy + rename to `public/sfx/farm-animal/`
- [x] Shared registry: `definingWildlifeFarmAnimalSfxConstants.ts` (pools above)
- [x] Species → pool map: `definingWildlifeSpeciesSfxProfileRegistry.ts`
- [x] Single hook: `usingWildlifeSpeciesSfx.ts` + `RenderingWildlifeSpeciesSfx.tsx`
- [x] Wire species: cow, sheep, chicken, pig, dog, cats, horses, donkey

### Wave B — Predators with partial pack

- [x] grey-wolf (howl via farm wolf clip pool)
- [x] brown-bear, polar-bear, tiger, lion/lioness (growl pool)
- [x] elephant, mammoth (trumpet pool)

### Wave C — Missing source (need new recordings)

Priority by player encounter rate:

1. deer, stag (forest flee)
2. zebra, antilope, oryx, ostrich (savanna flee)
3. hyena (stalker laugh/howls)
4. lion roar distinction from tiger growl
5. crocodile, hippo, rhino (swamp/savanna threats)
6. camel, monkey, chimp, giraffe
7. turtle, tortoise (quiet shell/hiss)

### Wave D — Polish

- [x] Distance falloff per size class (`computingWildlifeSpeciesSfxEffectiveVolume.ts`)
- [x] Wildlife footsteps (short one-shots, shared duration caps with avatar)
- [ ] Activity gating (no idle moo while sleeping; rooster crow at dawn only)
- [ ] Herd flee: one `flee_start` leader + staggered followers

---

## 7. Counts

| Status                       | Species                               |
| ---------------------------- | ------------------------------------- |
| **WIRED**                    | 31 (29 species profiles + omega-wolf) |
| **PARTIAL** (stand-in pool)  | 12 (events fire; dedicated clips TBD) |
| **MISSING** (need new audio) | 17                                    |

**Missing species (no profile / clips):**
deer, stag, zebra, antilope, oryx, ostrich, camel, turtle, tortoise, monkey, chimp, giraffe, rhino, rhino-female, hippo, hyena, crocodile

---

## 8. Code files (shipped)

| File                                             | Role                                     |
| ------------------------------------------------ | ---------------------------------------- |
| `definingWildlifeSpeciesSfxProfileRegistry.ts`   | speciesId → pool ids + enabled events    |
| `definingWildlifeFarmAnimalSfxConstants.ts`      | clip catalog + volumes + falloff         |
| `buildingWildlifeFarmAnimalStarAudioManifest.ts` | preload manifest                         |
| `notifyingWildlifeSpeciesSfxEvent.ts`            | event bus                                |
| `notifyingWildlifeSpeciesSfxFromSimulation.ts`   | speech + intent bridge                   |
| `applyingWildlifeSpeechTickWithSpeciesSfx.ts`    | speech tick wrapper                      |
| `resolvingWildlifeSpeciesSfxClipId.ts`           | event + pool → clip rotation             |
| `computingWildlifeSpeciesSfxEffectiveVolume.ts`  | distance + SFX slider                    |
| `usingWildlifeSpeciesSfx.ts`                     | star-audio hook                          |
| `renderingWildlifeSpeciesSfx.tsx`                | scene mount                              |
| `definingWildlifeFootstepSfxConstants.ts`        | footstep tuning + enable flag            |
| `usingWildlifeFootsteps.ts`                      | wildlife footstep poll hook              |
| `renderingWildlifeFootsteps.tsx`                 | footstep scene mount                     |
| `resolvingFilmcowFootstepPlayback.ts`            | shared short-one-shot + duration helpers |

Keep omega-wolf on its Werewolf pack until a deliberate merge; grey-wolf uses `wolf_howl` farm clip, not omega clips.

---

## 9. Licensing

Farm Animal Sounds (Orange Free Sounds): commercial use OK with attribution link to [orangefreesounds.com](http://www.orangefreesounds.com/). Do not re-host the pack; ship only renamed clips under `public/sfx/`.
