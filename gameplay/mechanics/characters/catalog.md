# Characters catalog

Every playable skin, skill, and exact code touchpoints.

**Source of truth for skins:** `src/client/world/character/domains/registeringWorldPlazaCharacterEngineDefinitions.ts`

**Source of truth for skills:** `src/client/world/character/domains/definingWorldPlazaCharacterEngineSkillRegistry.ts`

**Default speeds when omitted:** walk **2**, run **3** grid/s (`definingWorldPlazaIsometricConstants.ts`)

---

## Summary table (level 1)

| Skin id | Display name | HP | Atk | Def | Atk spd | Walk | Run | Jump scale | Size | Hunger × | Immunities | Skills |
| ------- | ------------ | -- | --- | --- | ------- | ---- | --- | ---------- | ---- | -------- | ---------- | ------ |
| `girl-sample` | Girl | **1000** | **10** | **5** | **1** | **2** | **3** | **1** | **1** | **1** | — | minor-heal, swift-stride |
| `husky` | Husky | **950** | **9** | **6** | **1** | **2** | **3.2** | **1** | **1.05** | **1.15** | cold | minor-heal, swift-stride |
| `golden-retriever` | Golden Retriever | **1000** | **9** | **5** | **1** | **2** | **3** | **1** | **1.05** | **1** | — | minor-heal, swift-stride |
| `grizzly` | Grizzly | **1400** | **14** | **10** | **0.85** | **1.8** | **2.6** | **0.9** | **1.25** | **1.3** | bleed | minor-heal, heat-ward |
| `pinguin` | Penguin | **850** | **7** | **4** | **1.1** | **1.6** | **2.2** | **1** | **0.9** | **0.85** | cold | minor-heal, swift-stride |
| `fox-peach` | Fox Peach | **900** | **11** | **4** | **1** | **2** | **3.4** | **1.1** | **0.95** | **1** | — | minor-heal, swift-stride |
| `cat-orange` | Orange Cat | **880** | **10** | **3** | **1.15** | **2** | **3.5** | **1** | **0.92** | **0.9** | — | minor-heal, swift-stride |

HP regen: all skins use default **2 HP/s** except Grizzly (**2.5 HP/s**).

---

## `girl-sample` — Girl (default)

| Field | Value |
| ----- | ----- |
| **Display name** | Girl |
| **Size scale** | **1** |
| **Base max HP** | **1000** |
| **Health regen** | **2 HP/s** (default) |
| **Attack power** | **10** |
| **Attack speed** | **1** |
| **Defense** | **5** |
| **Walk / run** | **2** / **3** grid/s (defaults) |
| **Jump distance scale** | **1** |
| **Hunger drain multiplier** | **1** |
| **Immunities** | none |
| **Skills** | `minor-heal`, `swift-stride` |
| **Level scaling** | +**50** HP, +**2** atk, +**1** def per level |

**Where added**

| Layer | File | What to edit |
| ----- | ---- | ------------ |
| Definition | `registeringWorldPlazaCharacterEngineDefinitions.ts` | `GIRL_SAMPLE` block |
| Skin constant | `definingWorldPlazaAvatarSkinConstants.ts` | `GIRL_SAMPLE` id |
| Combat motion | `definingWorldPlazaGirlSampleCombatMotionConstants.ts` | roll/melee clips |
| Fallback | `resolvingWorldPlazaCharacterEngineDefinition` | default when id missing |

---

## `husky` — Husky

| Field | Value |
| ----- | ----- |
| **Size scale** | **1.05** |
| **Base max HP** | **950** |
| **Attack power / defense** | **9** / **6** |
| **Run speed** | **3.2** grid/s |
| **Hunger drain multiplier** | **1.15** (+15% drain) |
| **Immunities** | `cold` |
| **Skills** | `minor-heal`, `swift-stride` |
| **Level scaling** | +**45** HP, +**2** atk, +**1** def per level |

**Where added**

| Layer | File | What to edit |
| ----- | ---- | ------------ |
| Definition | `registeringWorldPlazaCharacterEngineDefinitions.ts` | `HUSKY` block |
| Frost ignore | `computingWorldPlazaEnvironmentalFrostMovementSpeedMultiplier.ts` | cold immunity check |

---

## `golden-retriever` — Golden Retriever

| Field | Value |
| ----- | ----- |
| **Size scale** | **1.05** |
| **Base max HP** | **1000** |
| **Attack power / defense** | **9** / **5** |
| **Walk / run** | **2** / **3** grid/s (defaults) |
| **Hunger drain multiplier** | **1** |
| **Immunities** | none |
| **Skills** | `minor-heal`, `swift-stride` |
| **Level scaling** | +**50** HP, +**2** atk, +**1** def per level |

**Where added**

| Layer | File | What to edit |
| ----- | ---- | ------------ |
| Definition | `registeringWorldPlazaCharacterEngineDefinitions.ts` | `GOLDEN_RETRIEVER` block |

---

## `grizzly` — Grizzly

| Field | Value |
| ----- | ----- |
| **Size scale** | **1.25** |
| **Base max HP** | **1400** |
| **Health regen** | **2.5 HP/s** |
| **Attack power / defense** | **14** / **10** |
| **Attack speed** | **0.85** |
| **Walk / run** | **1.8** / **2.6** grid/s |
| **Jump distance scale** | **0.9** |
| **Hunger drain multiplier** | **1.3** (+30% drain) |
| **Immunities** | `bleed` |
| **Skills** | `minor-heal`, `heat-ward` |
| **Level scaling** | +**80** HP, +**3** atk, +**2** def per level |

**Where added**

| Layer | File | What to edit |
| ----- | ---- | ------------ |
| Definition | `registeringWorldPlazaCharacterEngineDefinitions.ts` | `GRIZZLY` block |
| Heat Ward buff | `definingWorldPlazaEntityBuffRegistry.ts` | `heat-immunity-buff` |
| Bleed skip | bleed apply pipeline | immunity predicate |

---

## `pinguin` — Penguin

| Field | Value |
| ----- | ----- |
| **Size scale** | **0.9** |
| **Base max HP** | **850** |
| **Attack power / defense** | **7** / **4** |
| **Attack speed** | **1.1** |
| **Walk / run** | **1.6** / **2.2** grid/s |
| **Hunger drain multiplier** | **0.85** (−15% drain) |
| **Immunities** | `cold` |
| **Skills** | `minor-heal`, `swift-stride` |
| **Level scaling** | +**40** HP, +**1** atk, +**1** def per level |

**Where added**

| Layer | File | What to edit |
| ----- | ---- | ------------ |
| Definition | `registeringWorldPlazaCharacterEngineDefinitions.ts` | `PINGUIN` block |

---

## `fox-peach` — Fox Peach

| Field | Value |
| ----- | ----- |
| **Size scale** | **0.95** |
| **Base max HP** | **900** |
| **Attack power / defense** | **11** / **4** |
| **Run speed** | **3.4** grid/s |
| **Jump distance scale** | **1.1** |
| **Hunger drain multiplier** | **1** |
| **Immunities** | none |
| **Skills** | `minor-heal`, `swift-stride` |
| **Level scaling** | +**45** HP, +**2** atk, +**1** def per level |

**Where added**

| Layer | File | What to edit |
| ----- | ---- | ------------ |
| Definition | `registeringWorldPlazaCharacterEngineDefinitions.ts` | `FOX_PEACH` block |

---

## `cat-orange` — Orange Cat

| Field | Value |
| ----- | ----- |
| **Size scale** | **0.92** |
| **Base max HP** | **880** |
| **Attack power / defense** | **10** / **3** |
| **Attack speed** | **1.15** |
| **Run speed** | **3.5** grid/s |
| **Hunger drain multiplier** | **0.9** (−10% drain) |
| **Immunities** | none |
| **Skills** | `minor-heal`, `swift-stride` |
| **Level scaling** | +**42** HP, +**2** atk, +**1** def per level |

**Where added**

| Layer | File | What to edit |
| ----- | ---- | ------------ |
| Definition | `registeringWorldPlazaCharacterEngineDefinitions.ts` | `CAT_ORANGE` block |

---

## Skills registry

| skillId | Display name | Cooldown | Effect | Buff / heal detail |
| ------- | ------------ | -------- | ------ | ------------------ |
| `minor-heal` | Minor Heal | **8000ms** | `heal` **120** HP | `mdi:heart-plus` |
| `swift-stride` | Swift Stride | **15000ms** | `apply_buff` → `swift-stride-buff` | **+20%** speed, **60s** duration |
| `heat-ward` | Heat Ward | **20000ms** | `apply_buff` → `heat-immunity-buff` | Toggle heat immunity |

**Where added**

| Layer | File | What to edit |
| ----- | ---- | ------------ |
| Skill registry | `definingWorldPlazaCharacterEngineSkillRegistry.ts` | skill block |
| Skill apply | `applyingWorldPlazaCharacterEngineSkill.ts` | effect dispatch |
| Swift stride buff | `definingWorldPlazaEntityBuffRegistry.ts` | `swift-stride-buff` |
| Heat immunity buff | `definingWorldPlazaEntityBuffRegistry.ts` | `heat-immunity-buff` |

---

## Shared code paths (all characters)

| Concern | File |
| ------- | ---- |
| Definition map | `registeringWorldPlazaCharacterEngineDefinitions.ts` |
| Resolve by skin | `resolvingWorldPlazaCharacterEngineDefinitionForSkinId` |
| Derived stats | `computingWorldPlazaCharacterEngineDerivedStats.ts` |
| Skill registry | `definingWorldPlazaCharacterEngineSkillRegistry.ts` |
| Skill execution | `applyingWorldPlazaCharacterEngineSkill.ts` |
| Skin ids | `definingWorldPlazaAvatarSkinConstants.ts` |
| Default speeds | `definingWorldPlazaIsometricConstants.ts` |
| Health init | entity health engine (reads max HP, regen, immunities) |
| Hunger drain | hunger tick (reads `hungerDrainMultiplier`) |

## Checklist: add skin `#8`

1. [ ] Add skin id to `definingWorldPlazaAvatarSkinConstants.ts`
2. [ ] Add `DefiningWorldPlazaCharacterEngineDefinition` block in registry file
3. [ ] Register walk/run/jump animation clips
4. [ ] Add combat motion clips if skin has roll/melee
5. [ ] Wire `skillIds` (existing or new skills + buffs)
6. [ ] Add skin to UI picker
7. [ ] Update this catalog and [glossary.md](./glossary.md)
8. [ ] Sync [memory/game-mechanics-reference.md](../../../memory/game-mechanics-reference.md) section 8 one-liner
