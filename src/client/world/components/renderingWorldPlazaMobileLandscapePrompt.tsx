"use client";

import {
  DEFINING_WORLD_PLAZA_MOBILE_LANDSCAPE_PROMPT_CLASS_NAME,
  DEFINING_WORLD_PLAZA_MOBILE_LANDSCAPE_PROMPT_MESSAGE,
  DEFINING_WORLD_PLAZA_MOBILE_LANDSCAPE_PROMPT_TITLE,
} from "@/components/world/domains/definingWorldPlazaViewportFullscreenConstants";

export interface RenderingWorldPlazaMobileLandscapePromptProps {
  /** When true, blocks play until the device rotates to landscape. */
  isVisible: boolean;
}

/**
 * Portrait-only overlay asking mobile players to rotate before entering the plaza.
 */
export function RenderingWorldPlazaMobileLandscapePrompt({
  isVisible,
}: RenderingWorldPlazaMobileLandscapePromptProps): React.JSX.Element | null {
  if (!isVisible) {
    return null;
  }

  return (
    <div className={DEFINING_WORLD_PLAZA_MOBILE_LANDSCAPE_PROMPT_CLASS_NAME}>
      <div className="max-w-xs space-y-2">
        <p className="text-base font-semibold text-white">
          {DEFINING_WORLD_PLAZA_MOBILE_LANDSCAPE_PROMPT_TITLE}
        </p>
        <p className="text-sm text-white/80">
          {DEFINING_WORLD_PLAZA_MOBILE_LANDSCAPE_PROMPT_MESSAGE}
        </p>
      </div>
    </div>
  );
}
