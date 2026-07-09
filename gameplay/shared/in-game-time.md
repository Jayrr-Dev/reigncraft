# In-game time (shared kernel)

Cross-cutting value used by disease incubation, day/night, hunger drain, and wildlife schedules.

|                  |            |
| ---------------- | ---------- |
| **Version**      | 1.0.0      |
| **Last updated** | 2026-07-08 |

## Player-facing scale

| In-game unit | Real time |
| ------------ | --------- |
| 1 hour | ~2.5 minutes |
| 1 day | 40 minutes |

**Source:** `DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS` in `src/client/world/domains/definingWorldPlazaDayNightCycleConstants.ts`

**Converter:** `src/client/world/domains/computingWorldPlazaInGameDurationMs.ts`

## Wall clock vs simulation time

| Model | Used for |
| ----- | -------- |
| **World epoch** (`Date.now()`) | Disease incubation, symptom grants, save-slot illness persistence |
| **Day/night phase** (UTC epoch anchor) | Shared global cycle; no server sync |
| **Frame / tick time** | Combat, stamina, hunger drain during active play |

## Contexts that depend on this kernel

- [Disease](../mechanics/disease/) — incubation and grant delays authored in in-game hours/days
- [Day/night](../mechanics/day-night/) — full cycle duration
- [Hunger](../mechanics/hunger/) — drain rates in in-game days
- [Wildlife](../mechanics/wildlife/) — sleep schedules tied to cycle phase

## Tune

Change day length: `definingWorldPlazaDayNightCycleConstants.ts`. All `computingWorldPlazaInGameHoursToRealMs` / `computingWorldPlazaInGameDaysToRealMs` callers inherit the new scale.
