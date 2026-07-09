# Frostbite catalog

## Stage registry

Source: `src/client/world/health/domains/definingWorldPlazaEntityFrostbiteStageRegistry.ts`

| Id | minStacks | Buff ids |
| -- | --------- | -------- |
| chilled | 50 | `frostbite-chilled-debuff` |
| numb | 100 | `frostbite-numb-debuff` |
| frostnip | 200 | `frostbite-frostnip-debuff`, `frostbite-frostnip-damage-debuff` |
| hypothermia | 500 | `frostbite-hypothermia-debuff`, `frostbite-hypothermia-damage-debuff` |
| frostbite | 750 | `frostbite-frostbite-debuff`, `frostbite-frostbite-damage-debuff` |
| necrotic | 1000 | `frostbite-necrotic-debuff`, `frostbite-necrotic-immobilize-debuff` |

## Constants

Source: `src/client/world/health/domains/definingWorldPlazaEntityFrostbiteConstants.ts`

| Constant | Default | Role |
| -------- | ------- | ---- |
| `MAX_STACKS` | 1000 | Cap / Necrotic |
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