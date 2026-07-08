import type { ResolvingWorldPlazaEntityHealthFloatTextScreenPointParams } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthFloatTextScreenPoint';
import { resolvingWorldPlazaEntityHealthFloatTextScreenPoint } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthFloatTextScreenPoint';
import { DEFINING_WORLD_PLAZA_STUN_DOT_OFFSET_ABOVE_AVATAR_PX } from '@/components/world/health/domains/definingWorldPlazaEntityStunConstants';

/**
 * Maps the stun dot orbit center to viewport coordinates above the avatar head.
 */
export function resolvingWorldPlazaEntityWorldAnchoredStunDotsScreenPoint(
  params: Omit<ResolvingWorldPlazaEntityHealthFloatTextScreenPointParams, 'stackIndex'>
): { x: number; y: number } {
  const headPoint = resolvingWorldPlazaEntityHealthFloatTextScreenPoint({
    ...params,
    stackIndex: 0,
  });

  return {
    x: headPoint.x,
    y:
      headPoint.y -
      DEFINING_WORLD_PLAZA_STUN_DOT_OFFSET_ABOVE_AVATAR_PX *
        params.cameraWorldZoom,
  };
}
