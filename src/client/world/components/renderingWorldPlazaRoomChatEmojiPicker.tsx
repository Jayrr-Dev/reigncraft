"use client";

import {
  DEFINING_WORLD_PLAZA_ROOM_CHAT_EMOJI_CATEGORIES,
  DEFINING_WORLD_PLAZA_ROOM_CHAT_EMOJI_DEFAULT_CATEGORY_ID,
  DEFINING_WORLD_PLAZA_ROOM_CHAT_EMOJI_PICKER_GRID_COLUMNS,
  DEFINING_WORLD_PLAZA_ROOM_CHAT_EMOJI_PICKER_MAX_HEIGHT_PX,
} from "@/components/world/domains/definingWorldPlazaRoomChatEmojiConstants";
import { useState } from "react";

export interface RenderingWorldPlazaRoomChatEmojiPickerProps {
  /** When false, the picker stays hidden. */
  isOpen: boolean;
  /** Called when the player picks an emoji. */
  onSelectEmoji: (emoji: string) => void;
}

/**
 * Compact emoji picker for plaza chat.
 */
export function RenderingWorldPlazaRoomChatEmojiPicker({
  isOpen,
  onSelectEmoji,
}: RenderingWorldPlazaRoomChatEmojiPickerProps): React.JSX.Element | null {
  const [activeCategoryId, setActiveCategoryId] = useState(
    DEFINING_WORLD_PLAZA_ROOM_CHAT_EMOJI_DEFAULT_CATEGORY_ID,
  );

  if (!isOpen) {
    return null;
  }

  const activeCategory =
    DEFINING_WORLD_PLAZA_ROOM_CHAT_EMOJI_CATEGORIES.find(
      (category) => category.id === activeCategoryId,
    ) ?? DEFINING_WORLD_PLAZA_ROOM_CHAT_EMOJI_CATEGORIES[0];

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-white/20 bg-[#0d1b2a]/95 p-2 shadow-lg backdrop-blur-sm">
      <div className="flex flex-wrap gap-1">
        {DEFINING_WORLD_PLAZA_ROOM_CHAT_EMOJI_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={category.id === activeCategory.id}
            onClick={() => {
              setActiveCategoryId(category.id);
            }}
            className={`rounded-md px-2 py-1 text-[11px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70 ${
              category.id === activeCategory.id
                ? "bg-[#f4d35e]/20 text-[#f4d35e]"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div
        className="overflow-y-auto"
        style={{
          maxHeight: DEFINING_WORLD_PLAZA_ROOM_CHAT_EMOJI_PICKER_MAX_HEIGHT_PX,
        }}
      >
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${DEFINING_WORLD_PLAZA_ROOM_CHAT_EMOJI_PICKER_GRID_COLUMNS}, minmax(0, 1fr))`,
          }}
        >
          {activeCategory.emojis.map((emojiOption) => (
            <button
              key={`${activeCategory.id}-${emojiOption.name}`}
              type="button"
              aria-label={emojiOption.name}
              onClick={() => {
                onSelectEmoji(emojiOption.emoji);
              }}
              className="flex size-8 items-center justify-center rounded-md text-lg transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70"
            >
              {emojiOption.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
