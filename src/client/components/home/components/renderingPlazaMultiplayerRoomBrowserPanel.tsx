'use client';

import { usingPlazaMultiplayerRoomsQuery } from '@/components/home/hooks/usingPlazaMultiplayerRoomsQuery';
import { Icon } from '@/components/ui/icon';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PLAZA_DEVVIT_ONLINE_MAX_PLAYERS } from '../../../../shared/plazaDevvitOnline';

const PLAZA_ROOM_LIST_SCROLL_BOTTOM_THRESHOLD_PX = 8;

export type RenderingPlazaMultiplayerRoomBrowserPanelProps = {
  onBack: () => void;
  onJoinRoom: (roomIndex: number) => void;
};

/**
 * Room browser for multiplayer mode (max 3 players per room).
 */
export function RenderingPlazaMultiplayerRoomBrowserPanel({
  onBack,
  onJoinRoom,
}: RenderingPlazaMultiplayerRoomBrowserPanelProps): React.JSX.Element {
  const { data, isLoading, isError, refetch } =
    usingPlazaMultiplayerRoomsQuery(true);

  const rooms = data?.type === 'rooms' ? data.rooms : [];
  const roomListRef = useRef<HTMLUListElement>(null);
  const [showsScrollHint, setShowsScrollHint] = useState(false);

  const updatingScrollHintVisibility = useCallback((): void => {
    const roomList = roomListRef.current;
    if (!roomList) {
      return;
    }

    const hasOverflow =
      roomList.scrollHeight > roomList.clientHeight + 1;
    const isAtBottom =
      roomList.scrollTop + roomList.clientHeight >=
      roomList.scrollHeight - PLAZA_ROOM_LIST_SCROLL_BOTTOM_THRESHOLD_PX;

    setShowsScrollHint(hasOverflow && !isAtBottom);
  }, []);

  useEffect(() => {
    const roomList = roomListRef.current;
    if (!roomList) {
      return;
    }

    updatingScrollHintVisibility();

    roomList.addEventListener('scroll', updatingScrollHintVisibility, {
      passive: true,
    });

    const resizeObserver = new ResizeObserver(updatingScrollHintVisibility);
    resizeObserver.observe(roomList);
    for (const roomListChild of roomList.children) {
      resizeObserver.observe(roomListChild);
    }

    const animationFrameId = requestAnimationFrame(updatingScrollHintVisibility);

    return () => {
      cancelAnimationFrame(animationFrameId);
      roomList.removeEventListener('scroll', updatingScrollHintVisibility);
      resizeObserver.disconnect();
    };
  }, [rooms, updatingScrollHintVisibility]);

  return (
    <div className="plaza-panel plaza-pop-in flex w-full max-w-md flex-col gap-5 rounded-3xl p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to mode select"
          className="plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-sky-300/40 bg-gradient-to-b from-sky-500 to-sky-700 text-white shadow-[0_4px_0_0_#0c4a6e] [--plaza-edge:#0c4a6e]"
        >
          <Icon icon="mdi:arrow-left" className="size-5" aria-hidden />
        </button>
        <div className="min-w-0">
          <h2 className="font-display text-2xl text-white [text-shadow:0_2px_0_rgba(12,74,110,0.9)]">
            Multiplayer
          </h2>
          <p className="text-sm font-semibold text-sky-100/85">
            Up to {PLAZA_DEVVIT_ONLINE_MAX_PLAYERS} players per room
          </p>
        </div>
      </div>

      {isLoading ? (
        <ul className="flex flex-col gap-4" aria-label="Loading rooms">
          {[0, 1, 2].map((skeletonIndex) => (
            <li
              key={skeletonIndex}
              className="h-20 animate-pulse rounded-2xl border-2 border-sky-300/10 bg-sky-800/50"
            />
          ))}
        </ul>
      ) : null}

      {isError || data?.type === 'error' ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-red-400/40 bg-red-950/50 px-4 py-6 text-center">
          <p className="text-sm font-semibold text-red-100">
            {data?.type === 'error'
              ? data.message
              : 'Could not load rooms. Sign in to Reddit to play online.'}
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="plaza-btn-3d inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-red-300/40 bg-gradient-to-b from-red-500 to-red-700 px-5 py-2.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-[0_4px_0_0_#7f1d1d] [--plaza-edge:#7f1d1d]"
          >
            <Icon icon="mdi:refresh" className="size-4" aria-hidden />
            Retry
          </button>
        </div>
      ) : null}

      {!isLoading && data?.type === 'rooms' ? (
        <div className="relative">
          <ul
            ref={roomListRef}
            className="scrollbar-none flex max-h-[min(52vh,28rem)] flex-col gap-4 overflow-y-auto p-1"
          >
            {rooms.map((room, roomOrderIndex) => (
              <li key={room.roomIndex}>
                <button
                  type="button"
                  disabled={room.isFull}
                  onClick={() => onJoinRoom(room.roomIndex)}
                  className="plaza-btn-3d plaza-pop-in flex w-full items-center gap-4 rounded-2xl border-2 px-4 py-4 text-left enabled:cursor-pointer enabled:border-emerald-300/30 enabled:bg-gradient-to-b enabled:from-sky-700/90 enabled:to-sky-900/90 enabled:shadow-[0_4px_0_0_#082f49,0_8px_16px_rgba(0,0,0,0.3)] enabled:[--plaza-edge:#082f49] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-sky-950/50 disabled:opacity-60"
                  style={{ animationDelay: `${80 + roomOrderIndex * 70}ms` }}
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-emerald-300/30 bg-gradient-to-b from-emerald-400/30 to-emerald-600/30 text-emerald-300">
                    <Icon
                      icon="ph:users-three-fill"
                      className="size-6"
                      aria-hidden
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg text-white [text-shadow:0_1px_0_rgba(0,0,0,0.4)]">
                      Room {room.roomIndex}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5">
                      {Array.from(
                        { length: room.maxPlayers },
                        (_, seatIndex) => (
                          <span
                            key={seatIndex}
                            aria-hidden
                            className={`size-2.5 rounded-full ${
                              seatIndex < room.participantCount
                                ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                                : 'bg-white/20'
                            }`}
                          />
                        ),
                      )}
                      <span className="ml-1 text-xs font-bold text-sky-100/75">
                        {room.participantCount}/{room.maxPlayers} players
                      </span>
                    </span>
                  </span>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide ${
                      room.isFull
                        ? 'bg-white/10 text-sky-100/70'
                        : 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-[0_2px_0_0_#065f46]'
                    }`}
                  >
                    {room.isFull ? (
                      <Icon icon="mdi:lock" className="size-3.5" aria-hidden />
                    ) : (
                      <Icon
                        icon="mdi:door-open"
                        className="size-3.5"
                        aria-hidden
                      />
                    )}
                    {room.isFull ? 'Full' : 'Join'}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {showsScrollHint ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-1 pt-8"
            >
              <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[rgba(8,32,54,0.95)] to-transparent" />
              <Icon
                icon="mdi:chevron-down"
                className="plaza-scroll-hint-arrow relative size-6 text-sky-100/90 drop-shadow"
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
