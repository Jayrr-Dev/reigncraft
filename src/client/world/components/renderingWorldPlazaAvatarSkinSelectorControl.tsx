'use client';

import { useUserData } from '@/components/hooks/useAuth';
import { RenderingWorldPlazaDevPanelCloseButton } from '@/components/world/components/renderingWorldPlazaDevPanelCloseButton';
import { checkingWorldPlazaAvatarSkinAccessForUser } from '@/components/world/domains/checkingWorldPlazaAvatarSkinAccessForUser';
import {
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_FILTER_INPUT_CLASS_NAME,
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_LIST_CLASS_NAME,
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_OPTION_ACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_OPTION_BUTTON_BASE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_OPTION_INACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_PANEL_CLASS_NAME,
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_SHOW_ACTIVE_LABEL_MIN_OPTIONS,
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_TOGGLE_ARIA_LABEL,
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_TOGGLE_BUTTON_ACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_TOGGLE_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_TOGGLE_BUTTON_LABEL,
} from '@/components/world/domains/definingWorldPlazaAvatarSkinSelectorUiConstants';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { LABELING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_PANEL_CLOSE } from '@/components/world/domains/definingWorldPlazaDevPanelCloseButtonConstants';
import { listingWorldPlazaAvatarSkinOptionsForUser } from '@/components/world/domains/listingWorldPlazaAvatarSkinOptionsForUser';
import { settingWorldPlazaSelectedAvatarSkin } from '@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore';
import { usingWorldPlazaSelectedAvatarSkin } from '@/components/world/hooks/usingWorldPlazaSelectedAvatarSkin';
import { useMemo, useState } from 'react';

export interface RenderingWorldPlazaAvatarSkinSelectorControlProps {
  /** True when the skin selector panel is open. */
  isVisible: boolean;
  /** Flips skin selector panel visibility. */
  onToggle: () => void;
}

/**
 * Character toggle and expandable skin panel for the plaza debug control stack.
 */
export function RenderingWorldPlazaAvatarSkinSelectorControl({
  isVisible,
  onToggle,
}: RenderingWorldPlazaAvatarSkinSelectorControlProps): React.JSX.Element {
  const { data: userData } = useUserData();
  const selectedSkinId = usingWorldPlazaSelectedAvatarSkin();
  const [filterText, setFilterText] = useState('');
  const avatarSkinOptions = useMemo(
    () =>
      listingWorldPlazaAvatarSkinOptionsForUser(
        userData?.username,
        userData?.alias
      ),
    [userData?.alias, userData?.username]
  );
  const normalizedFilterText = filterText.trim().toLowerCase();
  const filteredAvatarSkinOptions = useMemo(() => {
    if (!normalizedFilterText) {
      return avatarSkinOptions;
    }

    return avatarSkinOptions.filter(
      (skinOption) =>
        skinOption.label.toLowerCase().includes(normalizedFilterText) ||
        skinOption.skinId.toLowerCase().includes(normalizedFilterText)
    );
  }, [avatarSkinOptions, normalizedFilterText]);
  const selectedSkinLabel = avatarSkinOptions.find(
    (skinOption) => skinOption.skinId === selectedSkinId
  )?.label;
  const toggleButtonLabel =
    avatarSkinOptions.length >=
      DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_SHOW_ACTIVE_LABEL_MIN_OPTIONS &&
    selectedSkinLabel
      ? `${DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_TOGGLE_BUTTON_LABEL}: ${selectedSkinLabel}`
      : DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_TOGGLE_BUTTON_LABEL;

  return (
    <div className="pointer-events-none flex flex-col gap-1">
      <button
        type="button"
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        aria-label={DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_TOGGLE_ARIA_LABEL}
        aria-pressed={isVisible}
        aria-expanded={isVisible}
        onClick={onToggle}
        className={
          isVisible
            ? DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_TOGGLE_BUTTON_ACTIVE_CLASS_NAME
            : DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_TOGGLE_BUTTON_CLASS_NAME
        }
      >
        {toggleButtonLabel}
      </button>

      {isVisible ? (
        <div
          className={DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_PANEL_CLASS_NAME}
        >
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="text-[9px] font-semibold uppercase tracking-wide text-violet-100">
              {DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_TOGGLE_BUTTON_LABEL}
            </span>
            <RenderingWorldPlazaDevPanelCloseButton
              ariaLabel={LABELING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_PANEL_CLOSE}
              onClose={onToggle}
              className="focus-visible:ring-violet-300/70"
            />
          </div>
          <input
            type="search"
            value={filterText}
            onChange={(event) => {
              setFilterText(event.target.value);
            }}
            placeholder="Filter skins..."
            aria-label="Filter avatar skins"
            className={
              DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_FILTER_INPUT_CLASS_NAME
            }
            {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
          />
          <div
            className={
              DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_LIST_CLASS_NAME
            }
          >
            {filteredAvatarSkinOptions.map((skinOption) => {
              const isActive = skinOption.skinId === selectedSkinId;

              return (
                <button
                  key={skinOption.skinId}
                  type="button"
                  {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                  aria-pressed={isActive}
                  className={`${DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_OPTION_BUTTON_BASE_CLASS_NAME} ${
                    isActive
                      ? DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_OPTION_ACTIVE_CLASS_NAME
                      : DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_OPTION_INACTIVE_CLASS_NAME
                  }`}
                  onClick={() => {
                    if (
                      !checkingWorldPlazaAvatarSkinAccessForUser(
                        skinOption.skinId,
                        userData?.username,
                        userData?.alias
                      )
                    ) {
                      return;
                    }

                    settingWorldPlazaSelectedAvatarSkin(skinOption.skinId);
                  }}
                >
                  {skinOption.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
