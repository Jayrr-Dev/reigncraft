import { DEFINING_WORLD_PLAZA_SLEEP_SPEECH_BUBBLE_OFFSET_ABOVE_AVATAR_PX } from '@/components/world/health/domains/definingWorldPlazaEntitySleepConstants';
import type { ResolvingWorldPlazaEntityHealthFloatTextScreenPointParams } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthFloatTextScreenPoint';
import { resolvingWorldPlazaEntityHealthFloatTextScreenPoint } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthFloatTextScreenPoint';

/**
 * Maps the sleep Zzz bubble to viewport coordinates above the avatar head.
 */
export function resolvingWorldPlazaEntityWorldAnchoredSleepSpeechBubbleScreenPoint(
  params: Omit<
    ResolvingWorldPlazaEntityHealthFloatTextScreenPointParams,
    'stackIndex'
  >
): { x: number; y: number } {
  const headPoint = resolvingWorldPlazaEntityHealthFloatTextScreenPoint({
    ...params,
    stackIndex: 0,
  });

  return {
    x: headPoint.x,
    y:
      headPoint.y -
      DEFINING_WORLD_PLAZA_SLEEP_SPEECH_BUBBLE_OFFSET_ABOVE_AVATAR_PX *
        params.cameraWorldZoom,
  };
}
