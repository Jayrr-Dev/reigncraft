"use client";

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import {
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_LABEL_CLASS_NAME,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_LABEL_PREFIX,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_LABEL_REFRESH_INTERVAL_MS,
} from "@/components/world/domains/definingWorldPlazaTerrainCollisionBlockerHitDebugConstants";
import { readingWorldPlazaTerrainCollisionBlockerHitDebugState } from "@/components/world/domains/recordingWorldPlazaTerrainCollisionBlockerHitDebugState";
import { useEffect, useState } from "react";

export interface RenderingWorldPlazaTerrainCollisionBlockerHitDebugLabelProps {
  /** True when collision debug overlays are visible. */
  isVisible: boolean;
}

/**
 * Shows the latest movement blocker kind while collision debug is enabled.
 */
export function RenderingWorldPlazaTerrainCollisionBlockerHitDebugLabel({
  isVisible,
}: RenderingWorldPlazaTerrainCollisionBlockerHitDebugLabelProps): React.JSX.Element | null {
  const [hitSummary, setHitSummary] = useState<string | null>(null);

  useEffect(() => {
    if (!isVisible) {
      setHitSummary(null);
      return;
    }

    const updatingHitSummary = (): void => {
      const latestHit = readingWorldPlazaTerrainCollisionBlockerHitDebugState();

      if (!latestHit) {
        setHitSummary(null);
        return;
      }

      setHitSummary(
        `${DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_LABEL_PREFIX}: ${latestHit.label} (${latestHit.detail}) #${latestHit.hitCount}`,
      );
    };

    updatingHitSummary();

    const intervalId = window.setInterval(
      updatingHitSummary,
      DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_LABEL_REFRESH_INTERVAL_MS,
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isVisible]);

  if (!isVisible || !hitSummary) {
    return null;
  }

  return (
    <div
      className={DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_LABEL_CLASS_NAME}
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      aria-live="polite"
    >
      {hitSummary}
    </div>
  );
}
