import { formattingWorldPlazaWorldLayerIndicatorLabel } from '@/components/world/domains/formattingWorldPlazaWorldLayerIndicatorLabel';
import { describe, expect, it } from 'vitest';

describe('formattingWorldPlazaWorldLayerIndicatorLabel', () => {
  it('formats standing layer as compact NL readout', () => {
    expect(formattingWorldPlazaWorldLayerIndicatorLabel(4)).toBe('4L');
    expect(formattingWorldPlazaWorldLayerIndicatorLabel(1)).toBe('1L');
  });
});
