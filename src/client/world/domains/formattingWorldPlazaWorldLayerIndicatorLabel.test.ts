import { formattingWorldPlazaWorldLayerIndicatorLabel } from '@/components/world/domains/formattingWorldPlazaWorldLayerIndicatorLabel';
import { describe, expect, it } from 'vitest';

describe('formattingWorldPlazaWorldLayerIndicatorLabel', () => {
  it('formats standing layer as Layer N', () => {
    expect(formattingWorldPlazaWorldLayerIndicatorLabel(4)).toBe('Layer 4');
    expect(formattingWorldPlazaWorldLayerIndicatorLabel(1)).toBe('Layer 1');
  });
});
