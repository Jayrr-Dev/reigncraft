/**
 * Overhead Talk / Shop / Quest badges for the nearest living NPC.
 *
 * @module components/world/npc/components/renderingNpcInteractionLabels
 */

'use client';

import { Icon } from '@/components/ui/icon';
import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import {
  DEFINING_NPC_ACTION_BADGE_ICON_SIZE_PX,
  DEFINING_NPC_INTERACTION_LABEL_OFFSET_ABOVE_PX,
  LABELING_NPC_ACTION_BADGE_TOOLBAR,
  resolvingNpcActionDescriptor,
  STYLING_NPC_ACTION_BADGE_CLASS_NAME,
  STYLING_NPC_ACTION_BADGE_ICON_CLASS_NAME,
  STYLING_NPC_ACTION_BADGE_ROW_CLASS_NAME,
  STYLING_NPC_ACTION_STACK_CLASS_NAME,
  STYLING_NPC_NAME_LABEL_CLASS_NAME,
} from '@/components/world/npc/domains/definingNpcActionConstants';
import type {
  DefiningNpcActionId,
  DefiningNpcPanelKind,
} from '@/components/world/npc/domains/definingNpcTypes';
import type { ManagingNpcProximityPending } from '@/components/world/npc/domains/managingNpcProximityPendingStore';
import {
  gettingNpcInstance,
  type ManagingNpcInstanceStore,
} from '@/components/world/npc/domains/managingNpcInstanceStore';
import { useEffect, useRef } from 'react';

const RENDERING_NPC_LABEL_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_NPC_LABEL_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-10 will-change-transform select-none' as const;

export type RenderingNpcInteractionLabelsProps = {
  readonly pending: ManagingNpcProximityPending | null;
  readonly npcStoreRef: React.RefObject<ManagingNpcInstanceStore>;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly onOpenPanel: (
    npcId: string,
    panel: DefiningNpcPanelKind
  ) => void;
};

export function RenderingNpcInteractionLabels({
  pending,
  npcStoreRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onOpenPanel,
}: RenderingNpcInteractionLabelsProps): React.JSX.Element {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return subscribingWorldPlazaDomOverlayFrame(() => {
      const wrapper = wrapperRef.current;

      if (!wrapper) {
        return;
      }

      if (!pending) {
        wrapper.style.transform = RENDERING_NPC_LABEL_HIDDEN_TRANSFORM;

        return;
      }

      const instance = gettingNpcInstance(
        pending.npcId,
        npcStoreRef.current
      );

      if (!instance || instance.isDead) {
        wrapper.style.transform = RENDERING_NPC_LABEL_HIDDEN_TRANSFORM;

        return;
      }

      const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint(
        instance.position
      );
      const cameraOffset = cameraOffsetRef.current;
      const cameraZoom = cameraWorldZoomRef.current;
      const overlayX = screenPoint.x + cameraOffset.x;
      const overlayY =
        screenPoint.y +
        cameraOffset.y -
        DEFINING_NPC_INTERACTION_LABEL_OFFSET_ABOVE_PX;

      wrapper.style.transform =
        computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
          overlayX,
          overlayY,
          cameraZoom
        );
      applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
        wrapper,
        cameraZoom
      );
    });
  }, [cameraOffsetRef, cameraWorldZoomRef, npcStoreRef, pending]);

  const instance = pending
    ? gettingNpcInstance(pending.npcId, npcStoreRef.current)
    : null;
  const actionIds = instance?.actionIds ?? [];

  return (
    <div
      ref={wrapperRef}
      className={RENDERING_NPC_LABEL_WRAPPER_CLASS_NAME}
      style={{ transform: RENDERING_NPC_LABEL_HIDDEN_TRANSFORM }}
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
    >
      {pending && instance && !instance.isDead ? (
        <div className={STYLING_NPC_ACTION_STACK_CLASS_NAME}>
          <div
            className={STYLING_NPC_ACTION_BADGE_ROW_CLASS_NAME}
            role="toolbar"
            aria-label={LABELING_NPC_ACTION_BADGE_TOOLBAR}
          >
            {actionIds.map((actionId: DefiningNpcActionId) => {
              const descriptor = resolvingNpcActionDescriptor(actionId);

              if (!descriptor) {
                return null;
              }

              return (
                <button
                  key={actionId}
                  type="button"
                  title={descriptor.label}
                  aria-label={descriptor.label}
                  className={STYLING_NPC_ACTION_BADGE_CLASS_NAME}
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpenPanel(pending.npcId, actionId);
                  }}
                >
                  <Icon
                    icon={descriptor.iconId}
                    width={DEFINING_NPC_ACTION_BADGE_ICON_SIZE_PX}
                    height={DEFINING_NPC_ACTION_BADGE_ICON_SIZE_PX}
                    className={STYLING_NPC_ACTION_BADGE_ICON_CLASS_NAME}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>
          <div className={STYLING_NPC_NAME_LABEL_CLASS_NAME}>
            {pending.displayName}
          </div>
        </div>
      ) : null}
    </div>
  );
}
