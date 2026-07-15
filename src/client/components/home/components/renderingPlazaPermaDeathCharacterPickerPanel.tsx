'use client';

import {
  DEFINING_PLAZA_BUTTON_SFX_KIND,
  definingPlazaButtonSfxDataAttributes,
} from '@/components/home/domains/definingPlazaDefaultButtonSfxConstants';
import { notifyingPlazaHomeScreenButtonClicked } from '@/components/home/domains/notifyingPlazaHomeScreenButtonClicked';
import { useUserData } from '@/components/hooks/useAuth';
import { Icon } from '@/components/ui/icon';
import { checkingWorldPlazaAvatarSkinAccessForUser } from '@/components/world/domains/checkingWorldPlazaAvatarSkinAccessForUser';
import { DEFINING_WORLD_PLAZA_AVATAR_SKIN_OPTIONS } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import {
  LABELING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_START_LABEL,
  LABELING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_SUBTITLE,
  LABELING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_TITLE,
  STYLING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_LIST_CLASS_NAME,
  STYLING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_BASE_CLASS_NAME,
  STYLING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_IDLE_CLASS_NAME,
  STYLING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_SELECTED_CLASS_NAME,
  STYLING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_START_DISABLED_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaPermaDeathLoadConstants';
import { rollingWorldPlazaPermaDeathCharacterPickerOptions } from '@/components/world/domains/rollingWorldPlazaPermaDeathCharacterPickerOptions';
import { useState } from 'react';

export type RenderingPlazaPermaDeathCharacterPickerPanelProps = {
  onBack: () => void;
  onConfirmCharacter: (avatarSkinId: string) => void;
};

/**
 * Character picker shown before a new Perma Death run.
 * Offers five random playable forms each time the panel mounts.
 */
export function RenderingPlazaPermaDeathCharacterPickerPanel({
  onBack,
  onConfirmCharacter,
}: RenderingPlazaPermaDeathCharacterPickerPanelProps): React.JSX.Element {
  const { data: userData } = useUserData();
  const [selectedAvatarSkinId, setSelectedAvatarSkinId] = useState<
    string | null
  >(null);
  const [offeredAvatarSkinOptions] = useState(() =>
    rollingWorldPlazaPermaDeathCharacterPickerOptions(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN_OPTIONS.filter((skinOption) =>
        checkingWorldPlazaAvatarSkinAccessForUser(
          skinOption.skinId,
          userData?.username,
          userData?.alias
        )
      )
    )
  );
  const canStartRun =
    selectedAvatarSkinId !== null &&
    offeredAvatarSkinOptions.some(
      (skinOption) => skinOption.skinId === selectedAvatarSkinId
    ) &&
    checkingWorldPlazaAvatarSkinAccessForUser(
      selectedAvatarSkinId,
      userData?.username,
      userData?.alias
    );

  return (
    <div className="plaza-panel plaza-pop-in flex w-full max-w-md flex-col gap-5 rounded-md p-5 font-body sm:p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            {...definingPlazaButtonSfxDataAttributes(
              DEFINING_PLAZA_BUTTON_SFX_KIND.none
            )}
            onClick={() => {
              notifyingPlazaHomeScreenButtonClicked();
              onBack();
            }}
            aria-label="Back to save slots"
            className="plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]"
          >
            <Icon icon="mdi:arrow-left" className="size-5" aria-hidden />
          </button>
          <div className="min-w-0">
            <h2 className="font-display text-xl font-bold tracking-wide text-poster-teal-deep">
              {LABELING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_TITLE}
            </h2>
            <p className="text-sm font-medium italic text-ink-soft">
              {LABELING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_SUBTITLE}
            </p>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="h-px bg-[linear-gradient(90deg,transparent,rgba(44,74,82,0.5),transparent)]"
      />

      <div
        className={
          STYLING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_LIST_CLASS_NAME
        }
        role="listbox"
        aria-label="Characters"
      >
        {offeredAvatarSkinOptions.map((skinOption) => {
          const isSelected = skinOption.skinId === selectedAvatarSkinId;

          return (
            <button
              key={skinOption.skinId}
              type="button"
              role="option"
              aria-selected={isSelected}
              className={`${STYLING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_BASE_CLASS_NAME} ${
                isSelected
                  ? STYLING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_SELECTED_CLASS_NAME
                  : STYLING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_IDLE_CLASS_NAME
              }`}
              onClick={() => {
                notifyingPlazaHomeScreenButtonClicked();
                setSelectedAvatarSkinId(skinOption.skinId);
              }}
            >
              <span>{skinOption.label}</span>
              {isSelected ? (
                <Icon icon="mdi:check" className="size-4" aria-hidden />
              ) : null}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!canStartRun}
        {...definingPlazaButtonSfxDataAttributes(
          DEFINING_PLAZA_BUTTON_SFX_KIND.none
        )}
        onClick={() => {
          if (!canStartRun || selectedAvatarSkinId === null) {
            return;
          }

          notifyingPlazaHomeScreenButtonClicked();
          onConfirmCharacter(selectedAvatarSkinId);
        }}
        className={`plaza-btn-3d flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-poster-gold/70 bg-[linear-gradient(180deg,#c1592f_0%,#a2481f_100%)] px-4 py-3 font-display text-sm font-bold uppercase tracking-wide text-parchment shadow-[0_4px_0_0_#6d2c12] [--plaza-edge:#6d2c12] disabled:cursor-not-allowed disabled:opacity-50 ${
          canStartRun
            ? ''
            : STYLING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_START_DISABLED_CLASS_NAME
        }`}
      >
        <Icon icon="game-icons:death-skull" className="size-4" aria-hidden />
        {LABELING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_START_LABEL}
      </button>
    </div>
  );
}
