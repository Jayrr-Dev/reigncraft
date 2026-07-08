import {
  DEFINING_WORLD_PLAZA_ENTITY_DISEASE_REGISTRY,
  listingWorldPlazaEntityDiseaseDescriptors,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import { DEFINING_WILDLIFE_MEAT_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import { describe, expect, it } from 'vitest';

describe('definingWorldPlazaEntityDiseaseRegistry', () => {
  it('lists every disease with at least one grant', () => {
    for (const descriptor of listingWorldPlazaEntityDiseaseDescriptors()) {
      expect(descriptor.grants.length).toBeGreaterThan(0);
      expect(descriptor.durationMs).toBeGreaterThan(0);
      expect(descriptor.icon).toBeTruthy();
    }
  });

  it('covers every wildlife meat species with raw disease and cooked well-fed buff', () => {
    for (const entry of DEFINING_WILDLIFE_MEAT_CATALOG) {
      expect(
        DEFINING_WORLD_PLAZA_ENTITY_DISEASE_REGISTRY[entry.rawDiseaseId]
      ).toBeDefined();
      expect(entry.rawDiseaseChance).toBeGreaterThan(0);
      expect(entry.cookedWellFedChance).toBeGreaterThan(0);
      expect(entry.cookedWellFedBuffId.length).toBeGreaterThan(0);
    }
  });
});
