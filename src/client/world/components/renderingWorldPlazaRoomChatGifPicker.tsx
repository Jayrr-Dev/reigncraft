"use client";

import type { FetchingWorldPlazaGiphySearchResult } from "@/components/world/domains/fetchingWorldPlazaGiphySearchResults";
import { DEFINING_WORLD_PLAZA_GIPHY_SEARCH_DEBOUNCE_MS } from "@/components/world/domains/definingWorldPlazaRoomChatGifConstants";
import { usingWorldPlazaGiphySearchQuery } from "@/components/world/hooks/usingWorldPlazaGiphySearchQuery";
import { ImageIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

/** Grid columns in the GIF picker. */
const RENDERING_WORLD_PLAZA_ROOM_CHAT_GIF_PICKER_GRID_COLUMNS = 3;

/** Fixed width of the GIF picker so it does not stretch across the chat bar. */
const RENDERING_WORLD_PLAZA_ROOM_CHAT_GIF_PICKER_WIDTH_PX = 280;

/** Max height of the scrollable GIF grid (px). */
const RENDERING_WORLD_PLAZA_ROOM_CHAT_GIF_PICKER_MAX_HEIGHT_PX = 200;

/** Placeholder for the GIF search field. */
const RENDERING_WORLD_PLAZA_ROOM_CHAT_GIF_SEARCH_PLACEHOLDER =
  "Search GIFs..." as const;

/** Accessible label for the GIF search field. */
const RENDERING_WORLD_PLAZA_ROOM_CHAT_GIF_SEARCH_LABEL =
  "Search GIPHY" as const;

export interface RenderingWorldPlazaRoomChatGifPickerProps {
  /** When false, the picker stays hidden. */
  isOpen: boolean;
  /** Called when the player picks a GIF. */
  onSelectGif: (gifId: string) => void;
}

/**
 * Compact GIPHY picker for plaza chat.
 */
export function RenderingWorldPlazaRoomChatGifPicker({
  isOpen,
  onSelectGif,
}: RenderingWorldPlazaRoomChatGifPickerProps): React.JSX.Element | null {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSearchInput("");
      setDebouncedSearchQuery("");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchInput);
    }, DEFINING_WORLD_PLAZA_GIPHY_SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOpen, searchInput]);

  const { data: gifs = [], isLoading, isError, error } =
    usingWorldPlazaGiphySearchQuery({
      searchQuery: debouncedSearchQuery,
      enabled: isOpen,
    });

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="flex flex-col gap-2 rounded-lg border border-white/20 bg-[#0d1b2a]/95 p-2 shadow-lg backdrop-blur-sm"
      style={{ width: RENDERING_WORLD_PLAZA_ROOM_CHAT_GIF_PICKER_WIDTH_PX }}
    >
      <input
        type="search"
        value={searchInput}
        aria-label={RENDERING_WORLD_PLAZA_ROOM_CHAT_GIF_SEARCH_LABEL}
        placeholder={RENDERING_WORLD_PLAZA_ROOM_CHAT_GIF_SEARCH_PLACEHOLDER}
        onChange={(event) => {
          setSearchInput(event.target.value);
        }}
        className="w-full rounded-md border border-white/15 bg-black/40 px-2 py-1.5 text-sm text-white placeholder:text-white/50 outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70"
      />

      <div
        className="overflow-y-auto"
        style={{ maxHeight: RENDERING_WORLD_PLAZA_ROOM_CHAT_GIF_PICKER_MAX_HEIGHT_PX }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-6 text-xs text-white/70">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading GIFs...
          </div>
        ) : null}

        {isError ? (
          <p className="py-4 text-center text-xs text-amber-200">
            {error instanceof Error ? error.message : "Could not load GIFs."}
          </p>
        ) : null}

        {!isLoading && !isError && gifs.length === 0 ? (
          <div className="flex flex-col items-center gap-1 py-6 text-xs text-white/60">
            <ImageIcon className="size-5" aria-hidden />
            No GIFs found.
          </div>
        ) : null}

        {!isLoading && !isError && gifs.length > 0 ? (
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${RENDERING_WORLD_PLAZA_ROOM_CHAT_GIF_PICKER_GRID_COLUMNS}, minmax(0, 1fr))`,
            }}
          >
            {gifs.map((gif: FetchingWorldPlazaGiphySearchResult) => (
              <button
                key={gif.id}
                type="button"
                aria-label={`Send GIF: ${gif.title}`}
                onClick={() => {
                  onSelectGif(gif.id);
                }}
                className="overflow-hidden rounded-md border border-transparent bg-black/30 transition hover:border-[#f4d35e]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={gif.previewUrl}
                  alt={gif.title}
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
