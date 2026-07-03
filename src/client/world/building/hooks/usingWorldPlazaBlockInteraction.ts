"use client";

import {
  checkingWorldBuildingPlacedBlockCanInteract,
  type DefiningWorldBuildingPlacedBlock,
} from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { findingWorldBuildingPlacedBlockAtTileIndex } from "@/components/world/building/domains/resolvingWorldBuildingCollision";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import { useCallback, useState } from "react";

/** Result from {@link usingWorldPlazaBlockInteraction}. */
export interface UsingWorldPlazaBlockInteractionResult {
  activeInteractionBlock: DefiningWorldBuildingPlacedBlock | null;
  interactionMessage: string | null;
  interactingWithBlockAtTile: (
    tilePosition: DefiningWorldBuildingTilePosition,
    actorUserId: string | null,
    placedBlocks: DefiningWorldBuildingPlacedBlock[],
  ) => void;
  clearingBlockInteraction: () => void;
}

/**
 * Tracks lightweight interaction state for functional placed blocks.
 */
export function usingWorldPlazaBlockInteraction(): UsingWorldPlazaBlockInteractionResult {
  const [activeInteractionBlock, setActiveInteractionBlock] =
    useState<DefiningWorldBuildingPlacedBlock | null>(null);
  const [interactionMessage, setInteractionMessage] = useState<string | null>(
    null,
  );

  const interactingWithBlockAtTile = useCallback(
    (
      tilePosition: DefiningWorldBuildingTilePosition,
      actorUserId: string | null,
      placedBlocks: DefiningWorldBuildingPlacedBlock[],
    ): void => {
      if (!actorUserId) {
        return;
      }

      const block = findingWorldBuildingPlacedBlockAtTileIndex(
        tilePosition.tileX,
        tilePosition.tileY,
        placedBlocks,
      );

      if (!block) {
        setActiveInteractionBlock(null);
        setInteractionMessage(null);
        return;
      }

      if (!checkingWorldBuildingPlacedBlockCanInteract(block, actorUserId)) {
        setActiveInteractionBlock(null);
        setInteractionMessage("This block is not interactive for you.");
        return;
      }

      setActiveInteractionBlock(block);
      setInteractionMessage(`Interacting with ${block.definitionId}.`);
    },
    [],
  );

  const clearingBlockInteraction = useCallback((): void => {
    setActiveInteractionBlock(null);
    setInteractionMessage(null);
  }, []);

  return {
    activeInteractionBlock,
    interactionMessage,
    interactingWithBlockAtTile,
    clearingBlockInteraction,
  };
}
