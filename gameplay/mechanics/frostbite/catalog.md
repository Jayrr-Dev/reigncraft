# Frostbite catalog

## Stage registry

Source: `src/client/world/health/domains/definingWorldPlazaEntityFrostbiteStageRegistry.ts`

| Id          | minStacks | Buff ids                                                              |
| ----------- | --------- | --------------------------------------------------------------------- |
| chilled     | 50        | _(none; linear speed only)_                                           |
| numb        | 100       | `frostbite-numb-debuff`                                               |
| frostnip    | 200       | `frostbite-frostnip-damage-debuff`                                    |
| hypothermia | 500       | `frostbite-hypothermia-debuff`, `frostbite-hypothermia-damage-debuff` |
| frostbite   | 750       | `frostbite-frostbite-debuff`, `frostbite-frostbite-damage-debuff`     |
| necrotic    | 1000      | `frostbite-necrotic-debuff`, `frostbite-necrotic-immobilize-debuff`   |

Linear walk speed: `computingWorldPlazaFrostbiteSpeedMovementMultiplier.ts` (applied as `walk_speed` modifier; sprint unaffected). Linear stamina regen: `computingWorldPlazaFrostbiteStaminaRegenMovementMultiplier.ts`. Sync applies **all reached** rows' `buffIds` plus both linear modifiers. Overlapping stamina max / jump / outgoing-damage modifiers collapse to the harshest value.

## Constants

Source: `src/client/world/health/domains/definingWorldPlazaEntityFrostbiteConstants.ts`

| Constant                                     | Default    | Role                                                                                           |
| -------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------- |
| `MAX_STACKS`                                 | 1000       | Cap / Necrotic                                                                                 |
| `MAX_SPEED_SLOW_FRACTION`                    | 0.75       | Linear walk speed: 75% slow at max stacks (sprint still allowed)                               |
| `MAX_STAMINA_REGEN_SLOW_FRACTION`            | 0.75       | Linear stamina regen: 75% slow at max stacks                                                   |
| `STACKS_PER_DEFICIT_CELSIUS`                 | 1          | Stacks per °C of cold deficit (gain) or warm surplus (loss), per environmental tick            |
| `ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS` | 1000       | Shared cold damage and warm decay tick (`definingWorldPlazaEntityHealthFloatTextConstants.ts`) |
| `PERCENT_DAMAGE_BASE`                        | 0          | Frostnip formula base                                                                          |
| `PERCENT_DAMAGE_PER_STACK`                   | 0.01       | % max HP per stack                                                                             |
| `FROST_DAMAGE_TAKEN_MULTIPLIER`              | 3          | Frostbite+                                                                                     |
| `SLEEP_SPELL_DURATION_*_MS`                  | 3000–10000 | Hypothermia spells                                                                             |
| `SLEEP_SPELL_STACK_INTERVAL`                 | 100        | Every +100 past 500                                                                            |
| `NECROTIC_AVATAR_TINT`                       | `0x7ec8e8` | Icy blue                                                                                       |

## Code touchpoints

| File                                                                 | Role                                                          |
| -------------------------------------------------------------------- | ------------------------------------------------------------- |
| `applyingWorldPlazaEntityFrostbiteStack.ts`                          | Set stacks + sync stage                                       |
| `advancingWorldPlazaEntityFrostbiteTick.ts`                          | Warm decay clock + tick advance; hypothermia sleep spells     |
| `advancingWorldPlazaEntityFrostbiteTick.test.ts`                     | Warm decay clock and sub-comfort regression tests             |
| `computingWorldPlazaFrostbiteColdSeverityStackGainMultiplier.ts`     | Cold deficit → stacks per tick                                |
| `computingWorldPlazaFrostbiteStacksLostFromWarmSurplus.ts`           | Warm surplus → stacks lost per tick                           |
| `computingWorldPlazaFrostbiteWarmDecayStacksPerSecond.ts`            | Per-second view of warm tick loss (HUD/debug)                 |
| `computingWorldPlazaFrostbiteColdTickDamage.ts`                      | Ambient + percent + Frostbite+ multiplier                     |
| `computingWorldPlazaFrostbiteEnvironmentalColdHudDamagePerSecond.ts` | Cold `/s` badge includes Frostnip+ percent                    |
| `computingWorldPlazaEnvironmentalTemperatureHudExposure.ts`          | Resolves cold/heat `/s` HUD exposure                          |
| `usingWorldPlazaPlayerHealth.ts`                                     | Cold tick gain + frame advance                                |
| `renderingWorldPlazaDevModeFrostbiteControls.tsx`                    | Dev tools Player / Frostbite view (stage jump, clear, ±nudge) |
| `listingWorldPlazaEntityStatusEffectHudRows.ts`                      | Frostbite stack badge + cold `/s` row                         |
| `renderingWorldPlazaGirlSampleWalkAvatar.tsx`                        | Necrotic tint                                                 |

|
