import type { DefiningWorldPlazaInventoryEnchantmentKind } from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_BLUEPRINT_FLASH,
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_STEADY_GRIP,
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_SWIFT_CHOP,
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_TIMBER_WHISPER,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentTypeIds';

export type DefiningWorldPlazaInventoryEnchantmentDefinition = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly kind: DefiningWorldPlazaInventoryEnchantmentKind;
  readonly badgeLabel: string;
  readonly useButtonLabel?: string;
  readonly cooldownMs?: number;
  /** Passive harvest speed bonus while equipped. */
  readonly passiveHarvestSpeedMultiplier?: number;
  /** Harvest speed multiplier applied on the next chop when armed. */
  readonly armedHarvestSpeedMultiplier?: number;
  /** Toast shown when an active enchantment is armed. */
  readonly armedToastMessage?: string;
  /** Toast shown when an active enchantment is on cooldown. */
  readonly cooldownToastMessage?: string;
};

export const DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_DEFINITIONS: readonly DefiningWorldPlazaInventoryEnchantmentDefinition[] =
  [
    {
      id: DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_TIMBER_WHISPER,
      name: 'Timber Whisper',
      description: 'Trees yield a little extra wood.',
      kind: 'passive',
      badgeLabel: 'Timber Whisper',
    },
    {
      id: DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_SWIFT_CHOP,
      name: 'Swift Chop',
      description: 'Arm your next tree chop to finish faster.',
      kind: 'active',
      badgeLabel: 'Swift Chop',
      useButtonLabel: 'Use Swift Chop',
      cooldownMs: 30_000,
      armedHarvestSpeedMultiplier: 2,
      armedToastMessage: 'Swift Chop armed. Next chop is faster.',
      cooldownToastMessage: 'Swift Chop is recharging.',
    },
    {
      id: DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_STEADY_GRIP,
      name: 'Steady Grip',
      description: 'Tools wear down a little more slowly.',
      kind: 'passive',
      badgeLabel: 'Steady Grip',
    },
    {
      id: DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_BLUEPRINT_FLASH,
      name: 'Blueprint Flash',
      description: 'Pulse the build tool for a quick placement boost.',
      kind: 'active',
      badgeLabel: 'Blueprint Flash',
      useButtonLabel: 'Use Blueprint Flash',
      cooldownMs: 45_000,
      armedToastMessage: 'Blueprint Flash ready for your next placement.',
      cooldownToastMessage: 'Blueprint Flash is recharging.',
    },
  ];

const DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_DEFINITION_BY_ID = new Map(
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_DEFINITIONS.map((definition) => [
    definition.id,
    definition,
  ])
);

/**
 * Resolves one enchantment definition by id.
 */
export function resolvingWorldPlazaInventoryEnchantmentDefinition(
  enchantmentId: string
): DefiningWorldPlazaInventoryEnchantmentDefinition | null {
  return (
    DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_DEFINITION_BY_ID.get(
      enchantmentId
    ) ?? null
  );
}
