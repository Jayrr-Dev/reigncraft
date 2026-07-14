/**
 * Declarative armor equipment slots for the character profile panel.
 *
 * Humanoid forms use helm / arm / body / leg / foot.
 * Animal forms swap body+leg for torso, and foot/legging for paw/hooves.
 *
 * @module components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry
 */

/** Body plan that selects which armor slot set is shown. */
export type DefiningWorldPlazaArmorBodyPlanId = 'humanoid' | 'animal';

/** Stable armor slot ids (future inventory equip targets). */
export type DefiningWorldPlazaArmorSlotId =
  | 'helm'
  | 'arm'
  | 'body'
  | 'leg'
  | 'foot'
  | 'torso'
  | 'paw-hooves';

/** One empty or filled armor slot definition. */
export type DefiningWorldPlazaArmorSlotDefinition = {
  readonly id: DefiningWorldPlazaArmorSlotId;
  readonly label: string;
  readonly iconName: string;
};

/** Shared head and arm slots for every body plan. */
const DEFINING_WORLD_PLAZA_ARMOR_SLOT_HELM: DefiningWorldPlazaArmorSlotDefinition =
  {
    id: 'helm',
    label: 'Helm',
    iconName: 'game-icons:barbute',
  };

const DEFINING_WORLD_PLAZA_ARMOR_SLOT_ARM: DefiningWorldPlazaArmorSlotDefinition =
  {
    id: 'arm',
    label: 'Arm',
    iconName: 'game-icons:gauntlet',
  };

/** Humanoid basic armor: helm, arm, body, leg, foot. */
export const DEFINING_WORLD_PLAZA_ARMOR_SLOTS_HUMANOID: readonly DefiningWorldPlazaArmorSlotDefinition[] =
  [
    DEFINING_WORLD_PLAZA_ARMOR_SLOT_HELM,
    DEFINING_WORLD_PLAZA_ARMOR_SLOT_ARM,
    {
      id: 'body',
      label: 'Body',
      iconName: 'game-icons:breastplate',
    },
    {
      id: 'leg',
      label: 'Leg',
      iconName: 'game-icons:leg-armor',
    },
    {
      id: 'foot',
      label: 'Foot',
      iconName: 'game-icons:boots',
    },
  ] as const;

/**
 * Animal armor: torso replaces body + leg; paw/hooves replaces foot/legging.
 * Helm and arm stay.
 */
export const DEFINING_WORLD_PLAZA_ARMOR_SLOTS_ANIMAL: readonly DefiningWorldPlazaArmorSlotDefinition[] =
  [
    DEFINING_WORLD_PLAZA_ARMOR_SLOT_HELM,
    DEFINING_WORLD_PLAZA_ARMOR_SLOT_ARM,
    {
      id: 'torso',
      label: 'Torso',
      iconName: 'game-icons:leather-armor',
    },
    {
      id: 'paw-hooves',
      label: 'Paw / Hooves',
      iconName: 'mdi:paw',
    },
  ] as const;

/** Body-plan → ordered armor slot list. */
export const DEFINING_WORLD_PLAZA_ARMOR_SLOT_REGISTRY: Record<
  DefiningWorldPlazaArmorBodyPlanId,
  readonly DefiningWorldPlazaArmorSlotDefinition[]
> = {
  humanoid: DEFINING_WORLD_PLAZA_ARMOR_SLOTS_HUMANOID,
  animal: DEFINING_WORLD_PLAZA_ARMOR_SLOTS_ANIMAL,
};
