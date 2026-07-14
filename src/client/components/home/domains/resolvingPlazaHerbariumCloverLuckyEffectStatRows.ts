import { computingWorldPlazaInGameDaysToRealMs } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import {
  DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_DECAY_IN_GAME_DAYS,
  DEFINING_WORLD_PLAZA_LUCKY_DISCOVERY_LUCK_MULTIPLIER,
  DEFINING_WORLD_PLAZA_LUCKY_DISEASE_CONTRACTION_MULTIPLIER,
  DEFINING_WORLD_PLAZA_LUCKY_FOOD_BUFF_CHANCE_MULTIPLIER,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryCloverConstants';

export type PlazaHerbariumCloverLuckyEffectStatRow = {
  readonly label: string;
  readonly value: string;
};

/** Full-dossier Lucky charm stat rows (four-leaf clover at 100 combined study). */
export function resolvingPlazaHerbariumCloverLuckyEffectStatRows(): readonly PlazaHerbariumCloverLuckyEffectStatRow[] {
  const decayRealMs = computingWorldPlazaInGameDaysToRealMs(
    DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_DECAY_IN_GAME_DAYS
  );
  const decayMinutes = Math.round(decayRealMs / 60_000);

  return [
    {
      label: 'Disease risk',
      value: `×${DEFINING_WORLD_PLAZA_LUCKY_DISEASE_CONTRACTION_MULTIPLIER} while held`,
    },
    {
      label: 'Damage taken',
      value: 'Skewed toward safer rolls',
    },
    {
      label: 'Damage dealt',
      value: 'Skewed toward stronger rolls',
    },
    {
      label: 'Rare finds',
      value: `×${DEFINING_WORLD_PLAZA_LUCKY_DISCOVERY_LUCK_MULTIPLIER} flowers, ores, biomes`,
    },
    {
      label: 'Food buffs',
      value: `×${DEFINING_WORLD_PLAZA_LUCKY_FOOD_BUFF_CHANCE_MULTIPLIER} well-fed and flower effects`,
    },
    {
      label: 'Charm wear',
      value: `${DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_DECAY_IN_GAME_DAYS} in-game day while held (~${decayMinutes} min real)`,
    },
  ];
}
