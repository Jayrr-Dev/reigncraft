'use client';

import { RenderingWorldPlazaDevPanelCloseButton } from '@/components/world/components/renderingWorldPlazaDevPanelCloseButton';
import { RenderingWorldPlazaPerformanceTesterPanel } from '@/components/world/components/renderingWorldPlazaPerformanceTesterPanel';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { LABELING_WORLD_PLAZA_FEATURES_DEBUG_PANEL_CLOSE } from '@/components/world/domains/definingWorldPlazaDevPanelCloseButtonConstants';
import {
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_ACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_BASE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_INACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_DESCRIPTION_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_PANEL_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_PANEL_HEADING_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_TOGGLE_ARIA_LABEL,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_TOGGLE_BUTTON_ACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_TOGGLE_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_TOGGLE_BUTTON_LABEL,
  DEFINING_WORLD_PLAZA_GEMINI_TEST_BUTTON_LABEL,
  DEFINING_WORLD_PLAZA_GEMINI_TEST_DESCRIPTION,
  DEFINING_WORLD_PLAZA_GEMINI_TEST_ERROR_TEXT_CLASS_NAME,
  DEFINING_WORLD_PLAZA_GEMINI_TEST_PENDING_LABEL,
  DEFINING_WORLD_PLAZA_GEMINI_TEST_SECTION_HEADING,
  DEFINING_WORLD_PLAZA_GEMINI_TEST_SUCCESS_TEXT_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ISLAND_MODE_FEATURE_TOGGLE_DESCRIPTION,
  DEFINING_WORLD_PLAZA_ISLAND_MODE_FEATURE_TOGGLE_LABEL,
  DEFINING_WORLD_PLAZA_PROCEDURAL_TREES_AND_ROCKS_FEATURE_TOGGLE_DESCRIPTION,
  DEFINING_WORLD_PLAZA_PROCEDURAL_TREES_AND_ROCKS_FEATURE_TOGGLE_LABEL,
} from '@/components/world/domains/definingWorldPlazaFeaturesDebugUiConstants';
import {
  DEFINING_WORLD_PLAZA_GEMINI_TEST_MESSAGE,
  DEFINING_WORLD_PLAZA_GEMINI_TEST_RESULT_MAX_LENGTH,
  DEFINING_WORLD_PLAZA_GEMINI_TEST_SYSTEM_PROMPT,
} from '@/components/world/domains/definingWorldPlazaGeminiTestConstants';
import { usingWorldGeminiChatMutation } from '@/components/world/hooks/usingWorldGeminiChatMutation';
import { usingWorldPlazaIslandModeFeatureEnabledState } from '@/components/world/hooks/usingWorldPlazaIslandModeFeatureEnabledState';
import { usingWorldPlazaProceduralTreesAndRocksFeatureEnabledState } from '@/components/world/hooks/usingWorldPlazaProceduralTreesAndRocksFeatureEnabledState';

function truncatingWorldPlazaGeminiTestResult(text: string): string {
  if (text.length <= DEFINING_WORLD_PLAZA_GEMINI_TEST_RESULT_MAX_LENGTH) {
    return text;
  }

  return `${text.slice(0, DEFINING_WORLD_PLAZA_GEMINI_TEST_RESULT_MAX_LENGTH)}…`;
}

export interface RenderingWorldPlazaFeaturesDebugControlsProps {
  /** True when the Features panel is open. */
  isVisible: boolean;
  /** Flips Features panel visibility. */
  onToggle: () => void;
}

/**
 * Features toggle and expandable feature-flag panel below Character debug controls.
 */
export function RenderingWorldPlazaFeaturesDebugControls({
  isVisible,
  onToggle,
}: RenderingWorldPlazaFeaturesDebugControlsProps): React.JSX.Element {
  const { isIslandModeEnabled, settingIslandModeEnabled } =
    usingWorldPlazaIslandModeFeatureEnabledState();
  const {
    isProceduralTreesAndRocksEnabled,
    settingProceduralTreesAndRocksEnabled,
  } = usingWorldPlazaProceduralTreesAndRocksFeatureEnabledState();
  const geminiTestMutation = usingWorldGeminiChatMutation();

  return (
    <div className="pointer-events-none flex flex-col gap-1">
      <button
        type="button"
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        aria-label={DEFINING_WORLD_PLAZA_FEATURES_DEBUG_TOGGLE_ARIA_LABEL}
        aria-pressed={isVisible}
        aria-expanded={isVisible}
        onClick={onToggle}
        className={
          isVisible
            ? DEFINING_WORLD_PLAZA_FEATURES_DEBUG_TOGGLE_BUTTON_ACTIVE_CLASS_NAME
            : DEFINING_WORLD_PLAZA_FEATURES_DEBUG_TOGGLE_BUTTON_CLASS_NAME
        }
      >
        {DEFINING_WORLD_PLAZA_FEATURES_DEBUG_TOGGLE_BUTTON_LABEL}
      </button>

      {isVisible ? (
        <div className={DEFINING_WORLD_PLAZA_FEATURES_DEBUG_PANEL_CLASS_NAME}>
          <div className="flex items-center justify-between gap-2 px-1">
            <p
              className={
                DEFINING_WORLD_PLAZA_FEATURES_DEBUG_PANEL_HEADING_CLASS_NAME
              }
            >
              Features
            </p>
            <RenderingWorldPlazaDevPanelCloseButton
              ariaLabel={LABELING_WORLD_PLAZA_FEATURES_DEBUG_PANEL_CLOSE}
              onClose={onToggle}
              className="focus-visible:ring-sky-300/70"
            />
          </div>
          <p
            className={
              DEFINING_WORLD_PLAZA_FEATURES_DEBUG_PANEL_HEADING_CLASS_NAME
            }
          >
            World
          </p>
          <button
            type="button"
            {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
            aria-pressed={isIslandModeEnabled}
            className={`${DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_BASE_CLASS_NAME} ${
              isIslandModeEnabled
                ? DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_ACTIVE_CLASS_NAME
                : DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_INACTIVE_CLASS_NAME
            }`}
            onClick={() => {
              settingIslandModeEnabled(!isIslandModeEnabled);
            }}
          >
            {DEFINING_WORLD_PLAZA_ISLAND_MODE_FEATURE_TOGGLE_LABEL}
          </button>
          <p
            className={
              DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_DESCRIPTION_CLASS_NAME
            }
          >
            {DEFINING_WORLD_PLAZA_ISLAND_MODE_FEATURE_TOGGLE_DESCRIPTION}
          </p>

          <button
            type="button"
            {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
            aria-pressed={isProceduralTreesAndRocksEnabled}
            className={`${DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_BASE_CLASS_NAME} ${
              isProceduralTreesAndRocksEnabled
                ? DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_ACTIVE_CLASS_NAME
                : DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_INACTIVE_CLASS_NAME
            }`}
            onClick={() => {
              settingProceduralTreesAndRocksEnabled(
                !isProceduralTreesAndRocksEnabled
              );
            }}
          >
            {
              DEFINING_WORLD_PLAZA_PROCEDURAL_TREES_AND_ROCKS_FEATURE_TOGGLE_LABEL
            }
          </button>
          <p
            className={
              DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_DESCRIPTION_CLASS_NAME
            }
          >
            {
              DEFINING_WORLD_PLAZA_PROCEDURAL_TREES_AND_ROCKS_FEATURE_TOGGLE_DESCRIPTION
            }
          </p>

          <RenderingWorldPlazaPerformanceTesterPanel />

          <p
            className={
              DEFINING_WORLD_PLAZA_FEATURES_DEBUG_PANEL_HEADING_CLASS_NAME
            }
          >
            {DEFINING_WORLD_PLAZA_GEMINI_TEST_SECTION_HEADING}
          </p>
          <button
            type="button"
            {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
            disabled={geminiTestMutation.isPending}
            className={`${DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_BASE_CLASS_NAME} ${
              geminiTestMutation.isSuccess
                ? DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_ACTIVE_CLASS_NAME
                : DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_INACTIVE_CLASS_NAME
            } disabled:cursor-wait disabled:opacity-70`}
            onClick={() => {
              geminiTestMutation.mutate({
                message: DEFINING_WORLD_PLAZA_GEMINI_TEST_MESSAGE,
                systemPrompt: DEFINING_WORLD_PLAZA_GEMINI_TEST_SYSTEM_PROMPT,
              });
            }}
          >
            {geminiTestMutation.isPending
              ? DEFINING_WORLD_PLAZA_GEMINI_TEST_PENDING_LABEL
              : DEFINING_WORLD_PLAZA_GEMINI_TEST_BUTTON_LABEL}
          </button>
          <p
            className={
              DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_DESCRIPTION_CLASS_NAME
            }
          >
            {DEFINING_WORLD_PLAZA_GEMINI_TEST_DESCRIPTION}
          </p>
          {geminiTestMutation.isError ? (
            <p
              className={DEFINING_WORLD_PLAZA_GEMINI_TEST_ERROR_TEXT_CLASS_NAME}
            >
              {geminiTestMutation.error instanceof Error
                ? truncatingWorldPlazaGeminiTestResult(
                    geminiTestMutation.error.message
                  )
                : 'Could not reach Gemini.'}
            </p>
          ) : null}
          {geminiTestMutation.isSuccess ? (
            <p
              className={
                DEFINING_WORLD_PLAZA_GEMINI_TEST_SUCCESS_TEXT_CLASS_NAME
              }
            >
              {truncatingWorldPlazaGeminiTestResult(
                geminiTestMutation.data.text
              )}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
