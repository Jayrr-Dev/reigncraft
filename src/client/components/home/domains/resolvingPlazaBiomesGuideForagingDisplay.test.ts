import { DEFINING_PLAZA_BIOMES_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaBiomesGuideConstants';
import {
  DEFINING_PLAZA_BIOMES_GUIDE_FORAGING_BY_KIND,
  DEFINING_PLAZA_BIOMES_GUIDE_RESOURCE_TAG_CATALOG,
  DEFINING_PLAZA_BIOMES_GUIDE_VEGETATION_TAG_CATALOG,
} from '@/components/home/domains/definingPlazaBiomesGuideForagingConstants';
import { resolvingPlazaBiomesGuideForagingDisplay } from '@/components/home/domains/resolvingPlazaBiomesGuideForagingDisplay';
import { describe, expect, it } from 'vitest';

describe('plaza biomes guide foraging profiles', () => {
  it('defines valid resource and vegetation tags for every guide biome', () => {
    for (const entry of DEFINING_PLAZA_BIOMES_GUIDE_ENTRIES) {
      const profile = DEFINING_PLAZA_BIOMES_GUIDE_FORAGING_BY_KIND[entry.kind];

      expect(profile.resources.length).toBeGreaterThan(0);
      expect(profile.vegetation.length).toBeGreaterThan(0);

      for (const resourceId of profile.resources) {
        expect(
          DEFINING_PLAZA_BIOMES_GUIDE_RESOURCE_TAG_CATALOG[resourceId]
        ).toBeDefined();
      }

      for (const vegetationId of profile.vegetation) {
        expect(
          DEFINING_PLAZA_BIOMES_GUIDE_VEGETATION_TAG_CATALOG[vegetationId]
        ).toBeDefined();
      }

      const display = resolvingPlazaBiomesGuideForagingDisplay(entry.kind);
      expect(display.resources).toHaveLength(profile.resources.length);
      expect(display.vegetation).toHaveLength(profile.vegetation.length);
    }
  });
});
