# Movement and stamina bounded context (DDD)

|                  |            |
| ---------------- | ---------- |
| **Version**      | 1.0.0      |
| **Last updated** | 2026-07-08 |

Plaza **movement and stamina** is a bounded context in the **Player Locomotion** subdomain. It governs walk-to-run upgrades, sprint drain, jump and roll costs, fatigue lockouts after emptying the bar, and Girl Sample roll dodge i-frames.

## Docs in this folder

| File                           | Purpose                                                              |
| ------------------------------ | -------------------------------------------------------------------- |
| [glossary.md](./glossary.md)   | Ubiquitous language: terms every contributor should use the same way |
| [mechanics.md](./mechanics.md) | Player-facing locomotion loop and stamina pipeline                   |
| [catalog.md](./catalog.md)     | Fatigue tiers, stamina costs, regen delays, roll dodge params        |

## DDD map

### Bounded context

**Plaza Player Locomotion Economy** — stamina ratio tracking, fatigue tier progression, hold-to-run gating, jump/roll spend, and roll dodge damage mitigation for the local player avatar.

Touches **Characters** (per-skin walk/run speed), **Combat** (roll dodge reduces physical damage), **Hunger** (sprint lock and drain multipliers), **Environment** (frost walk/run slow), and **Building** (jump layer reach). Does not own wildlife movement or multiplayer position sync.

### Aggregates

| Aggregate               | Root                                               | Responsibility                                                          |
| ----------------------- | -------------------------------------------------- | ----------------------------------------------------------------------- |
| **Run stamina state**   | `DefiningWorldPlazaRunStaminaState`                | `staminaRatio`, fatigue tier, depletion lockout, regen pause timestamps |
| **Fatigue tier config** | `DefiningWorldPlazaPlayerStaminaFatigueTierConfig` | Per-tier unlock threshold and regen multiplier                          |

Stamina is a **0..1 ratio** so the HUD bar width maps directly. Fatigue tier is player-only; it advances on each full bar empty and resets on a full refill.

### Value objects

- `DefiningWorldPlazaPlayerStaminaFatigueTier` — `fresh | winded | fatigued | spent | collapsed`
- Stamina cost ratios — jump **6.25%**, run jump **8.75%**, roll **18.75%**
- Roll dodge window — progress **15%–75%** of roll animation

### Domain services (pure)

| Service                 | File                                                                                   |
| ----------------------- | -------------------------------------------------------------------------------------- |
| Roll dodge multiplier   | `computingWorldPlazaGirlSampleRollDodgeIncomingDamageMultiplier.ts`                    |
| Jump layer reach        | `computingWorldPlazaPlayerJumpLayerReachMaxFromMultiplier` in building layer constants |
| Hunger movement effects | `resolvingWorldPlazaHungerMovementEffects.ts`                                          |
| Frost movement slow     | `computingWorldPlazaEnvironmentalFrostMovementSpeedMultiplier.ts`                      |

### Application layer

| Use case            | Entry                                     |
| ------------------- | ----------------------------------------- |
| Stamina rAF tick    | run stamina hook in plaza scene           |
| Pointer hold-to-run | input layer + **150ms** threshold         |
| Roll input          | Girl Sample combat motion + stamina spend |
| HUD bar color       | low ratio warning below **30%**           |

### Infrastructure

| Concern         | File                                                        |
| --------------- | ----------------------------------------------------------- |
| Multiplayer     | Stamina **not** synced (`plazaDevvitOnline.ts`); local only |
| Character speed | `computingWorldPlazaCharacterEngineDerivedStats.ts`         |

### Declarative registries (source of truth)

| Registry                 | File                                                   |
| ------------------------ | ------------------------------------------------------ |
| Run stamina              | `definingWorldPlazaRunStaminaConstants.ts`             |
| Fatigue tiers            | `definingWorldPlazaPlayerStaminaFatigueConstants.ts`   |
| Roll dodge / roll motion | `definingWorldPlazaGirlSampleCombatMotionConstants.ts` |
| Jump height              | `definingWorldBuildingWorldLayerConstants.ts`          |
| Default grid speeds      | `definingWorldPlazaIsometricConstants.ts`              |
| Auto jump                | `definingWorldPlazaMobileAutoJumpConstants.ts`         |

## Layer diagram

```mermaid
flowchart TB
  subgraph definitions [Definitions layer]
    RS[definingWorldPlazaRunStaminaConstants]
    FT[definingWorldPlazaPlayerStaminaFatigueConstants]
    RM[definingWorldPlazaGirlSampleCombatMotionConstants]
    JL[definingWorldBuildingWorldLayerConstants]
  end

  subgraph domain [Domain layer]
    RD[computingWorldPlazaGirlSampleRollDodgeIncomingDamageMultiplier]
    HM[resolvingWorldPlazaHungerMovementEffects]
    FR[computingWorldPlazaEnvironmentalFrostMovementSpeedMultiplier]
  end

  subgraph application [Application layer]
    ST[run stamina rAF loop]
    IN[pointer hold-to-run input]
    RL[roll motion + spend]
  end

  RS --> ST
  FT --> ST
  RM --> RL
  RM --> RD
  JL --> RL
  HM --> ST
  FR --> ST
  RD --> combat[combat damage pipeline]
```

## How to tune sprint economy

1. **Drain/refill rates** — edit `DEFINING_WORLD_PLAZA_RUN_STAMINA_*_SECONDS` in `definingWorldPlazaRunStaminaConstants.ts`.
2. **Action costs** — jump and roll ratio constants in the same file.
3. **Fatigue gates** — `useUnlockRatio` per tier in `definingWorldPlazaPlayerStaminaFatigueConstants.ts`.
4. **Roll dodge** — reduction ratios and window in `definingWorldPlazaGirlSampleCombatMotionConstants.ts`.
5. **Cross-context** — hunger tier sprint lock in [hunger](../hunger/); frost slow in [environment](../environment/).

## Related AI references

- Engine wiring: [memory/game-engines-reference.md](../../../memory/game-engines-reference.md) (Player movement hooks)
- Tuning numbers: [memory/game-mechanics-reference.md](../../../memory/game-mechanics-reference.md) (section 2)
- Roll damage mitigation: [combat](../combat/) bounded context
- Per-skin speeds: [characters](../characters/) bounded context
