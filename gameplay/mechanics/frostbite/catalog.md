# Frostbite catalog

## Stage registry

Source: `src/client/world/health/domains/definingWorldPlazaEntityFrostbiteStageRegistry.ts`

| Id | minStacks | Buff ids |
| -- | --------- | -------- |
| chilled | 50 | _(none; linear speed only)_ |
| numb | 100 | `frostbite-numb-debuff` |
| frostnip | 200 | `frostbite-frostnip-damage-debuff` |
| hypothermia | 500 | `frostbite-hypothermia-debuff`, `frostbite-hypothermia-damage-debuff` |
| frostbite | 750 | `frostbite-frostbite-debuff`, `frostbite-frostbite-damage-debuff` |
| necrotic | 1000 | `frostbite-necrotic-debuff`, `frostbite-necrotic-immobilize-debuff` |

Linear walk speed: `computingWorldPlazaFrostbiteSpeedMovementMultiplier.ts` (applied as `walk_speed` modifier; sprint unaffected). Linear stamina regen: `computingWorldPlazaFrostbiteStaminaRegenMovementMultiplier.ts`. Sync applies **all reached** rows' `buffIds` plus both linear modifiers. Overlapping stamina max / jump / outgoing-damage modifiers collapse to the harshest value.

## Constants

Source: `src/client/world/health/domains/definingWorldPlazaEntityFrostbiteConstants.ts`

| Constant | Default | Role |
| -------- | ------- | ---- |
| `MAX_STACKS` | 1000 | Cap / Necrotic |
| `MAX_SPEED_SLOW_FRACTION` | 0.75 | Linear walk speed: 75% slow at max stacks (sprint still allowed) |
| `MAX_STAMINA_REGEN_SLOW_FRACTION` | 0.75 | Linear stamina regen: 75% slow at max stacks |
| `STACKS_PER_DEFICIT_CELSIUS` | 1 | Stacks per °C below comfort low, per cold tick |
| `WARM_DECAY_BASE_STACKS_PER_SECOND` | 0.5 | At comfort low |
| `WARM_DECAY_STACKS_PER_SECOND_PER_CELSIUS` | 0.15 | Extra decay when warmer |
| `PERCENT_DAMAGE_BASE` | 0 | Frostnip formula base |
| `PERCENT_DAMAGE_PER_STACK` | 0.01 | % max HP per stack |
| `FROST_DAMAGE_TAKEN_MULTIPLIER` | 3 | Frostbite+ |
| `SLEEP_SPELL_DURATION_*_MS` | 3000–10000 | Hypothermia spells |
| `SLEEP_SPELL_STACK_INTERVAL` | 100 | Every +100 past 500 |
| `NECROTIC_AVATAR_TINT` | `0x7ec8e8` | Icy blue |

## Code touchpoints

| File | Role |
| ---- | ---- |
| `applyingWorldPlazaEntityFrostbiteStack.ts` | Set stacks + sync stage |
| `advancingWorldPlazaEntityFrostbiteTick.ts` | Warm decay + sleep spells |
| `computingWorldPlazaFrostbiteColdTickDamage.ts` | Ambient + percent + double |
| `usingWorldPlazaPlayerHealth.ts` | Cold tick gain + frame advance |
| `renderingWorldPlazaDevModeFrostbiteControls.tsx` | Debug UI |
| `listingWorldPlazaEntityStatusEffectHudRows.ts` | HUD badge |
| `renderingWorldPlazaGirlSampleWalkAvatar.tsx` | Necrotic tint |
|