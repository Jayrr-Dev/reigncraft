/**
 * Declarative raw-flower disease rolls (small independent chances).
 *
 * @module components/world/inventory/domains/definingWorldPlazaFlowerRawDiseaseRegistry
 */

import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';

export type DefiningWorldPlazaFlowerRawDiseaseEntry = {
  readonly diseaseId: DefiningWorldPlazaEntityDiseaseId;
  /** Independent chance per raw flower eat (before immune multipliers). */
  readonly chance: number;
};

/**
 * Flower-borne diseases rolled when chewing a raw flower.
 * Each entry rolls independently (same-id active/immunity still blocks).
 */
export const DEFINING_WORLD_PLAZA_FLOWER_RAW_DISEASE_REGISTRY: readonly DefiningWorldPlazaFlowerRawDiseaseEntry[] =
  [
    { diseaseId: 'pollen-fever', chance: 0.04 },
    { diseaseId: 'petal-pox', chance: 0.03 },
    { diseaseId: 'rootgut', chance: 0.04 },
    { diseaseId: 'moonblight', chance: 0.02 },
    { diseaseId: 'seedlung', chance: 0.02 },
  ];
