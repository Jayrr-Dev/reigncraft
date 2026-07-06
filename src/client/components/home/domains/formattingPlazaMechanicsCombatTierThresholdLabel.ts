import type { DefiningWorldPlazaDamageOutcomeTierDescriptor } from '@/components/world/health/domains/definingWorldPlazaDamageOutcomeTierRegistry';

/** Human-readable σ band for one combat outcome tier. */
export function formattingPlazaMechanicsCombatTierThresholdLabel(
  descriptor: DefiningWorldPlazaDamageOutcomeTierDescriptor
): string {
  if (
    descriptor.thresholdComparison === 'high' &&
    descriptor.thresholdSd !== null
  ) {
    return `≥ +${descriptor.thresholdSd}σ`;
  }

  if (
    descriptor.thresholdComparison === 'low' &&
    descriptor.thresholdSd !== null
  ) {
    return `≤ ${descriptor.thresholdSd}σ`;
  }

  if (descriptor.tier === 'normal') {
    return '−1σ to +1σ';
  }

  if (descriptor.tier === 'true_strike') {
    return 'Ignores armor';
  }

  return '';
}
