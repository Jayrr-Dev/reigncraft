# Characters glossary (ubiquitous language)

Terms used consistently across code, docs, and player-facing copy for the Plaza characters bounded context.

## Core concepts

| Term | Meaning |
| ---- | ------- |
| **Skin id** | Avatar identifier string (`girl-sample`, `husky`, `grizzly`, …). Matches `characterId` for player skins. |
| **Character definition** | Declarative `DefiningWorldPlazaCharacterEngineDefinition` block: vitals, stats, locomotion, immunities, skills. |
| **Display name** | Player-facing label (`Girl`, `Husky`, `Orange Cat`). |
| **Derived stats** | Effective numbers after level scaling via `computingWorldPlazaCharacterEngineDerivedStats`. |
| **Size scale** | Sprite/collision multiplier (**1** = normal). Affects shadow, lava cover, hit radius. |

## Vitals

| Term | Meaning |
| ---- | ------- |
| **Base max health** | Starting HP ceiling before temporary bonuses. Seeded into entity health state. |
| **Health regen per second** | Passive HP/s; defaults to **2** from health constants if omitted. |
| **Effective max health** | `baseMaxHealth + healthPerLevel × (level − 1)`. All skins start at level **1** today. |
| **Attack power** | Base melee expected damage input before defense and damage rolls. |
| **Attack speed** | Multiplier on baseline melee strip timing (**1** = default). |
| **Defense** | Flat subtraction layer in incoming damage pipeline. |

## Locomotion

| Term | Meaning |
| ---- | ------- |
| **Walk speed** | Grid units per second; default **2** when omitted. |
| **Run speed** | Grid units per second; default **3** when omitted. |
| **Jump distance scale** | Horizontal jump reach multiplier (**1** default). |
| **Allowed motion kinds** | `idle`, `walk`, `run`, `jump` for all current skins. |
| **Grid speed** | Isometric tile-speed measure shared with wildlife ([wildlife](../wildlife/)). |

## Metabolism

| Term | Meaning |
| ---- | ------- |
| **Hunger drain multiplier** | Scales idle/walk/sprint hunger drain (**1** = normal). |
| **Cold immunity** | Ignores cold damage and frost movement slow. |
| **Heat immunity** | Ignores heat damage (toggle via Heat Ward skill or spawn flag). |
| **Bleed immunity** | Bleed stacks and pools do not apply. |
| **Lava walkable** | Derived from `lava` immunity; can stand on lava tiles without instant damage. |

## Skills

| Term | Meaning |
| ---- | ------- |
| **Skill id** | Stable key (`minor-heal`, `swift-stride`, `heat-ward`). |
| **Cooldown** | Wall-clock ms before reuse. |
| **Skill effect** | Typed payload: `heal`, `apply_buff`, or `damage_roll`. |
| **Skill bar slot** | UI binds to character `skillIds` order at spawn. |

## Immunities (spawn-time)

| Immunity | Blocks |
| -------- | ------ |
| `cold` | Cold climate DoT, frost movement slow |
| `heat` | Heat climate DoT (spawn flag; Heat Ward toggles buff) |
| `bleed` | Bleed application and escalation |
| `poison` | Poison pool application |
| `fall` | Fall damage |
| `lava` | Lava instant + DoT; enables lava walk |

Current playable skins only use `cold` and `bleed` from this list.

## Level scaling (future-ready)

| Field | Meaning |
| ----- | ------- |
| `level` | Current character level (**1** for all skins today). |
| `healthPerLevel` | Added max HP per level above 1. |
| `attackPerLevel` | Added attack power per level above 1. |
| `defensePerLevel` | Added defense per level above 1. |

## Code prefixes (project convention)

| Prefix | Role in this context |
| ------ | -------------------- |
| `defining*` | Character types, skill registry, skin constants |
| `registering*` | Character definition map |
| `computing*` | Derived stat resolver |
| `applying*` | Skill execution |
| `resolving*` | Definition lookup by skin id |

## Anti-patterns (words to avoid)

| Don't say | Say instead |
| --------- | ----------- |
| "Avatar stats" | **Character definition** or **derived stats** |
| "Class" | **Skin** or **character id** |
| "Passive ability" | **Immunity** (spawn) or **skill** (active cooldown) |
| "DPS" | **Attack power** and **attack speed** separately |
| "Speed buff" | Name the skill (**swift-stride**) or buff id |
