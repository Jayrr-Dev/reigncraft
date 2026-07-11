# Wildlife catalog

Every registered species, combat profile, prey rules, on-hit procs, sleep schedule, and stalk eligibility.

**Source of truth for species:** `src/client/world/wildlife/domains/definingWildlifeSpeciesRegistry.ts`

**Source of truth for on-hit procs:** `src/client/world/wildlife/domains/definingWildlifeSpeciesOnHitEffectRegistry.ts`

**Player-facing bestiary copy:** `src/client/components/home/domains/definingPlazaBestiaryGuideConstants.ts` (sight + studied summaries, optional Apostle flavor at **200** studies).

**Bestiary discovery progress:** `src/client/world/domains/managingWorldPlazaBestiaryDiscoveryStore.ts` (`sighted` + `studyCounts`; player sight/Study writers + dev unlock/lock helpers). Storage I/O: `readingWorldPlazaBestiaryDiscoveryFromStorage.ts` / `writingWorldPlazaBestiaryDiscoveryToStorage.ts`. Dev presets: `definingWorldPlazaDevModeBestiaryUnlockConstants.ts`. Corpse Study: `definingWildlifeCorpseStudyConstants.ts` + `computingWildlifeCorpseStudyPoints.ts` (**1–3** points by mass).

**Global difficulty levers:** `src/client/world/wildlife/domains/definingWildlifeDifficultyLevers.ts` (spawn density, predator toggles, combat multipliers). Applied at spawn via `resolvingWildlifeSpawnEntriesForDifficulty.ts`.

**Dev QA load:** Home → Single Player → **This a dev load**. Compact biome grid + frozen / no-aggro wildlife. Constants: `definingWorldPlazaDevQaLoadConstants.ts`. Store: `managingWorldPlazaDevQaLoadStore.ts`.

## Summary table

Full roster (**48** species). Numbers from `DEFINING_WILDLIFE_SPECIES_REGISTRY` / builders in `definingWildlifeSpeciesRegistry.ts`. Stalk eligible = temperament `stalker` (shared stalker statechart).

| speciesId       | Display            | Temperament | Diet      | Activity    | Aggro radius | Pack share | Stalk eligible |
| --------------- | ------------------ | ----------- | --------- | ----------- | ------------ | ---------- | -------------- |
| cow             | Cow                | passive     | herbivore | diurnal     | 2            | 8          | No             |
| sheep           | Sheep              | passive     | herbivore | diurnal     | 2            | 8          | No             |
| chicken         | Chicken            | passive     | herbivore | diurnal     | 2            | 8          | No             |
| shepherd-dog    | Shepherd Dog       | **docile**  | omnivore  | diurnal     | 4            | 6          | No             |
| cat-black       | Black Cat          | **docile**  | omnivore  | nocturnal   | 3            | 4          | No             |
| cat-white       | White Cat          | **docile**  | omnivore  | crepuscular | 3            | 4          | No             |
| cat-large       | Large Cat          | **docile**  | omnivore  | crepuscular | 3            | 4          | No             |
| deer            | Deer               | skittish    | herbivore | crepuscular | 6            | 8          | No             |
| stag            | Stag               | skittish    | herbivore | crepuscular | 6            | 8          | No             |
| pig             | Pig                | passive     | herbivore | diurnal     | 2            | 8          | No             |
| zebra           | Zebra              | skittish    | herbivore | diurnal     | 7            | 8          | No             |
| antilope        | Antilope           | skittish    | herbivore | diurnal     | 7            | 8          | No             |
| oryx            | Oryx               | skittish    | herbivore | diurnal     | 6            | 8          | No             |
| ostrich         | Ostrich            | skittish    | herbivore | diurnal     | 7            | 8          | No             |
| camel           | Camel              | passive     | herbivore | diurnal     | 3            | 8          | No             |
| turtle          | Turtle             | passive     | herbivore | cathemeral  | 2            | 8          | No             |
| tortoise        | Tortoise           | passive     | herbivore | diurnal     | 2            | 8          | No             |
| brown-horse     | Brown Horse        | skittish    | herbivore | diurnal     | 7            | 10         | No             |
| work-horse      | Work Horse         | skittish    | herbivore | diurnal     | 6            | 10         | No             |
| arabian-horse   | Arabian Horse      | skittish    | herbivore | diurnal     | 8            | 10         | No             |
| donkey          | Donkey             | skittish    | herbivore | diurnal     | 5            | 8          | No             |
| ram             | Ram                | retaliator  | herbivore | crepuscular | 5            | 8          | No             |
| llama           | Llama              | passive     | herbivore | diurnal     | 3            | 8          | No             |
| alpaca          | Alpaca             | passive     | herbivore | diurnal     | 3            | 8          | No             |
| yak             | Yak                | retaliator  | herbivore | cathemeral  | 5            | 8          | No             |
| monkey          | Monkey             | skittish    | omnivore  | diurnal     | 6            | 8          | No             |
| chimp           | Chimp              | retaliator  | omnivore  | diurnal     | 5            | 8          | No             |
| boar            | Boar               | retaliator  | omnivore  | crepuscular | 5            | 0          | No             |
| bison           | Bison              | retaliator  | herbivore | cathemeral  | 5            | 10         | No             |
| bull            | Bull               | retaliator  | herbivore | diurnal     | 5            | 8          | No             |
| water-buffalo   | Water Buffalo      | retaliator  | herbivore | diurnal     | 5            | 10         | No             |
| grey-wolf       | Grey Wolf          | stalker     | carnivore | nocturnal   | 8            | 10         | **Yes**        |
| omega-wolf      | Omega Wolf         | stalker     | carnivore | nocturnal   | 10           | 12         | **Yes**        |
| hyena           | Hyena              | stalker     | carnivore | nocturnal   | 8            | 10         | **Yes**        |
| brown-bear      | Brown Bear         | retaliator  | omnivore  | cathemeral  | 6            | 8          | No             |
| polar-bear      | Polar Bear         | predator    | carnivore | cathemeral  | 7            | 8          | No             |
| lion            | Lion               | predator    | carnivore | crepuscular | 9            | 12         | No             |
| lioness         | Lioness            | predator    | carnivore | crepuscular | 9            | 12         | No             |
| tiger           | Tiger              | predator    | carnivore | crepuscular | 9            | 0          | No             |
| jaguar          | Jaguar             | ambusher    | carnivore | nocturnal   | 5            | 0          | No             |
| crocodile       | Crocodile          | ambusher    | carnivore | cathemeral  | 3.5          | 8          | No             |
| giraffe         | Giraffe            | retaliator  | herbivore | diurnal     | 5            | 8          | No             |
| elephant        | Elephant           | retaliator  | herbivore | cathemeral  | 6            | 8          | No             |
| elephant-female | Elephant Matriarch | retaliator  | herbivore | cathemeral  | 6            | 12         | No             |
| rhino           | Rhino              | retaliator  | herbivore | crepuscular | 5            | 8          | No             |
| rhino-female    | Rhino Cow          | retaliator  | herbivore | crepuscular | 5            | 8          | No             |
| hippo           | Hippo              | retaliator  | herbivore | nocturnal   | 6            | 8          | No             |
| mammoth         | Mammoth            | retaliator  | herbivore | cathemeral  | 6            | 8          | No             |

Species without a detailed section below still ship; numbers in the summary table are authoritative until expanded.

Default aggro fields unless overridden: threat/damage **2.5**, decay **0.4/s**, leash **18** grid, target switch margin **1.25**, starving proximity **0.5**.

**Defend young** (default on for all species): when a baby (σ tier **−2**) takes damage, same-species adults (σ tier **≥0**) within `packShareRadiusGrid` attack the attacker. Opt out with `socialBehavior: { defendsYoung: false }`. Constants: `definingWildlifeDefendYoungConstants.ts`.

**Separation anxiety** (default on): young (σ tier **≤ −1**) run to larger same-species allies when farther than **4** grid (comfort **2**, search **14**). Opt out with `socialBehavior: { separationAnxiety: false }`. Constants: `definingWildlifeSeparationAnxietyConstants.ts`.

**Social hunter** (opt-in): forgoes hunt initiation until living area pack size ≥ **3**; seeks packmates (`seekPackmate`) while under strength (search **28**, comfort **3**). Enabled on `grey-wolf` and `omega-wolf` via `socialBehavior: { socialHunter: true }`. Constants: `definingWildlifeSocialHunterConstants.ts`.

---

## passive (livestock)

### `cow`: Cow

| Field              | Value                                                         |
| ------------------ | ------------------------------------------------------------- |
| **Temperament**    | passive                                                       |
| **Diet / tier**    | herbivore, tier 1                                             |
| **Aggro radius**   | 2 grid                                                        |
| **Prey**           | None (herbivore)                                              |
| **On-hit procs**   | None                                                          |
| **Sleep**          | diurnal; bell-curve window (0σ species shift)                 |
| **Stalk eligible** | No                                                            |
| **Loot**           | Raw Beef → [cooking-campfire](../cooking-campfire/catalog.md) |

**Where added**

| Layer         | File                                                  |
| ------------- | ----------------------------------------------------- |
| Species       | `definingWildlifeSpeciesRegistry.ts`                  |
| Meat          | `definingWildlifeMeatRegistry.ts`                     |
| Behavior tree | `definingWildlifeBehaviorTreeRegistry.ts` (`passive`) |

### `sheep`: Sheep

| Field              | Value                             |
| ------------------ | --------------------------------- |
| **Temperament**    | passive                           |
| **Diet / tier**    | herbivore, tier 1                 |
| **Aggro radius**   | 2 grid                            |
| **Prey**           | None; **grey-wolf favorite prey** |
| **On-hit procs**   | None                              |
| **Sleep**          | diurnal                           |
| **Stalk eligible** | No (prey for wolf stalk AI)       |
| **Loot**           | Raw Mutton                        |

### `chicken`: Chicken

| Field                | Value                                       |
| -------------------- | ------------------------------------------- |
| **Temperament**      | passive                                     |
| **Diet / tier**      | herbivore, tier 1                           |
| **Aggro radius**     | 2 grid                                      |
| **Aggression spawn** | `aggressiveAttacksOnSight: true`            |
| **Prey**             | None                                        |
| **On-hit procs**     | None                                        |
| **Sleep**            | diurnal                                     |
| **Stalk eligible**   | No                                          |
| **Loot**             | Raw Chicken Meat                            |
| **Note**             | Aggressive spawn may attack player on sight |

## docile (dogs and cats)

### `shepherd-dog`: Shepherd Dog

| Field               | Value                                                                        |
| ------------------- | ---------------------------------------------------------------------------- |
| **Temperament**     | docile                                                                       |
| **Diet / tier**     | omnivore, tier 1                                                             |
| **Aggro radius**    | 4 grid                                                                       |
| **Aggression**      | Friendliness = aggression level; Betray? label → 2s Betraying.... (no melee) |
| **Approach speech** | Forced **Bark!** / woof bubble on follow or flee react (`friendly` / `flee`) |
| **Prey**            | None (does not open combat on player)                                        |
| **On-hit procs**    | None                                                                         |
| **Sleep**           | diurnal                                                                      |
| **Stalk eligible**  | No                                                                           |
| **Loot**            | Raw Dog Meat                                                                 |
| **Spawn**           | plains / forest / flower_forest (low weight)                                 |

### `cat-black`: Black Cat

| Field               | Value                                           |
| ------------------- | ----------------------------------------------- |
| **Temperament**     | docile                                          |
| **Approach speech** | Forced **Meow!** bubble on follow or flee react |
| **Diet / tier**     | omnivore, tier 1                                |
| **Aggro radius**    | 3 grid                                          |
| **Sleep**           | nocturnal                                       |
| **Loot**            | Raw Cat Meat                                    |
| **Spawn**           | plains / forest / flower_forest (low weight)    |

### `cat-white`: White Cat

| Field               | Value                                           |
| ------------------- | ----------------------------------------------- |
| **Temperament**     | docile                                          |
| **Approach speech** | Forced **Meow!** bubble on follow or flee react |
| **Diet / tier**     | omnivore, tier 1                                |
| **Aggro radius**    | 3 grid                                          |
| **Sleep**           | crepuscular                                     |
| **Loot**            | Raw Cat Meat                                    |
| **Spawn**           | plains / forest / flower_forest (low weight)    |

### `cat-large`: Large Cat

| Field               | Value                                           |
| ------------------- | ----------------------------------------------- |
| **Temperament**     | docile                                          |
| **Approach speech** | Forced **Meow!** bubble on follow or flee react |
| **Diet / tier**     | omnivore, tier 1                                |
| **Aggro radius**    | 3 grid                                          |
| **Sleep**           | crepuscular                                     |
| **Loot**            | Raw Cat Meat                                    |
| **Spawn**           | plains / forest (low weight)                    |

### `turtle`: Turtle

| Field              | Value                                                                        |
| ------------------ | ---------------------------------------------------------------------------- |
| **Temperament**    | passive                                                                      |
| **Diet / tier**    | herbivore, tier 1                                                            |
| **Aggro radius**   | 2 grid                                                                       |
| **Hazards**        | Swamp-safe                                                                   |
| **Prey**           | None                                                                         |
| **On-hit procs**   | None                                                                         |
| **Passive trait**  | Shell: incoming `block_bias` **1**; obese is **2×** size and **2×** obese HP |
| **Sleep**          | cathemeral                                                                   |
| **Stalk eligible** | No                                                                           |
| **Loot**           | Raw Turtle Meat (salmonellosis risk, see [disease](../disease/catalog.md))   |

**Where added**

| Layer         | File                                                  |
| ------------- | ----------------------------------------------------- |
| Species       | `definingWildlifeSpeciesRegistry.ts`                  |
| Passive bias  | `definingWildlifeSpeciesPassiveTraitConstants.ts`     |
| Spawn health  | `creatingWildlifeSpawnHealthState.ts`                 |
| Meat          | `definingWildlifeMeatRegistry.ts`                     |
| Behavior tree | `definingWildlifeBehaviorTreeRegistry.ts` (`passive`) |

### `pig`: Pig

| Field              | Value                           |
| ------------------ | ------------------------------- |
| **Temperament**    | passive                         |
| **Diet / tier**    | herbivore, tier 1               |
| **Aggro radius**   | 2 grid; pack share **8**        |
| **Sleep**          | diurnal                         |
| **Stalk eligible** | No                              |
| **Note**           | Passive farm builder (like cow) |

### `camel`: Camel

| Field              | Value                    |
| ------------------ | ------------------------ |
| **Temperament**    | passive                  |
| **Diet / tier**    | herbivore, tier 1        |
| **Aggro radius**   | 3 grid; pack share **8** |
| **Hazards**        | Heat immune              |
| **Sleep**          | diurnal                  |
| **Stalk eligible** | No                       |

### `tortoise`: Tortoise

| Field              | Value                    |
| ------------------ | ------------------------ |
| **Temperament**    | passive                  |
| **Diet / tier**    | herbivore, tier 1        |
| **Aggro radius**   | 2 grid; pack share **8** |
| **Hazards**        | Heat immune              |
| **Sleep**          | diurnal                  |
| **Stalk eligible** | No                       |

### `llama`: Llama

| Field              | Value                    |
| ------------------ | ------------------------ |
| **Temperament**    | passive                  |
| **Diet / tier**    | herbivore, tier 1        |
| **Aggro radius**   | 3 grid; pack share **8** |
| **Hazards**        | Cold immune              |
| **Sleep**          | diurnal                  |
| **Stalk eligible** | No                       |

### `alpaca`: Alpaca

| Field              | Value                    |
| ------------------ | ------------------------ |
| **Temperament**    | passive                  |
| **Diet / tier**    | herbivore, tier 1        |
| **Aggro radius**   | 3 grid; pack share **8** |
| **Hazards**        | Cold immune              |
| **Sleep**          | diurnal                  |
| **Stalk eligible** | No                       |

---

## skittish (prey)

### `deer`: Deer

| Field              | Value                                                            |
| ------------------ | ---------------------------------------------------------------- |
| **Temperament**    | skittish                                                         |
| **Diet / tier**    | herbivore, tier 1                                                |
| **Aggro radius**   | 6 grid                                                           |
| **Hazards**        | Cold immune                                                      |
| **Prey**           | Wolf/croc explicit allow list                                    |
| **On-hit procs**   | None                                                             |
| **Sleep**          | crepuscular (active dawn/dusk)                                   |
| **Stalk eligible** | No                                                               |
| **Locomotion**     | Run **4.0**; jump 4 / 24px; burst **0.4s**; no momentum          |
| **Safe-terrain**   | **Yes** (seek rivers/cliffs when fleeing)                        |
| **Stamina**        | Max **1.15**; exhaust exit **75%**; drain 0.72× / regen 1.2×     |
| **Loot**           | Raw Deer Meat (prion risk, see [disease](../disease/catalog.md)) |

### `stag`: Stag

| Field            | Value                                                            |
| ---------------- | ---------------------------------------------------------------- |
| **Temperament**  | skittish                                                         |
| **Diet / tier**  | herbivore, tier 1                                                |
| **Locomotion**   | Run **4.1**; jump **4.5** / **26px**; burst 0.8s; +5% / 5s       |
| **Safe-terrain** | **Yes**                                                          |
| **Stamina**      | Max **1.35**; exhaust exit **75%**; drain **0.78×** / regen 1.2× |
| **Theme**        | Heavy deer leaper                                                |

### `antilope`: Antilope

| Field            | Value                                                               |
| ---------------- | ------------------------------------------------------------------- |
| **Temperament**  | skittish                                                            |
| **Diet / tier**  | herbivore, tier 1                                                   |
| **Locomotion**   | Run **4.4**; jump 4.5 / **28px** / **8**; burst 0.6s; **+15%** / 4s |
| **Safe-terrain** | **Yes**                                                             |
| **Stamina**      | Max **1.5**; exhaust exit **75%**; drain 0.7× / regen 1.2×          |
| **Theme**        | Apex runner (pronghorn)                                             |

### `oryx`: Oryx

| Field            | Value                                                        |
| ---------------- | ------------------------------------------------------------ |
| **Temperament**  | skittish                                                     |
| **Diet / tier**  | herbivore, tier 1                                            |
| **Locomotion**   | Run **3.8**; jump 3 / 18px; burst 1.2s; +8% / **8s**         |
| **Safe-terrain** | **Yes**                                                      |
| **Stamina**      | Max **1.7**; exhaust exit **75%**; drain 0.85× / regen 1.05× |
| **Theme**        | Desert diesel endurance                                      |

### `zebra`: Zebra

| Field              | Value                                                            |
| ------------------ | ---------------------------------------------------------------- |
| **Temperament**    | skittish                                                         |
| **Diet / tier**    | herbivore, tier 1                                                |
| **Aggro radius**   | 7 grid                                                           |
| **Hazards**        | Heat immune                                                      |
| **Prey**           | Wolf/croc explicit allow list                                    |
| **On-hit procs**   | None                                                             |
| **Sleep**          | diurnal                                                          |
| **Stalk eligible** | No                                                               |
| **Locomotion**     | Run **4.2**; jump 3.5 / 16px; burst **1.5s**; +12% / 6s          |
| **Safe-terrain**   | **Yes**                                                          |
| **Stamina**        | Max **1.5**; exhaust exit **75%**; drain 0.48× / regen **0.55×** |
| **Loot**           | Raw Zebra Meat                                                   |

### `ostrich`: Ostrich

| Field            | Value                                                       |
| ---------------- | ----------------------------------------------------------- |
| **Temperament**  | skittish                                                    |
| **Diet / tier**  | herbivore, tier 1                                           |
| **Locomotion**   | Run **4.8**; **no jump**; burst 1.0s; +10% / 3s             |
| **Safe-terrain** | No (grounded)                                               |
| **Stamina**      | Max **1.3**; exhaust exit **75%**; drain 0.45× / regen 0.9× |
| **Theme**        | Fastest biped; cannot clear water/ledge gaps                |

### `brown-horse`: Brown Horse

| Field              | Value                     |
| ------------------ | ------------------------- |
| **Temperament**    | skittish                  |
| **Diet / tier**    | herbivore, tier 1         |
| **Aggro radius**   | 7 grid; pack share **10** |
| **Sleep**          | diurnal                   |
| **Stalk eligible** | No                        |

### `work-horse`: Work Horse

| Field              | Value                     |
| ------------------ | ------------------------- |
| **Temperament**    | skittish                  |
| **Diet / tier**    | herbivore, tier 1         |
| **Aggro radius**   | 6 grid; pack share **10** |
| **Sleep**          | diurnal                   |
| **Stalk eligible** | No                        |

### `arabian-horse`: Arabian Horse

| Field              | Value                     |
| ------------------ | ------------------------- |
| **Temperament**    | skittish                  |
| **Diet / tier**    | herbivore, tier 1         |
| **Aggro radius**   | 8 grid; pack share **10** |
| **Hazards**        | Heat immune               |
| **Sleep**          | diurnal                   |
| **Stalk eligible** | No                        |

### `donkey`: Donkey

| Field              | Value                    |
| ------------------ | ------------------------ |
| **Temperament**    | skittish                 |
| **Diet / tier**    | herbivore, tier 1        |
| **Aggro radius**   | 5 grid; pack share **8** |
| **Sleep**          | diurnal                  |
| **Stalk eligible** | No                       |

### `monkey`: Monkey

| Field              | Value                    |
| ------------------ | ------------------------ |
| **Temperament**    | skittish                 |
| **Diet / tier**    | omnivore, tier 1         |
| **Aggro radius**   | 6 grid; pack share **8** |
| **Hazards**        | Heat immune              |
| **Sleep**          | diurnal                  |
| **Stalk eligible** | No                       |

---

## retaliator

### `boar`: Boar

| Field              | Value                                        |
| ------------------ | -------------------------------------------- |
| **Temperament**    | retaliator                                   |
| **Diet / tier**    | omnivore, tier 2                             |
| **Aggro radius**   | 5 grid; **pack share 0** (solitary)          |
| **Territory**      | warn 5 / escalate 2.8 / linger 2.5s          |
| **Prey**           | Trophic/mass hunt when hungry                |
| **On-hit procs**   | bleed `bleeding` **40%** (0.3× damage scale) |
| **Sleep**          | crepuscular                                  |
| **Stalk eligible** | No                                           |
| **Loot**           | Raw Boar Meat                                |

### `rhino` / `rhino-female`: Rhino

| Field              | Value                                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Temperament**    | retaliator                                                                                                  |
| **Diet / tier**    | herbivore                                                                                                   |
| **Aggro radius**   | 5 grid                                                                                                      |
| **Territory**      | home **11** / warn **7** / escalate **3.5** / linger **2.5s** (`DEFINING_WILDLIFE_RHINO_TERRITORY_CONFIG`)  |
| **Charge**         | windup **1400ms**; exit **40%** stamina; dmg × **2.1** / **2.0**                                            |
| **Bluff charge**   | First player charge: abort at **50%** stamina if player left home patch; return to charge origin            |
| **Vitals (base)**  | Male HP **150** / atk **28** / def **12**; female HP **130** / atk **24** / def **10**; interval **1700ms** |
| **Sleep**          | crepuscular                                                                                                 |
| **Hazards**        | Heat immune                                                                                                 |
| **Stalk eligible** | No                                                                                                          |
| **Loot**           | Raw Rhino Meat / Raw Rhino Cow Meat                                                                         |
| **Tune**           | Territory: `definingWildlifeTerritoryConstants.ts`; bluff: `definingWildlifeSpeciesChargeRegistry.ts`       |

### `brown-bear`: Brown Bear

| Field              | Value                                                   |
| ------------------ | ------------------------------------------------------- |
| **Temperament**    | retaliator                                              |
| **Diet / tier**    | omnivore, tier 3                                        |
| **Aggro radius**   | 6 grid                                                  |
| **Territory**      | warn 7 / escalate 3.5 / linger 3s                       |
| **Prey**           | Trophic tier 3 default (tier 1-2 by mass)               |
| **On-hit procs**   | bleed `hemorrhaging` **50%**; `sluggish-debuff` **22%** |
| **Sleep**          | cathemeral (night bucket rolls, 42% base at 0σ)         |
| **Hazards**        | Cold immune                                             |
| **Stalk eligible** | No                                                      |
| **Loot**           | Raw Bear Meat                                           |

### `ram`: Ram

| Field              | Value                    |
| ------------------ | ------------------------ |
| **Temperament**    | retaliator               |
| **Diet / tier**    | herbivore, tier 1        |
| **Aggro radius**   | 5 grid; pack share **8** |
| **Territory**      | boar territory config    |
| **Hazards**        | Cold immune              |
| **Sleep**          | crepuscular              |
| **Stalk eligible** | No                       |

### `yak`: Yak

| Field              | Value                         |
| ------------------ | ----------------------------- |
| **Temperament**    | retaliator                    |
| **Diet / tier**    | herbivore, tier 1             |
| **Aggro radius**   | 5 grid; pack share **8**      |
| **Territory**      | heavy grazer territory config |
| **Hazards**        | Cold immune                   |
| **Sleep**          | cathemeral                    |
| **Stalk eligible** | No                            |

### `chimp`: Chimp

| Field              | Value                    |
| ------------------ | ------------------------ |
| **Temperament**    | retaliator               |
| **Diet / tier**    | omnivore, tier 2         |
| **Aggro radius**   | 5 grid; pack share **8** |
| **Territory**      | boar territory config    |
| **Hazards**        | Heat immune              |
| **Sleep**          | diurnal                  |
| **Stalk eligible** | No                       |

### `bison`: Bison

| Field              | Value                         |
| ------------------ | ----------------------------- |
| **Temperament**    | retaliator                    |
| **Diet / tier**    | herbivore, tier 1             |
| **Aggro radius**   | 5 grid; pack share **10**     |
| **Territory**      | heavy grazer territory config |
| **Hazards**        | Cold immune                   |
| **Sleep**          | cathemeral                    |
| **Stalk eligible** | No                            |

### `bull`: Bull

| Field              | Value                         |
| ------------------ | ----------------------------- |
| **Temperament**    | retaliator                    |
| **Diet / tier**    | herbivore, tier 1             |
| **Aggro radius**   | 5 grid; pack share **8**      |
| **Territory**      | heavy grazer territory config |
| **Sleep**          | diurnal                       |
| **Stalk eligible** | No                            |

### `water-buffalo`: Water Buffalo

| Field              | Value                         |
| ------------------ | ----------------------------- |
| **Temperament**    | retaliator                    |
| **Diet / tier**    | herbivore, tier 1             |
| **Aggro radius**   | 5 grid; pack share **10**     |
| **Territory**      | heavy grazer territory config |
| **Hazards**        | Swamp-safe                    |
| **Sleep**          | diurnal                       |
| **Stalk eligible** | No                            |

### `giraffe`: Giraffe

| Field              | Value                    |
| ------------------ | ------------------------ |
| **Temperament**    | retaliator               |
| **Diet / tier**    | herbivore, tier 1        |
| **Aggro radius**   | 5 grid; pack share **8** |
| **Hazards**        | Heat immune              |
| **Sleep**          | diurnal                  |
| **Stalk eligible** | No                       |

### `elephant`: Elephant

| Field              | Value                      |
| ------------------ | -------------------------- |
| **Temperament**    | retaliator                 |
| **Diet / tier**    | herbivore, tier 1          |
| **Aggro radius**   | 6 grid; pack share **8**   |
| **Territory**      | megafauna territory config |
| **Hazards**        | Heat immune                |
| **Sleep**          | cathemeral                 |
| **Stalk eligible** | No                         |

### `elephant-female`: Elephant Matriarch

| Field              | Value                      |
| ------------------ | -------------------------- |
| **Temperament**    | retaliator                 |
| **Diet / tier**    | herbivore, tier 1          |
| **Aggro radius**   | 6 grid; pack share **12**  |
| **Territory**      | megafauna territory config |
| **Hazards**        | Heat immune                |
| **Sleep**          | cathemeral                 |
| **Stalk eligible** | No                         |

### `hippo`: Hippo

| Field              | Value                      |
| ------------------ | -------------------------- |
| **Temperament**    | retaliator                 |
| **Diet / tier**    | herbivore, tier 1          |
| **Aggro radius**   | 6 grid; pack share **8**   |
| **Territory**      | megafauna territory config |
| **Hazards**        | Swamp-safe; heat immune    |
| **Sleep**          | nocturnal                  |
| **Stalk eligible** | No                         |

### `mammoth`: Mammoth

| Field              | Value                      |
| ------------------ | -------------------------- |
| **Temperament**    | retaliator                 |
| **Diet / tier**    | herbivore, tier 1          |
| **Aggro radius**   | 6 grid; pack share **8**   |
| **Territory**      | megafauna territory config |
| **Hazards**        | Cold immune                |
| **Sleep**          | cathemeral                 |
| **Stalk eligible** | No                         |

---

## stalker

### `grey-wolf`: Grey Wolf

| Field                | Value                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| **Temperament**      | stalker                                                                                           |
| **Diet / tier**      | carnivore, tier 2                                                                                 |
| **Aggro radius**     | 8 grid; **pack share 10**                                                                         |
| **Territory**        | warn 6 / escalate 3 / linger 3s                                                                   |
| **Prey allow**       | deer, zebra, cow, sheep, chicken, boar                                                            |
| **Prey deny**        | grey-wolf                                                                                         |
| **Favorite prey**    | sheep (sight 14 grid)                                                                             |
| **On-hit procs**     | bleed `bleeding` **35%** (0.25× damage scale)                                                     |
| **Sleep**            | nocturnal (sleeps by day)                                                                         |
| **Hazards**          | Heat and cold immune                                                                              |
| **Stalk eligible**   | **Yes** (shared stalker statechart)                                                               |
| **Social hunter**    | **Yes** (min pack **3**; seek packmates while solo)                                               |
| **Stamina**          | Drain **0.28×**, regen **2.4×**, exhaust exit **22%** (~16s sprint, ~3s full refill)              |
| **Passive trait**    | **Adrenaline Rush**: restore stamina to full when entering flee                                   |
| **Loot**             | Raw Wolf Meat (**1**)                                                                             |
| **Name tags**        | Global size-σ pools (see **Name tags** below); locked pack alpha uses **Alpha** when revealed     |
| **Bestiary studied** | Mentions pack howl rally + **Adrenaline Rush** on flee (`definingPlazaBestiaryGuideConstants.ts`) |

**Stalk tuning:** `definingWildlifeStalkConstants.ts`, `definingWildlifeStalkerBehaviourMachine.ts`
**Social hunter:** `definingWildlifeSocialHunterConstants.ts`
**Stamina:** `DEFINING_WILDLIFE_SPECIES_STAMINA` in `definingWildlifeSpeciesRegistry.ts`
**Adrenaline Rush:** `adrenalineRush: true` + `applyingWildlifeAdrenalineRushOnFleeEntry.ts` (`DEFINING_WILDLIFE_ADRENALINE_RUSH_STAMINA_RESTORE_RATIO` **1**)

### `omega-wolf`: Omega Wolf

| Field                | Value                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------- |
| **Temperament**      | stalker                                                                                     |
| **Diet / tier**      | carnivore, tier 3                                                                           |
| **Aggro radius**     | 10 grid; **pack share 12**                                                                  |
| **Territory**        | same warn/escalate as grey-wolf                                                             |
| **Prey deny**        | omega-wolf, grey-wolf                                                                       |
| **Favorite prey**    | sheep                                                                                       |
| **Sleep**            | nocturnal; **`neverSleeps: true`** (no schedule sleep)                                      |
| **Night-only spawn** | Biome `nightOnly`; despawns at sunrise; **no** pending random respawn after kill            |
| **Always alpha**     | **Yes** (`alwaysPackAlpha`)                                                                 |
| **Hazards**          | Heat and cold immune                                                                        |
| **Stalk eligible**   | **Yes**                                                                                     |
| **Social hunter**    | **Yes** (min pack **3**; seeks grey/omega packmates)                                        |
| **Vitals**           | **135** HP, atk **42**, def **9**                                                           |
| **Passive trait**    | **Adrenaline Rush** (same as grey wolf) + siphoning lifesteal                               |
| **Loot**             | Raw Omega Wolf Meat × **2** ([cooking-campfire](../cooking-campfire/catalog.md#omega-wolf)) |
| **Bestiary studied** | Mentions hemorrhage / lifesteal + **Adrenaline Rush** on flee (same Guide constants file)   |

Meat: higher hunger, **50%** wolf-fever on raw; cooked well-fed roll (**50%**) grants Predator Strength + Omega Skew + Omega Siphon. See [cooking-campfire/catalog.md](../cooking-campfire/catalog.md#omega-wolf).

### `hyena`: Hyena

| Field              | Value                                                |
| ------------------ | ---------------------------------------------------- |
| **Temperament**    | stalker                                              |
| **Diet / tier**    | carnivore, tier 2                                    |
| **Aggro radius**   | 8 grid; pack share **10**                            |
| **Territory**      | same warn/escalate as grey-wolf                      |
| **Prey allow**     | antilope, zebra, oryx, ostrich, deer, sheep, chicken |
| **Prey deny**      | hyena                                                |
| **Favorite prey**  | antilope                                             |
| **Sleep**          | nocturnal                                            |
| **Hazards**        | Heat immune                                          |
| **Stalk eligible** | **Yes** (temperament `stalker`)                      |

---

## predator

### `lion`: Lion

| Field              | Value                                                    |
| ------------------ | -------------------------------------------------------- |
| **Temperament**    | predator                                                 |
| **Diet / tier**    | carnivore, tier 3                                        |
| **Aggro radius**   | 9 grid; **pack share 12**                                |
| **Territory**      | warn 8 / escalate 3.2 / linger 2.5s                      |
| **Prey**           | Trophic tier 3 default                                   |
| **On-hit procs**   | bleed `hemorrhaging` **45%**; `exhausted-debuff` **20%** |
| **Sleep**          | crepuscular                                              |
| **Hazards**        | Heat immune                                              |
| **Stalk eligible** | No                                                       |
| **Loot**           | Raw Lion Meat                                            |

### `lioness`: Lioness

| Field              | Value                                             |
| ------------------ | ------------------------------------------------- |
| **Temperament**    | predator                                          |
| **Diet / tier**    | carnivore, tier 3                                 |
| **Aggro radius**   | 9 grid; **pack share 12**                         |
| **Territory**      | Same pride config as lion                         |
| **Prey**           | Trophic tier 3 default                            |
| **On-hit procs**   | bleed `bleeding` **40%**; `winded-debuff` **18%** |
| **Sleep**          | crepuscular                                       |
| **Stalk eligible** | No                                                |
| **Loot**           | Raw Lioness Meat                                  |

### `polar-bear`: Polar Bear

| Field              | Value                       |
| ------------------ | --------------------------- |
| **Temperament**    | predator                    |
| **Diet / tier**    | carnivore, tier 3           |
| **Aggro radius**   | 7 grid; pack share **8**    |
| **Territory**      | brown bear territory config |
| **Prey allow**     | deer, stag, sheep, boar     |
| **Hazards**        | Cold immune                 |
| **Sleep**          | cathemeral                  |
| **Stalk eligible** | No                          |

### `tiger`: Tiger

| Field              | Value                               |
| ------------------ | ----------------------------------- |
| **Temperament**    | predator                            |
| **Diet / tier**    | carnivore, tier 3                   |
| **Aggro radius**   | 9 grid; **pack share 0** (solitary) |
| **Territory**      | lion territory config               |
| **Prey allow**     | boar, pig, deer, monkey, chimp      |
| **Hazards**        | Swamp-safe; heat immune             |
| **Sleep**          | crepuscular                         |
| **Stalk eligible** | No                                  |

---

## ambusher

### `crocodile`: Crocodile

| Field              | Value                                                                             |
| ------------------ | --------------------------------------------------------------------------------- |
| **Temperament**    | ambusher                                                                          |
| **Diet / tier**    | carnivore, tier 3                                                                 |
| **Aggro radius**   | 3.5 grid; **leash 10** grid                                                       |
| **Prey allow**     | deer, zebra, cow, sheep, chicken, boar                                            |
| **On-hit procs**   | bleed `hemorrhaging` **55%**; poison `toxic` **35%**; `heavy-legs-debuff` **30%** |
| **Sleep**          | cathemeral                                                                        |
| **Hazards**        | Swamp water safe; heat immune                                                     |
| **Stalk eligible** | No                                                                                |
| **Loot**           | Raw Crocodile Meat                                                                |
| **Note**           | `idleNearWater` behavior branch when adjacent to water                            |

### `jaguar`: Jaguar

| Field              | Value                                  |
| ------------------ | -------------------------------------- |
| **Temperament**    | ambusher                               |
| **Diet / tier**    | carnivore, tier 3                      |
| **Aggro radius**   | 5 grid; leash **14**; pack share **0** |
| **Prey allow**     | boar, pig, deer, monkey, chimp         |
| **Hazards**        | Swamp-safe; heat immune                |
| **Sleep**          | nocturnal                              |
| **Stalk eligible** | No                                     |

---

## Stalk phase reference (temperament `stalker`)

Any species with `temperamentId: 'stalker'` uses the shared stalker statechart (`grey-wolf`, `omega-wolf`, `hyena`).

| Phase       | Player-visible behavior                                                                 |
| ----------- | --------------------------------------------------------------------------------------- |
| idle        | Pack not committed to a hunt                                                            |
| shadowing   | Trail prey at 6-9.5 grid with calm random-walk legs; **15s** minimum before pack commit |
| retreating  | Back away when player closes on shadowing wolf                                          |
| regrouping  | Pack widens distance after cautious retreat                                             |
| formingUp   | **≥5** wolves line up (**10-15s**) before surround                                      |
| surrounding | **≥3** wolves move to flank slots (2.4-4.4 grid ring)                                   |
| attacking   | Committed melee burst (**4s**); then re-surround / re-flank if prey lives               |
| fleeing     | Hunt abandoned, alpha dead, or damage flee roll                                         |

---

## Shared code paths (all species)

| Concern              | File                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Simulation tick      | `advancingWildlifeSimulationTick.ts`                                                                                            |
| Aggro / threat       | `advancingWildlifeAggroTick.ts`                                                                                                 |
| Behavior tree        | `advancingWildlifeBehaviorTick.ts`                                                                                              |
| Conditions           | `definingWildlifeBehaviorConditionRegistry.ts`                                                                                  |
| Actions              | `definingWildlifeBehaviorActionRegistry.ts`                                                                                     |
| Player melee procs   | `resolvingWildlifeSpeciesOnHitPlayerProcs.ts`                                                                                   |
| Sleep tick           | `advancingWildlifeSleepTick.ts`                                                                                                 |
| Wake nearby          | `wakingWildlifeNearbySleepersFromHit.ts`                                                                                        |
| Herd flee            | `applyingWildlifeHerbivoreHerdFleeResponse.ts`                                                                                  |
| Alpha death          | `applyingWildlifePackAlphaDeathScatter.ts`                                                                                      |
| Meat loot ids        | `definingWildlifeMeatRegistry.ts`                                                                                               |
| Bestiary discovery   | `managingWorldPlazaBestiaryDiscoveryStore.ts`                                                                                   |
| Bestiary sight poll  | `usingWorldPlazaRecordingBestiarySightings.ts`                                                                                  |
| Stamina tick         | `advancingWildlifeStaminaTick.ts`                                                                                               |
| Run acceleration     | `definingWildlifeSpeciesAccelerationRegistry.ts` + `computingWildlifeAcceleratedRunSpeed.ts`                                    |
| Steering curves      | `definingWildlifeSteeringWeights.ts` (`maxTurnRadiansPerSecond`, `headingContinuityBonus`) + `resolvingWildlifeSteeringStep.ts` |
| Instance stamina cap | `resolvingWildlifeInstanceMaxStaminaRatio` in `resolvingWildlifeInstanceCombatPresentation.ts`                                  |
| Sprite presentation  | `definingWildlifeSpritePresentationConstants.ts` + `resolvingWildlifeSpeciesSpritePresentation.ts`                              |
| Ground shadow layout | `computingWildlifeGroundShadowLayout.ts` (render: `renderingWildlifeLayer.tsx`)                                                 |
| Sheet frame heights  | `definingWildlifeSpriteSheetFrameHeightByFolder.ts`                                                                             |

### Sprite presentation / ground-shadow overrides

Default quadruped: `anchorYNormalized` **0.72**, `footYNormalized` **0.88**. Shadow foot nudge scales with instance `sizeScale`.

| speciesId       | Planted feet (anchor = foot) | Notes                                |
| --------------- | ---------------------------- | ------------------------------------ |
| chicken         | **0.65**                     | Tiny body; shadow ellipse × **0.5**  |
| elephant        | **0.68**                     | 128px frame; empty margin under feet |
| elephant-female | **0.68**                     | 118px frame                          |
| mammoth         | **0.68**                     | Same pack layout as elephant         |
| hippo           | **0.68**                     | Megafauna margin                     |
| rhino           | **0.68**                     | Megafauna margin                     |
| rhino-female    | **0.68**                     | Megafauna margin                     |
| giraffe         | **0.68**                     | 124px frame; ~40px empty under feet  |

When adding a tall sheet with empty margin under painted feet: sample Idle Right/Down opaque foot Y, add a presentation override, and set `cancelsAvatarFootNudge: true` in `DEFINING_WILDLIFE_GROUND_SHADOW_SPECIES_OVERRIDES`.

## Name tags (size σ)

**Source of truth:** `definingWildlifeNameTagConstants.ts` (`DEFINING_WILDLIFE_NAME_TAG_TIER_CONFIG`). Resolver: `resolvingWildlifeInstanceNameTagLabel.ts`.

| σ tier | Color     | Prefix pool                                                                                          |
| ------ | --------- | ---------------------------------------------------------------------------------------------------- |
| **−2** | `#f8c8dc` | Baby, Smoll, Lil, Tiny, Cute, Adorable, Wee, Mini, Pint-Sized, Itty-Bitty, Pocket, Precious, Darling |
| **−1** | `#F0FFFF` | Young, Small, Little, Smol, Petite, Runty, Juvenile, Compact, Dainty, Shrimpy, Pint, Teeny           |
| **0**  | `#f1f1f1` | (none)                                                                                               |
| **+1** | `#eed691` | Mama, Dada, Daddy, Mommy                                                                             |
| **+2** | `#debe1f` | Alpha, Giant, Lead, Prime                                                                            |
| **+3** | `#ff6b35` | Legendary, Gody, Hellish, Demon, Mythical                                                            |

Locked pack alpha forces **Alpha** over size/aggression prefixes when the tag is revealed. Species may override pools via `nameTag.tiers`.

## Fleet prey locomotion (quick ref)

| speciesId | Run | Max stamina | Burst | Momentum  | Exhaust exit |
| --------- | --- | ----------- | ----- | --------- | ------------ |
| deer      | 4.0 | 1.15        | 0.4s  | none      | 75%          |
| stag      | 4.1 | 1.35        | 0.8s  | +5% / 5s  | 75%          |
| antilope  | 4.4 | 1.5         | 0.6s  | +15% / 4s | 75%          |
| oryx      | 3.8 | 1.7         | 1.2s  | +8% / 8s  | 75%          |
| zebra     | 4.2 | 1.5         | 1.5s  | +12% / 6s | 75%          |
| ostrich   | 4.8 | 1.3         | 1.0s  | +10% / 3s | 75%          |

Tune in `DEFINING_WILDLIFE_SPECIES_STAMINA` / `DEFINING_WILDLIFE_SPECIES_MOVEMENT` / `DEFINING_WILDLIFE_SPECIES_ACCELERATION`. Narrative table: [mechanics.md](./mechanics.md#fleet-prey-locomotion-identities).

## Checklist: add species `#12`

1. [ ] Add id to `DefiningWildlifeSpeciesId` union
2. [ ] Add descriptor in `definingWildlifeSpeciesRegistry.ts`
3. [ ] Confirm temperament tree exists (or add new tree)
4. [ ] Add on-hit row if the species hurts the player
5. [ ] Add meat row in `definingWildlifeMeatRegistry.ts` if lootable
6. [ ] Wire biome spawn in `definingWildlifeBiomeSpawnTable.ts`
7. [ ] Register animation clips
8. [ ] Optional: stamina multipliers / `maxStaminaRatio` / acceleration row for fleet prey
9. [ ] If the sheet has empty margin under painted feet, add sprite presentation + ground-shadow overrides (see table above)
10. [ ] Update this catalog, [cooking-campfire catalog](../cooking-campfire/catalog.md), and [disease catalog](../disease/catalog.md) if meat-linked
11. [ ] Run `npm run test -- definingWildlifeMeatRegistry`
