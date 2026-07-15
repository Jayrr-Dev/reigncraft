import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaArmorSlotId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';

/** One equipped armor item in a profile slot. */
export type DefiningWorldPlazaArmorLoadoutSlot = DefiningInventoryItem | null;

/** Profile armor loadout keyed by slot id. */
export type DefiningWorldPlazaArmorLoadoutState = Readonly<
  Record<DefiningWorldPlazaArmorSlotId, DefiningWorldPlazaArmorLoadoutSlot>
>;

export const DEFINING_WORLD_PLAZA_ARMOR_LOADOUT_SLOT_IDS = [
  'helm',
  'arm',
  'body',
  'leg',
  'foot',
  'torso',
  'paw-hooves',
] as const satisfies readonly DefiningWorldPlazaArmorSlotId[];

export function creatingEmptyWorldPlazaArmorLoadoutState(): DefiningWorldPlazaArmorLoadoutState {
  return {
    helm: null,
    arm: null,
    body: null,
    leg: null,
    foot: null,
    torso: null,
    'paw-hooves': null,
  };
}
