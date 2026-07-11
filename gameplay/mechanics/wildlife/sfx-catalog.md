# Wildlife SFX catalog (behavior-first)

How plaza animals should sound, mapped to simulation events, source packs, and implementation status.

**Shipped audio today:** **omega-wolf** (`public/creatures/sfx/vocals/werewolf/`), **farm and predator species vocals** (`public/creatures/sfx/vocals/farm-animal/`), **beast stand-ins** (`public/creatures/sfx/vocals/beast/`), **Mixkit wild upgrades** (`public/creatures/sfx/vocals/mixkit-wild/`), and **Pixabay wild clips** (`public/creatures/sfx/vocals/pixabay-wild/`).

**Primary farm pack (user source):** Orange Free Sounds _Farm Animal Sounds_ at
`Projects/reigncraft/1- sounds/Animal Sounds/` (mostly WAV; a few MP3).

**Beast pack (user source):** `Projects/reigncraft/1- sounds/Beasts/Beasts/` (WAV bellows, growls, grunts, roars, warbles, toad croaks).

**Mixkit pack (downloaded):** [Mixkit Animals](https://mixkit.co/free-sound-effects/animals/) ? `Projects/reigncraft/1- sounds/Mixkit/` and `public/creatures/sfx/vocals/mixkit-wild/` (Mixkit License, commercial OK).

**Pixabay pack (user source):** `Projects/reigncraft/1- sounds/Added Animals/` ? `public/creatures/sfx/vocals/pixabay-wild/` (Pixabay License, commercial OK).

**Target ship paths:** `public/creatures/sfx/vocals/farm-animal/`, `public/creatures/sfx/vocals/beast/`, `public/creatures/sfx/vocals/mixkit-wild/`, and `public/creatures/sfx/vocals/pixabay-wild/` (kebab-case filenames after copy + rename).

**Code pattern (match omega-wolf):** `definingWildlife*SfxConstants.ts` ? manifest/resolvers ? `notifyingWildlife*SfxEvent` ? one shared `usingWildlifeSpeciesSfx.ts` hook (species filter inside resolver).

---

## 1. Event taxonomy (what behaviors play sound)

Every species uses a **subset** of these events. Events align with speech contexts in `definingWildlifeSpeechConstants.ts` plus combat hooks already used for omega-wolf.

| Event kind     | When it fires (simulation)                          | Typical volume          | Cooldown notes            |
| -------------- | --------------------------------------------------- | ----------------------- | ------------------------- |
| `idle_ambient` | Sustained neutral / graze (`neutral` speech bucket) | Quiet (0.18?0.28)       | 8?14s per instance        |
| `idle_eating`  | Chewing ground food (`eating` context)              | Quiet                   | 3.5s bucket               |
| `wake`         | Leaves sleep schedule (`wake` context)              | Medium                  | Once per wake             |
| `sleep`        | Enters sleep (optional; most species silent)        | Very quiet              | Rare                      |
| `friendly`     | Docile follow / approach roll (`friendly`)          | Medium                  | 6s+                       |
| `flee_start`   | Intent ? `flee` (first frame)                       | Medium?loud             | 4s min between flees      |
| `flee_mid`     | Sustained flee bucket (optional)                    | Quiet                   | 2s bucket                 |
| `warn`         | Intent ? `territoryWarn`                            | Loud                    | Per warn entry            |
| `stalk`        | Stalker `shadowing` phase ambient                   | Quiet                   | 12s+                      |
| `howl`         | Pack alpha hunt open / forming up (`howl` speech)   | Loud + distance falloff | Wolf howl cooldown (~14s) |
| `chase_call`   | Stalker alpha rush (`stalk` ? `chase`/`attack`)     | Loud                    | Shared with howl family   |
| `attack`       | Attack motion clip start (bite/charge/snap)         | Medium                  | Per swing                 |
| `hit_taken`    | `applyingWildlifeInstancePhysicalDamage`            | Medium                  | 0.8s min                  |
| `death`        | Death tick (future)                                 | Medium                  | Once                      |

**Distance:** species vocals use grid falloff from the player (`computingWildlifeSpeciesSfxEffectiveVolume.ts`). Playback goes through `playingWorldPlazaStarAudioSfx` so Howler group-volume stomps cannot boost a distant clip when a nearby animal reuses the same asset. Active vocals also poll every **100ms** (`DEFINING_WILDLIFE_SPECIES_SFX_SPATIAL_POLL_INTERVAL_MS`) and recompute falloff from the live animal + player positions, so a long moo/howl fades (or stops) when either side moves away mid-clip.

| Event profile                                                         | Full volume (grid) | Max audible (grid)                   | Notes                               |
| --------------------------------------------------------------------- | ------------------ | ------------------------------------ | ----------------------------------- |
| Ambient (`idle_ambient`, `idle_eating`, `sleep`, `friendly`, `stalk`) | 2                  | 6                                    | Same short radius for every species |
| Farm combat (`warn`, `attack`, `hit_taken`, `flee_start`, ?)          | 2.5                | 9                                    | Boar, cow, sheep, etc.              |
| Predator combat                                                       | 2                  | 10                                   | Tiger, lion, wolf warn/attack       |
| Megafauna combat                                                      | 3                  | 12                                   | Rhino, elephant, bison              |
| Long call (`howl`, `chase_call`)                                      | +1 tile vs combat  | farm 11 / predator 14 / megafauna 16 | Howls carry farther than grunts     |

Falloff is quartic after the full-volume radius. Hot pools (`pig_grunt`, `pixabay_tiger_roar`, etc.) get an extra gain trim in `definingWildlifeSpeciesSfxPoolVolumeMultipliers.ts`. Hot individual clips within a pool trim in `definingWildlifeSpeciesSfxClipVolumeMultipliers.ts`. Playback resolves the actual pool and clip before volume so secondary pools (chicken crow) do not inherit the primary pool gain.

**Volume slider:** all wildlife SFX multiply `gettingWorldPlazaSfxVolume()` (Settings ? SFX volume).

---

## 2. Temperament ? event matrix

Which events each temperament should implement. Empty cells = skip (no clip needed).

| Event          | passive | docile | skittish | retaliator | stalker | predator | ambusher |
| -------------- | ------- | ------ | -------- | ---------- | ------- | -------- | -------- |
| `idle_ambient` | ?       | ?      | ?        | ?          | ?       | ?        | ?        |
| `idle_eating`  | ?       | ?      | ?        | ?          | ?       | ?        | ?        |
| `wake`         | ?       | ?      | ?        | ?          | ?       | ?        | ?        |
| `friendly`     | ?       | ?      | ?        | ?          | ?       | ?        | ?        |
| `flee_start`   | ?       | ?      | **?**    | ?          | ?       | ?        | ?        |
| `warn`         | ?       | ?      | ?        | **?**      | **?**   | ?        | ?        |
| `stalk`        | ?       | ?      | ?        | ?          | ?       | ?        | ?        |
| `howl`         | ?       | ?      | ?        | ?          | **?**   | ?        | ?        |
| `chase_call`   | ?       | ?      | ?        | ?          | ?       | ?        | ?        |
| `attack`       | ??      | ?      | ?        | **?**      | **?**   | **?**    | **?**    |
| `hit_taken`    | ?       | ?      | ?        | ?          | ?       | ?        | ?        |

? Chicken only (`aggressiveAttacksOnSight` passive farm exception).

**Retaliator charge (rhino):** map windup start to `warn`, impact frame to `attack` (same clip pool, higher volume on impact).

**Crocodile ambush:** only `attack` + `hit_taken`; optional quiet water idle (future ambient layer, not in farm pack).

---

## 3. Sound pools (Farm Animal pack ? game)

Reuse pools across species; rotate clips per event like omega-wolf.

| Pool id            | Source files (Farm Animal pack)         | Suggested kebab names   | Shared by                                           |
| ------------------ | --------------------------------------- | ----------------------- | --------------------------------------------------- |
| `cow_moo`          | Cow-moo ?5, Cow-sounds                  | `cow-moo-01` ?          | cow, bull, bison, water-buffalo, yak                |
| `sheep_baa`        | Sheep-baa, Sheep-sounds                 | `sheep-baa-01` ?        | sheep, ram, llama, alpaca                           |
| `chicken_cluck`    | Chicken ?4                              | `chicken-cluck-01` ?    | chicken                                             |
| `chicken_crow`     | Rooster ?4                              | `rooster-crow-01` ?     | chicken (dawn idle only)                            |
| `pig_grunt`        | Pig ?3                                  | `pig-grunt-01` ?        | pig, boar                                           |
| `dog_bark`         | Dog-barking ?3                          | `dog-bark-01` ?         | shepherd-dog                                        |
| `cat_meow`         | Cat ?2, House Cat Cries MP3             | `cat-meow-01` ?         | cat-black, cat-white, cat-large                     |
| `horse_whinny`     | Horse-whinny ?2                         | `horse-whinny-01` ?     | brown-horse, work-horse, arabian-horse              |
| `donkey_bray`      | Donkey ?2                               | `donkey-bray-01` ?      | donkey                                              |
| `goat_bleat`       | Goat-sounds                             | `goat-bleat-01` ?       | ram, llama, alpaca (until dedicated)                |
| `elephant_trumpet` | elephant.ogg, Elephant-sound-effect.ogg | `elephant-trumpet-01` ? | elephant, elephant-female, mammoth                  |
| `bear_growl`       | Bear Growl ?3 MP3                       | `bear-growl-01` ?       | brown-bear, polar-bear                              |
| `tiger_growl`      | Tiger Growls MP3 (legacy farm clip)     | `tiger-growl-01` ?      | superseded by `pixabay_tiger_roar` for tiger/jaguar |
| `wolf_howl`        | Wolf Howls 3 MP3                        | `wolf-howl-01` ?        | grey-wolf (not omega; omega keeps Werewolf pack)    |

### Beast pack pools (`public/creatures/sfx/vocals/beast/`)

| Pool id              | Source files (Beasts pack) | Suggested kebab names     | Shared by                                     |
| -------------------- | -------------------------- | ------------------------- | --------------------------------------------- |
| `beast_short_bellow` | ShortBellow ?3             | `beast-short-bellow-01` ? | deer, stag, antilope, oryx                    |
| `beast_bellow`       | Bellow ?6                  | `beast-bellow-01` ?       | zebra, giraffe, hippo (warn); camel idle alt  |
| `beast_grunt`        | Grunt ?5                   | `beast-grunt-01` ?        | camel                                         |
| `beast_growl`        | Growl ?6, SoftGrowl        | `beast-growl-01` ?        | chimp, hippo (attack alt), hyena (attack alt) |
| `beast_soft_growl`   | SoftGrowl, Growl3          | `beast-soft-growl-01` ?   | crocodile (attack/hit)                        |
| `beast_roar`         | Roar, Bellow5              | `beast-roar-01` ?         | rhino, rhino-female (attack alt)              |
| `beast_snort`        | Snort, Sniff_boar ?2       | `beast-snort-01` ?        | rhino, rhino-female (warn)                    |
| `beast_hoot`         | Hooting                    | `beast-hoot-01`           | ostrich                                       |
| `beast_warble`       | Warble                     | `beast-warble-01`         | monkey; hyena (howl/chase alt)                |
| `beast_croak`        | ToadKing_Croak ?3          | `beast-croak-01` ?        | crocodile (attack alt)                        |

**Not shipped from beast pack (extras):** `Beast_Defeated*`, extra long bellows ? death SFX / polish later.

### Mixkit wild pools (`public/creatures/sfx/vocals/mixkit-wild/`)

| Pool id               | Mixkit source (page title)       | Shipped filename(s)   | Species       |
| --------------------- | -------------------------------- | --------------------- | ------------- |
| `mixkit_lion_roar`    | Wild lion roar + growl + purr    | `lion-roar-01` ?      | lion, lioness |
| `mixkit_monkey`       | Monkey screech/grunt/chest       | `monkey-screech-01` ? | monkey, chimp |
| `mixkit_wolf_howl`    | Wolf howling + pack + lone       | `wolf-howl-01` ?      | grey-wolf     |
| `mixkit_bird_screech` | Tropical squeak + exotic screech | `bird-squeak-01` ?    | ostrich       |

**Not in game roster (pack extras):** cricket, dove, goose, guinea fowl, peacock, pigeon ? biome ambience later, not wildlife instance SFX.

### Pixabay wild pools (`public/creatures/sfx/vocals/pixabay-wild/`)

| Pool id                | Source clips (Added Animals pack)       | Shipped filename(s)                      | Species                             |
| ---------------------- | --------------------------------------- | ---------------------------------------- | ----------------------------------- |
| `pixabay_prey`         | deer snort/grunt, fawn bleat, stag call | `deer-snort-01` ? `stag-call-01`         | deer, stag, antilope, oryx          |
| `pixabay_zebra_whinny` | zebra whinny                            | `zebra-whinny-01`                        | zebra                               |
| `pixabay_hyena_laugh`  | hyena laugh ?3                          | `hyena-laugh-01` ?                       | hyena                               |
| `pixabay_tiger_roar`   | tiger growl + loud/light roar (Pixabay) | `tiger-growl-01` ? `tiger-roar-light-01` | tiger, jaguar                       |
| `pixabay_crocodile`    | crocodile hiss, alligator growl         | `crocodile-hiss-01` ?                    | crocodile                           |
| `pixabay_hippo_grunt`  | hippo grunt ?2                          | `hippo-grunt-01` ?                       | hippo                               |
| `pixabay_rhino`        | rhino vocal, rhino snort                | `rhino-vocal-01` ?                       | rhino, rhino-female                 |
| `pixabay_reptile_hiss` | snake hiss ?2                           | `reptile-hiss-01` ?                      | turtle, tortoise (`hit_taken` only) |

**`pixabay_tiger_roar` replay gate:** 5s per instance (`checkingWildlifeSpeciesSfxReplayAllowed.ts`). Stalk favors the light roar; chase, warn, and attack favor the loud roar plus growl rotation.

**External packs already used:**

| Species    | Pack                     | Path                                    |
| ---------- | ------------------------ | --------------------------------------- |
| omega-wolf | Atelier Magicae Werewolf | `public/creatures/sfx/vocals/werewolf/` |

---

## 4. Species checklist (48)

Status key: **WIRED** ? **PARTIAL** (stand-in pool, events fire) ? **MISSING** (no profile / clips)

### passive (farm stock)

| speciesId | Pool(s)                     | Events wired                                   | Status  |
| --------- | --------------------------- | ---------------------------------------------- | ------- |
| cow       | cow_moo                     | idle, eating, flee, warn, attack, hit          | WIRED   |
| sheep     | sheep_baa                   | idle, wake, flee, hit                          | WIRED   |
| chicken   | chicken_cluck, chicken_crow | idle (cluck/crow alt), wake, flee, attack, hit | WIRED   |
| pig       | pig_grunt                   | idle, eating, flee, warn, attack, hit          | WIRED   |
| camel     | beast_grunt, beast_bellow   | idle, flee                                     | PARTIAL |
| turtle    | pixabay_reptile_hiss        | hit                                            | WIRED   |
| tortoise  | pixabay_reptile_hiss        | hit                                            | WIRED   |
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

| speciesId     | Pool(s)              | Events wired            | Status |
| ------------- | -------------------- | ----------------------- | ------ |
| deer          | pixabay_prey         | flee, hit               | WIRED  |
| stag          | pixabay_prey         | flee, hit               | WIRED  |
| zebra         | pixabay_zebra_whinny | flee, hit               | WIRED  |
| antilope      | pixabay_prey         | flee, hit               | WIRED  |
| oryx          | pixabay_prey         | flee, hit               | WIRED  |
| ostrich       | mixkit_bird_screech  | flee, hit               | WIRED  |
| brown-horse   | horse_whinny         | idle, wake, flee        | WIRED  |
| work-horse    | horse_whinny         | idle, wake, flee        | WIRED  |
| arabian-horse | horse_whinny         | idle, wake, flee        | WIRED  |
| donkey        | donkey_bray          | idle, wake, flee        | WIRED  |
| monkey        | mixkit_monkey        | flee, idle, hit         | WIRED  |
| chimp         | mixkit_monkey        | warn, attack, hit, flee | WIRED  |

### retaliator

| speciesId       | Pool(s)             | Events wired                    | Status  |
| --------------- | ------------------- | ------------------------------- | ------- |
| boar            | pig_grunt           | idle, warn, attack, flee, hit   | PARTIAL |
| ram             | goat_bleat          | idle, warn, attack, hit         | PARTIAL |
| yak             | cow_moo             | idle, flee, hit                 | PARTIAL |
| bison           | cow_moo             | idle, warn, flee, hit           | PARTIAL |
| bull            | cow_moo             | idle, warn, attack, flee, hit   | PARTIAL |
| water-buffalo   | cow_moo             | idle, warn, flee, hit           | PARTIAL |
| brown-bear      | bear_growl          | warn, stalk, chase, attack, hit | WIRED   |
| giraffe         | beast_bellow        | warn, attack                    | PARTIAL |
| elephant        | elephant_trumpet    | warn, attack, hit, chase        | WIRED   |
| elephant-female | elephant_trumpet    | warn, attack, hit, chase        | WIRED   |
| rhino           | pixabay_rhino       | warn, attack                    | WIRED   |
| rhino-female    | pixabay_rhino       | warn, attack                    | WIRED   |
| hippo           | pixabay_hippo_grunt | warn, attack                    | WIRED   |
| mammoth         | elephant_trumpet    | warn, attack, hit, chase        | PARTIAL |

### stalker

| speciesId  | Pool(s)             | Events wired                                    | Status    |
| ---------- | ------------------- | ----------------------------------------------- | --------- |
| grey-wolf  | mixkit_wolf_howl    | howl, warn, chase_call, attack, hit             | WIRED     |
| omega-wolf | werewolf pack       | howl, chase_call, territory_warn, attack?3, hit | **WIRED** |
| hyena      | pixabay_hyena_laugh | howl, chase_call, attack, hit                   | WIRED     |

### predator

| speciesId  | Pool(s)            | Events wired                    | Status |
| ---------- | ------------------ | ------------------------------- | ------ |
| lion       | mixkit_lion_roar   | stalk, chase, warn, attack, hit | WIRED  |
| lioness    | mixkit_lion_roar   | stalk, chase, warn, attack, hit | WIRED  |
| polar-bear | bear_growl         | stalk, chase, warn, attack, hit | WIRED  |
| tiger      | pixabay_tiger_roar | stalk, chase, warn, attack, hit | WIRED  |
| jaguar     | pixabay_tiger_roar | stalk, chase, warn, attack, hit | WIRED  |

### ambusher

| speciesId | Pool(s)           | Events wired | Status |
| --------- | ----------------- | ------------ | ------ |
| crocodile | pixabay_crocodile | attack, hit  | WIRED  |

---

## 5. Simulation hook map (where events emit)

| Event                                          | Hook today                                                         | Notes                                              |
| ---------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------- |
| `attack`                                       | `advancingWildlifeSimulationTick.ts`                               | Omega-wolf ? werewolf pack; others ? species bus   |
| `howl` / `chase_call` / `warn`                 | `advancingWildlifeWolfHowlTick.ts`                                 | Omega-wolf werewolf clips; grey-wolf ? species bus |
| `hit_taken`                                    | `applyingWildlifeInstancePhysicalDamage.ts`                        | Player melee only; species profile gate            |
| `flee_start` / `warn` / `chase_call` / `stalk` | `notifyingWildlifeSpeciesSfxOnIntentTransition` in simulation tick | Intent mode edge triggers                          |
| `idle_*` / `friendly` / `wake` / combat speech | `applyingWildlifeSpeechTickWithSpeciesSfx.ts`                      | Fires when speech bubble emits                     |

Notifier: `notifyingWildlifeSpeciesSfxEvent.ts` ? `usingWildlifeSpeciesSfx.ts` (mounted in Pixi scene).

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

### Wave A ? Farm pack (files ready)

- [x] Copy + rename to `public/creatures/sfx/vocals/farm-animal/`
- [x] Shared registry: `definingWildlifeFarmAnimalSfxConstants.ts` (pools above)
- [x] Species ? pool map: `definingWildlifeSpeciesSfxProfileRegistry.ts`
- [x] Single hook: `usingWildlifeSpeciesSfx.ts` + `RenderingWildlifeSpeciesSfx.tsx`
- [x] Wire species: cow, sheep, chicken, pig, dog, cats, horses, donkey

### Wave B ? Predators with partial pack

- [x] grey-wolf (howl via Mixkit wolf pool)
- [x] brown-bear, polar-bear, tiger, lion/lioness (growl pool)
- [x] elephant, mammoth (trumpet pool)

### Wave C ? Dedicated recordings still needed

Priority by player encounter rate:

1. ~~deer, stag (dedicated bleat/snort)~~ ? Pixabay prey pool
2. ~~zebra, antilope, oryx~~ ? Pixabay prey / zebra whinny
3. ~~hyena (real laugh/cackle)~~ ? Pixabay hyena laugh pool
4. lion roar distinction from tiger growl (Mixkit lion pool shipped)
5. ~~crocodile, hippo, rhino~~ ? Pixabay pools
6. monkey, chimp, giraffe, camel (chimp/monkey on Mixkit; camel/giraffe still beast stand-ins)
7. ~~turtle, tortoise (quiet hiss on hit)~~ ? Pixabay reptile hiss pool

### Wave D ? Polish

- [x] Distance falloff per size class (`computingWildlifeSpeciesSfxEffectiveVolume.ts`)
- [x] Wildlife footsteps (short one-shots, shared duration caps with avatar)
- [ ] Activity gating (no idle moo while sleeping; rooster crow at dawn only)
- [ ] Herd flee: one `flee_start` leader + staggered followers

---

## 7. Counts

| Status                       | Species                               |
| ---------------------------- | ------------------------------------- |
| **WIRED**                    | 43 (41 species profiles + omega-wolf) |
| **PARTIAL** (stand-in pool)  | 15 (events fire; dedicated clips TBD) |
| **MISSING** (need new audio) | 0                                     |

**Partial species (beast or farm stand-ins):**
camel, giraffe, mammoth, jaguar, boar, llama, alpaca, yak, bison, bull, water-buffalo, ram

---

## 8. Code files (shipped)

| File                                              | Role                                           |
| ------------------------------------------------- | ---------------------------------------------- |
| `definingWildlifeSpeciesSfxProfileRegistry.ts`    | speciesId ? pool ids + enabled events          |
| `definingWildlifeFarmAnimalSfxConstants.ts`       | farm clip catalog + volumes + falloff          |
| `definingWildlifeBeastSfxConstants.ts`            | beast clip catalog + pool rotation             |
| `definingWildlifeMixkitWildSfxConstants.ts`       | Mixkit clip catalog + pool rotation            |
| `definingWildlifePixabayWildSfxConstants.ts`      | Pixabay clip catalog + pool rotation           |
| `definingWildlifeSpeciesSfxClipTypes.ts`          | union clip/pool ids                            |
| `buildingWildlifeFarmAnimalStarAudioManifest.ts`  | full-catalog preload manifest                  |
| `buildingWildlifeBootSpeciesStarAudioManifest.ts` | boot-biome roster preload (blocks loading bar) |
| `notifyingWildlifeSpeciesSfxEvent.ts`             | event bus                                      |
| `notifyingWildlifeSpeciesSfxFromSimulation.ts`    | speech + intent bridge                         |
| `applyingWildlifeSpeechTickWithSpeciesSfx.ts`     | speech tick wrapper                            |
| `resolvingWildlifeSpeciesSfxClipId.ts`            | event + pool ? clip rotation                   |
| `computingWildlifeSpeciesSfxEffectiveVolume.ts`   | distance + SFX slider                          |
| `usingWildlifeSpeciesSfx.ts`                      | star-audio hook                                |
| `renderingWildlifeSpeciesSfx.tsx`                 | scene mount                                    |
| `definingWildlifeFootstepSfxConstants.ts`         | footstep tuning + enable flag                  |
| `usingWildlifeFootsteps.ts`                       | wildlife footstep poll hook                    |
| `renderingWildlifeFootsteps.tsx`                  | footstep scene mount                           |
| `resolvingFilmcowFootstepPlayback.ts`             | shared short-one-shot + duration helpers       |

Keep omega-wolf on its Werewolf pack until a deliberate merge; grey-wolf uses `mixkit_wolf_howl`, not omega clips.

---

## 9. Licensing

Farm Animal Sounds (Orange Free Sounds): commercial use OK with attribution link to [orangefreesounds.com](http://www.orangefreesounds.com/). Do not re-host the pack; ship only renamed clips under `public/creatures/sfx/vocals/farm-animal/`.
