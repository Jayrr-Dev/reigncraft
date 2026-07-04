'use client';

import {
  DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS,
  checkingWorldBuildingPlacedBlockIsPassableTile,
  resolvingWorldBuildingEffectiveBlockHeight,
} from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_PLAYER_WORLD_LAYER_DEBUG_ANCHOR_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PLAYER_WORLD_LAYER_DEBUG_ANCHOR_WITH_STAMINA_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PLAYER_WORLD_LAYER_DEBUG_BUILD_LABEL_PREFIX,
  DEFINING_WORLD_PLAZA_PLAYER_WORLD_LAYER_DEBUG_PLAYER_LABEL_PREFIX,
  DEFINING_WORLD_PLAZA_PLAYER_WORLD_LAYER_DEBUG_REDRAW_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_PLAYER_WORLD_LAYER_DEBUG_TEXT_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaPlayerWorldLayerDebugConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { useEffect, useState } from 'react';

export interface RenderingWorldPlazaPlayerWorldLayerDebugLabelProps {
  /** Live local player position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** True while block build mode is active. */
  isBuildModeActive: boolean;
  /** Sidebar placement layer when build mode is active. */
  selectedWorldLayer: number;
  /** Effective preview/placement layer for the hovered or selected tile. */
  previewWorldLayer: number;
  /** True when a build preview tile is active. */
  hasBuildPreviewTile: boolean;
  /** Selected block extrusion height when build mode is active. */
  selectedBlockHeight: number;
  /** Effective preview block height for the hovered or selected tile. */
  previewBlockHeight: number;
  /** True when the stamina HUD sits above this label. */
  hasStaminaBar: boolean;
  /** When embedded, renders inside the dev panel instead of the left HUD stack. */
  layout?: 'anchored' | 'embedded';
}

/**
 * Left-side debug readout for the player's standing layer and build layer.
 */
export function RenderingWorldPlazaPlayerWorldLayerDebugLabel({
  playerPositionRef,
  isBuildModeActive,
  selectedWorldLayer,
  previewWorldLayer,
  hasBuildPreviewTile,
  selectedBlockHeight,
  previewBlockHeight,
  hasStaminaBar,
  layout = 'anchored',
}: RenderingWorldPlazaPlayerWorldLayerDebugLabelProps): React.JSX.Element {
  const [playerWorldLayer, setPlayerWorldLayer] = useState<number>(1);
  const playerTopWorldLayer =
    playerWorldLayer + DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS - 1;
  const displayWorldLayer = hasBuildPreviewTile
    ? previewWorldLayer
    : selectedWorldLayer;
  const displayBlockHeight = hasBuildPreviewTile
    ? previewBlockHeight
    : resolvingWorldBuildingEffectiveBlockHeight(
        selectedBlockHeight,
        selectedWorldLayer
      );
  const buildHeightLabel = checkingWorldBuildingPlacedBlockIsPassableTile(
    displayBlockHeight
  )
    ? 'Tile'
    : `${displayBlockHeight}H`;
  const buildLayerSummary =
    hasBuildPreviewTile && previewWorldLayer !== selectedWorldLayer
      ? `${displayWorldLayer}L (${selectedWorldLayer}L selected)`
      : `${displayWorldLayer}L`;

  useEffect(() => {
    const updatingPlayerWorldLayer = (): void => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      setPlayerWorldLayer(resolvingWorldPlazaPlayerWorldLayer(playerPosition));
    };

    updatingPlayerWorldLayer();

    const intervalId = window.setInterval(
      updatingPlayerWorldLayer,
      DEFINING_WORLD_PLAZA_PLAYER_WORLD_LAYER_DEBUG_REDRAW_INTERVAL_MS
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [playerPositionRef]);

  const containerClassName =
    layout === 'embedded'
      ? 'pointer-events-none flex select-none flex-col gap-0.5'
      : hasStaminaBar
        ? DEFINING_WORLD_PLAZA_PLAYER_WORLD_LAYER_DEBUG_ANCHOR_WITH_STAMINA_CLASS_NAME
        : DEFINING_WORLD_PLAZA_PLAYER_WORLD_LAYER_DEBUG_ANCHOR_CLASS_NAME;

  return (
    <div
      className={containerClassName}
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      aria-live="polite"
    >
      <p
        className={
          DEFINING_WORLD_PLAZA_PLAYER_WORLD_LAYER_DEBUG_TEXT_CLASS_NAME
        }
      >
        {DEFINING_WORLD_PLAZA_PLAYER_WORLD_LAYER_DEBUG_PLAYER_LABEL_PREFIX}{' '}
        {playerWorldLayer}L-{playerTopWorldLayer}L
      </p>
      {isBuildModeActive ? (
        <p
          className={
            DEFINING_WORLD_PLAZA_PLAYER_WORLD_LAYER_DEBUG_TEXT_CLASS_NAME
          }
        >
          {DEFINING_WORLD_PLAZA_PLAYER_WORLD_LAYER_DEBUG_BUILD_LABEL_PREFIX}{' '}
          {buildLayerSummary} / {buildHeightLabel}
        </p>
      ) : null}
    </div>
  );
}
