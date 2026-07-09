# Frostbite mechanics

## Player loop

```mermaid
flowchart TD
  coldTick["environmental_cold tick"] --> gain["stacks += base * coldSeverity"]
  warm["temp at or above comfort low"] --> decay["stacks -= warmDecayRate"]
  gain --> stage["resolve stage from stacks"]
  decay --> stage
  stage --> buffs["sync all reached stage buffs"]
  stage --> hud["frostbite HUD badge"]
  frostnip["Frostnip+"] --> pct["extra percent maxHP on cold tick"]
  frostbiteStage["Frostbite+"] --> dbl["frost damage x3"]
  hypo["Hypothermia+"] --> sleep["sleep spells every +100 stacks"]
```

## Stages

| Stacks | Stage | Tier effects (speed is linear; see below) |
| ------ | ----- | ------- |
| 0–49 | none | — |
| 50 | Chilled | stage label only |
| 100 | Numb | stamina max ×0.80; stamina regen ×0.80 |
| 200 | Frostnip | outgoing damage ×0.85; ambient cold + percent maxHP |
| 500 | Hypothermia | stamina max ×0.50; jump ×0.50; outgoing ×0.75; confusion; sleep spells |
| 750 | Frostbite | cannot jump; frost damage ×3; outgoing ×0.50 |
| 1000 | Necrotic | stun immobilize; heal blocked; icy tint |

**Speed (linear):** `speedMultiplier = 1 - 0.75 × (stacks / 1000)`. At 0 stacks: full speed. At 1000: 75% slower (×0.25). Necrotic immobilize still forces speed 0.

**Inheritance:** every reached tier's non-speed buffs stay active. Overlapping stamina, jump, and outgoing-damage modifiers keep the **harshest** value only. Unique prior effects still apply (example: Numb stamina regen ×0.80 remains at Frostnip).

## Gain and decay

- **Gain:** each cold damage tick adds `deficit°C × STACKS_PER_DEFICIT_CELSIUS` (default 1 stack per °C below comfort low). Example: comfort −10°C at local −20°C → +10 stacks that tick.
- **Decay:** while `local°C ≥ comfortLow`, lose stacks at `BASE + warmth°C × PER_CELSIUS` per second.

## Frostnip damage

On each cold tick at Frostnip+:

```
total = ambientColdTick + (effectiveMaxHealth × (base + stacks × 0.01) / 100)
```

At Frostbite+, both ambient and percent pieces are multiplied by 3.

## HUD

Status badge is icon-only (no stack count). Tap it for the stage name and **inherited** effect list (linear speed line from stacks, harshest line per overlapping stat, plus unique prior-tier effects). Stack numbers stay in the Health → Frostbite debug panel only.

## Debug

Dev panel → Health → Frostbite: jump to each stage, clear, ±10 / ±50.

## Player Guide

N/A for Controls / Biomes / Bestiary. Mechanics Guide: optional one-line cold exposure note later; not required for v1.
