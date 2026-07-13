import { formattingWorldPlazaWorldLayerIndicatorLabel } from '@/components/world/domains/formattingWorldPlazaWorldLayerIndicatorLabel';
import { describe, expect, it } from 'vitest';

describe('formattingWorldPlazaWorldLayerIndicatorLabel', () => {
  it('formats standing layer as Layer N', () => {
    expect(formattingWorldPlazaWorldLayerIndicatorLabel(4)).toBe('Elevation 4');
    expect(formattingWorldPlazaWorldLayerIndicatorLabel(1)).toBe('Elevation 1');
  });
});
