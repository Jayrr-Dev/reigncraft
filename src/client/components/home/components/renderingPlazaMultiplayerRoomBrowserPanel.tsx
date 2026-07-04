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

    const hasOverflow = roomList.scrollHeight > roomList.clientHeight + 1;
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

    const animationFrameId = requestAnimationFrame(
      updatingScrollHintVisibility
    );

    return () => {
      cancelAnimationFrame(animationFrameId);
      roomList.removeEventListener('scroll', updatingScrollHintVisibility);
      resizeObserver.disconnect();
    };
  }, [rooms, updatingScrollHintVisibility]);

  return (
    <div className="plaza-panel plaza-pop-in flex w-full max-w-md flex-col gap-5 rounded-md p-5 font-body sm:p-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to mode select"
          className="plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]"
        >
          <Icon icon="mdi:arrow-left" className="size-5" aria-hidden />
        </button>
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold tracking-wide text-poster-teal-deep">
            Multiplayer
          </h2>
          <p className="text-sm font-medium italic text-ink-soft">
            Fellowship of up to {PLAZA_DEVVIT_ONLINE_MAX_PLAYERS} travelers
          </p>
        </div>
      </div>

      <div
        aria-hidden
        className="h-px bg-[linear-gradient(90deg,transparent,rgba(44,74,82,0.5),transparent)]"
      />

      {isLoading ? (
        <ul className="flex flex-col gap-4" aria-label="Loading rooms">
          {[0, 1, 2].map((skeletonIndex) => (
            <li
              key={skeletonIndex}
              className="h-20 animate-pulse rounded-md border-2 border-poster-teal/20 bg-poster-teal/10"
            />
          ))}
        </ul>
      ) : null}

      {isError || data?.type === 'error' ? (
        <div className="flex flex-col items-center gap-4 rounded-md border-2 border-poster-orange-deep/50 bg-poster-orange/10 px-4 py-6 text-center">
          <p className="text-sm font-semibold text-poster-orange-deep">
            {data?.type === 'error'
              ? data.message
              : 'Could not load rooms. Sign in to Reddit to play online.'}
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="plaza-btn-3d inline-flex cursor-pointer items-center gap-2 rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#c1592f_0%,#a2481f_100%)] px-5 py-2.5 text-sm font-extrabold uppercase tracking-wider text-parchment shadow-[0_4px_0_0_#6d2c12] [--plaza-edge:#6d2c12]"
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
                  className="plaza-btn-3d plaza-pop-in flex w-full items-center gap-4 rounded-md border-2 px-4 py-4 text-left enabled:cursor-pointer enabled:border-poster-teal/50 enabled:bg-[linear-gradient(180deg,rgba(255,250,230,0.65)_0%,rgba(227,209,168,0.65)_100%)] enabled:shadow-[0_4px_0_0_rgba(44,74,82,0.7),0_8px_16px_rgba(20,28,26,0.2)] enabled:[--plaza-edge:rgba(44,74,82,0.7)] disabled:cursor-not-allowed disabled:border-ink/15 disabled:bg-ink/5 disabled:opacity-60"
                  style={{ animationDelay: `${80 + roomOrderIndex * 70}ms` }}
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-poster-sage-deep/50 bg-poster-sage/20 text-poster-sage-deep">
                    <Icon
                      icon="ph:users-three-fill"
                      className="size-6"
                      aria-hidden
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-base font-bold tracking-wide text-ink">
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
                                ? 'bg-poster-orange shadow-[0_0_5px_rgba(193,89,47,0.7)]'
                                : 'bg-ink/20'
                            }`}
                          />
                        )
                      )}
                      <span className="ml-1 text-xs font-bold text-ink-soft">
                        {room.participantCount}/{room.maxPlayers} travelers
                      </span>
                    </span>
                  </span>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider ${
                      room.isFull
                        ? 'bg-ink/10 text-ink-soft'
                        : 'bg-[linear-gradient(180deg,#7a8c5c_0%,#5f7046_100%)] text-parchment shadow-[0_2px_0_0_#3d4a2c]'
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
              <div className="absolute inset-x-0 bottom-0 h-14 bg-[linear-gradient(0deg,rgba(227,209,168,0.95),transparent)]" />
              <Icon
                icon="mdi:chevron-down"
                className="plaza-scroll-hint-arrow relative size-6 text-poster-teal-deep drop-shadow"
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
