'use client';

/**
 * Transform character dropdown: search, capped list, arrow scroll (no scrollbar).
 *
 * @module components/world/components/renderingWorldPlazaActionBarTransformPanel
 */

import { Icon } from '@/components/ui/icon';
import {
  DEFINING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_LIST_SCROLL_STEP_PX,
  LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM,
  LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_FILTER,
  LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_FILTER_PLACEHOLDER,
  LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_SCROLL_DOWN,
  LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_SCROLL_UP,
  STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_FILTER_INPUT_CLASS_NAME,
  STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_LIST_CLASS_NAME,
  STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_ACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_BASE_CLASS_NAME,
  STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_INACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_PANEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_SCROLL_ARROW_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaActionBarConstants';
import {
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_OPTIONS,
  type DefiningWorldPlazaAvatarSkinId,
} from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { settingWorldPlazaSelectedAvatarSkin } from '@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useRef, useState } from 'react';

export type RenderingWorldPlazaActionBarTransformPanelProps = {
  readonly selectedAvatarSkinId: DefiningWorldPlazaAvatarSkinId;
  readonly onSelectSkin: () => void;
};

/**
 * Character transform menu with filter + arrow-driven scrolling.
 */
export function RenderingWorldPlazaActionBarTransformPanel({
  selectedAvatarSkinId,
  onSelectSkin,
}: RenderingWorldPlazaActionBarTransformPanelProps): React.JSX.Element {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [filterText, setFilterText] = useState('');
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const normalizedFilterText = filterText.trim().toLowerCase();
  const filteredSkinOptions = useMemo(() => {
    if (!normalizedFilterText) {
      return DEFINING_WORLD_PLAZA_AVATAR_SKIN_OPTIONS;
    }

    return DEFINING_WORLD_PLAZA_AVATAR_SKIN_OPTIONS.filter(
      (skinOption) =>
        skinOption.label.toLowerCase().includes(normalizedFilterText) ||
        skinOption.skinId.toLowerCase().includes(normalizedFilterText)
    );
  }, [normalizedFilterText]);

  const updatingScrollAffordances = (): void => {
    const listElement = listRef.current;

    if (!listElement) {
      setCanScrollUp(false);
      setCanScrollDown(false);
      return;
    }

    const maxScrollTop = listElement.scrollHeight - listElement.clientHeight;
    setCanScrollUp(listElement.scrollTop > 1);
    setCanScrollDown(listElement.scrollTop < maxScrollTop - 1);
  };

  useEffect(() => {
    const listElement = listRef.current;

    if (!listElement) {
      return;
    }

    updatingScrollAffordances();
    listElement.addEventListener('scroll', updatingScrollAffordances, {
      passive: true,
    });

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            updatingScrollAffordances();
          });
    resizeObserver?.observe(listElement);

    return () => {
      listElement.removeEventListener('scroll', updatingScrollAffordances);
      resizeObserver?.disconnect();
    };
  }, [filteredSkinOptions]);

  const scrollingTransformListBy = (deltaYPx: number): void => {
    const listElement = listRef.current;

    if (!listElement) {
      return;
    }

    listElement.scrollBy({ top: deltaYPx, behavior: 'smooth' });
  };

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      className={STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_PANEL_CLASS_NAME}
      role="menu"
      aria-label={LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM}
    >
      <input
        type="search"
        value={filterText}
        onChange={(event) => {
          setFilterText(event.target.value);
        }}
        placeholder={
          LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_FILTER_PLACEHOLDER
        }
        aria-label={LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_FILTER}
        className={
          STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_FILTER_INPUT_CLASS_NAME
        }
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      />

      <button
        type="button"
        aria-label={LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_SCROLL_UP}
        disabled={!canScrollUp}
        className={
          STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_SCROLL_ARROW_CLASS_NAME
        }
        onClick={() => {
          scrollingTransformListBy(
            -DEFINING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_LIST_SCROLL_STEP_PX
          );
        }}
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      >
        <Icon icon="mdi:chevron-up" className="size-4" aria-hidden="true" />
      </button>

      <div
        ref={listRef}
        className={STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_LIST_CLASS_NAME}
      >
        {filteredSkinOptions.map((skinOption) => {
          const isActiveSkin = skinOption.skinId === selectedAvatarSkinId;

          return (
            <button
              key={skinOption.skinId}
              type="button"
              role="menuitemradio"
              aria-checked={isActiveSkin}
              onClick={() => {
                settingWorldPlazaSelectedAvatarSkin(skinOption.skinId);
                onSelectSkin();
              }}
              className={cn(
                STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_BASE_CLASS_NAME,
                isActiveSkin
                  ? STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_ACTIVE_CLASS_NAME
                  : STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_INACTIVE_CLASS_NAME
              )}
              {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
            >
              {skinOption.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-label={LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_SCROLL_DOWN}
        disabled={!canScrollDown}
        className={
          STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_SCROLL_ARROW_CLASS_NAME
        }
        onClick={() => {
          scrollingTransformListBy(
            DEFINING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_LIST_SCROLL_STEP_PX
          );
        }}
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      >
        <Icon icon="mdi:chevron-down" className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
