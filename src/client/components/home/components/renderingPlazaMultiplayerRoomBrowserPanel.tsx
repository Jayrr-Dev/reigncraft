'use client';

import {
  DEFINING_PLAZA_BUTTON_SFX_KIND,
  definingPlazaButtonSfxDataAttributes,
} from '@/components/home/domains/definingPlazaDefaultButtonSfxConstants';
import { notifyingPlazaHomeScreenButtonClicked } from '@/components/home/domains/notifyingPlazaHomeScreenButtonClicked';
import { usingPlazaMultiplayerContinueRoomsQuery } from '@/components/home/hooks/usingPlazaMultiplayerContinueRoomsQuery';
import { usingPlazaMultiplayerHostedRoomQuery } from '@/components/home/hooks/usingPlazaMultiplayerHostedRoomQuery';
import { usingPlazaMultiplayerRoomsQuery } from '@/components/home/hooks/usingPlazaMultiplayerRoomsQuery';
import { Icon } from '@/components/ui/icon';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  buildingPlazaDevvitOnlineRoomApiUrl,
  checkingPlazaDevvitOnlineMaxPlayers,
  checkingPlazaDevvitOnlineRoomDisplayName,
  PLAZA_DEVVIT_ONLINE_DEFAULT_MAX_PLAYERS,
  PLAZA_DEVVIT_ONLINE_MAX_PLAYERS,
  PLAZA_DEVVIT_ONLINE_MIN_PLAYERS,
  PLAZA_DEVVIT_ONLINE_ROOMS_API_PATH,
  PLAZA_DEVVIT_ONLINE_ROOMS_LOOKUP_API_PATH,
  type PlazaDevvitOnlineCreateRoomResponse,
  type PlazaDevvitOnlineDeleteRoomResponse,
  type PlazaDevvitOnlineLookupRoomResponse,
  type PlazaDevvitOnlineRoomListingEntry,
} from '../../../../shared/plazaDevvitOnline';

export type RenderingPlazaMultiplayerRoomBrowserPanelProps = {
  onBack: () => void;
  onJoinRoom: (roomId: string) => void;
};

type MultiplayerPanelTab = 'open' | 'create' | 'join' | 'continue';

/**
 * Create / browse / join / continue panel for named multiplayer worlds.
 */
export function RenderingPlazaMultiplayerRoomBrowserPanel({
  onBack,
  onJoinRoom,
}: RenderingPlazaMultiplayerRoomBrowserPanelProps): React.JSX.Element {
  const [tab, setTab] = useState<MultiplayerPanelTab>('open');
  const [createName, setCreateName] = useState('');
  const [createMaxPlayers, setCreateMaxPlayers] = useState(
    PLAZA_DEVVIT_ONLINE_DEFAULT_MAX_PLAYERS
  );
  const [createIsPrivate, setCreateIsPrivate] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [joinName, setJoinName] = useState('');
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const queryClient = useQueryClient();

  const openRoomsQuery = usingPlazaMultiplayerRoomsQuery(tab === 'open');
  const continueRoomsQuery = usingPlazaMultiplayerContinueRoomsQuery(
    tab === 'continue'
  );
  const hostedRoomQuery = usingPlazaMultiplayerHostedRoomQuery(tab === 'create');
  const hostedRoom =
    hostedRoomQuery.data?.type === 'hosted'
      ? hostedRoomQuery.data.room
      : null;

  const openRooms =
    openRoomsQuery.data?.type === 'rooms' ? openRoomsQuery.data.rooms : [];
  const continueRooms =
    continueRoomsQuery.data?.type === 'rooms'
      ? continueRoomsQuery.data.rooms
      : [];

  const handlingCreateWorld = async (): Promise<void> => {
    notifyingPlazaHomeScreenButtonClicked();
    setCreateError(null);

    if (!checkingPlazaDevvitOnlineRoomDisplayName(createName)) {
      setCreateError('Name must be 3-24 letters, numbers, spaces, or hyphens.');
      return;
    }

    if (!checkingPlazaDevvitOnlineMaxPlayers(createMaxPlayers)) {
      setCreateError('Max travelers must be 2 to 4.');
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch(PLAZA_DEVVIT_ONLINE_ROOMS_API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createName.trim(),
          maxPlayers: createMaxPlayers,
          isPrivate: createIsPrivate,
        }),
      });
      const data =
        (await response.json()) as PlazaDevvitOnlineCreateRoomResponse;

      if (data.type === 'error') {
        setCreateError(data.message);
        return;
      }

      onJoinRoom(data.roomId);
    } catch {
      setCreateError('Could not create world. Try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handlingDeleteHostedWorld = async (roomId: string): Promise<void> => {
    notifyingPlazaHomeScreenButtonClicked();
    setDeleteError(null);
    setIsDeleting(true);

    try {
      const response = await fetch(
        buildingPlazaDevvitOnlineRoomApiUrl(
          PLAZA_DEVVIT_ONLINE_ROOMS_API_PATH,
          roomId
        ),
        { method: 'DELETE' }
      );
      const data =
        (await response.json()) as PlazaDevvitOnlineDeleteRoomResponse;

      if (data.type === 'error') {
        setDeleteError(data.message);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ['plaza-multiplayer-rooms-hosted'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['plaza-multiplayer-rooms-mine'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['plaza-multiplayer-rooms'],
      });
    } catch {
      setDeleteError('Could not delete world. Try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlingJoinByName = async (): Promise<void> => {
    notifyingPlazaHomeScreenButtonClicked();
    setJoinError(null);

    if (!joinName.trim()) {
      setJoinError('Enter a world name.');
      return;
    }

    setIsJoining(true);

    try {
      const response = await fetch(
        `${PLAZA_DEVVIT_ONLINE_ROOMS_LOOKUP_API_PATH}?name=${encodeURIComponent(joinName.trim())}`
      );
      const data =
        (await response.json()) as PlazaDevvitOnlineLookupRoomResponse;

      if (data.type === 'error') {
        setJoinError(data.message);
        return;
      }

      if (data.isFull) {
        setJoinError(
          `That world is full (${data.maxPlayers} travelers max).`
        );
        return;
      }

      onJoinRoom(data.roomId);
    } catch {
      setJoinError('Could not look up that world. Try again.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="plaza-panel plaza-pop-in flex w-full max-w-md flex-col gap-5 rounded-md p-5 font-body sm:p-6">
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
            Create, join by name, or continue. One host world. Fellowship of{' '}
            {PLAZA_DEVVIT_ONLINE_MIN_PLAYERS}-{PLAZA_DEVVIT_ONLINE_MAX_PLAYERS}{' '}
            travelers
          </p>
        </div>
      </div>

      <div
        aria-hidden
        className="h-px bg-[linear-gradient(90deg,transparent,rgba(44,74,82,0.5),transparent)]"
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(
          [
            ['open', 'Open'],
            ['create', 'Create'],
            ['join', 'Join'],
            ['continue', 'Continue'],
          ] as const
        ).map(([tabId, label]) => (
          <button
            key={tabId}
            type="button"
            {...definingPlazaButtonSfxDataAttributes(
              DEFINING_PLAZA_BUTTON_SFX_KIND.none
            )}
            onClick={() => {
              notifyingPlazaHomeScreenButtonClicked();
              setTab(tabId);
            }}
            className={`plaza-btn-3d rounded-md border-2 px-2 py-2 text-xs font-extrabold uppercase tracking-wider ${
              tab === tabId
                ? 'border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_3px_0_0_#14252b] [--plaza-edge:#14252b]'
                : 'border-poster-teal/40 bg-[linear-gradient(180deg,rgba(255,250,230,0.7)_0%,rgba(227,209,168,0.7)_100%)] text-ink shadow-[0_3px_0_0_rgba(44,74,82,0.45)] [--plaza-edge:rgba(44,74,82,0.45)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'open' ? (
        <RenderingPlazaMultiplayerRoomList
          rooms={openRooms}
          isLoading={openRoomsQuery.isLoading}
          isError={
            openRoomsQuery.isError || openRoomsQuery.data?.type === 'error'
          }
          errorMessage={
            openRoomsQuery.data?.type === 'error'
              ? openRoomsQuery.data.message
              : 'Could not load open worlds.'
          }
          emptyMessage="No open public worlds right now. Create one or join by name."
          onRetry={() => {
            void openRoomsQuery.refetch();
          }}
          onJoinRoom={onJoinRoom}
        />
      ) : null}

      {tab === 'continue' ? (
        <RenderingPlazaMultiplayerRoomList
          rooms={continueRooms}
          isLoading={continueRoomsQuery.isLoading}
          isError={
            continueRoomsQuery.isError ||
            continueRoomsQuery.data?.type === 'error'
          }
          errorMessage={
            continueRoomsQuery.data?.type === 'error'
              ? continueRoomsQuery.data.message
              : 'Could not load your worlds.'
          }
          emptyMessage="No worlds to continue yet. Join or create one first."
          onRetry={() => {
            void continueRoomsQuery.refetch();
          }}
          onJoinRoom={onJoinRoom}
          allowJoinWhenFull={false}
        />
      ) : null}

      {tab === 'create' ? (
        hostedRoomQuery.isLoading ? (
          <div className="h-24 animate-pulse rounded-md border-2 border-poster-teal/20 bg-poster-teal/10" />
        ) : hostedRoom ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium text-ink-soft">
              You already host one world. Enter it below, or join friends by
              name.
            </p>
            <button
              type="button"
              {...definingPlazaButtonSfxDataAttributes(
                DEFINING_PLAZA_BUTTON_SFX_KIND.none
              )}
              onClick={() => {
                notifyingPlazaHomeScreenButtonClicked();
                onJoinRoom(hostedRoom.roomId);
              }}
              className="plaza-btn-3d flex w-full items-center gap-4 rounded-md border-2 border-poster-teal/50 bg-[linear-gradient(180deg,rgba(255,250,230,0.65)_0%,rgba(227,209,168,0.65)_100%)] px-4 py-4 text-left shadow-[0_4px_0_0_rgba(44,74,82,0.7)] [--plaza-edge:rgba(44,74,82,0.7)]"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-display text-base font-bold tracking-wide text-ink">
                  {hostedRoom.displayName}
                </span>
                <span className="mt-1 text-xs font-bold text-ink-soft">
                  {hostedRoom.participantCount}/{hostedRoom.maxPlayers} travelers
                  {hostedRoom.isPrivate ? ' · private' : ''}
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[linear-gradient(180deg,#7a8c5c_0%,#5f7046_100%)] px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-parchment shadow-[0_2px_0_0_#3d4a2c]">
                Enter
              </span>
            </button>
            <button
              type="button"
              disabled={isDeleting}
              {...definingPlazaButtonSfxDataAttributes(
                DEFINING_PLAZA_BUTTON_SFX_KIND.none
              )}
              onClick={() => {
                void handlingDeleteHostedWorld(hostedRoom.roomId);
              }}
              className="plaza-btn-3d inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-poster-orange-deep/60 bg-[linear-gradient(180deg,#c1592f_0%,#a2481f_100%)] px-5 py-2.5 text-sm font-extrabold uppercase tracking-wider text-parchment shadow-[0_4px_0_0_#6d2c12] disabled:cursor-not-allowed disabled:opacity-60 [--plaza-edge:#6d2c12]"
            >
              <Icon icon="mdi:delete-outline" className="size-4" aria-hidden />
              {isDeleting ? 'Deleting...' : 'Delete world'}
            </button>
            {deleteError ? (
              <p className="text-sm font-semibold text-poster-orange-deep">
                {deleteError}
              </p>
            ) : null}
          </div>
        ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-ink-soft">
            One world per traveler. Choose a unique name friends can type later.
          </p>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
            World name
            <input
              value={createName}
              onChange={(event) => setCreateName(event.target.value)}
              maxLength={24}
              placeholder="Oak Hollow"
              className="rounded-md border-2 border-poster-teal/40 bg-parchment/80 px-3 py-2 font-medium text-ink outline-none focus:border-poster-gold"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
            Max travelers
            <select
              value={createMaxPlayers}
              onChange={(event) =>
                setCreateMaxPlayers(Number.parseInt(event.target.value, 10))
              }
              className="rounded-md border-2 border-poster-teal/40 bg-parchment/80 px-3 py-2 font-medium text-ink outline-none focus:border-poster-gold"
            >
              {[2, 3, 4].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              checked={createIsPrivate}
              onChange={(event) => setCreateIsPrivate(event.target.checked)}
              className="size-4"
            />
            Private (hidden from Open list; join by name)
          </label>
          {createError ? (
            <p className="text-sm font-semibold text-poster-orange-deep">
              {createError}
            </p>
          ) : null}
          <button
            type="button"
            disabled={isCreating}
            {...definingPlazaButtonSfxDataAttributes(
              DEFINING_PLAZA_BUTTON_SFX_KIND.none
            )}
            onClick={() => {
              void handlingCreateWorld();
            }}
            className="plaza-btn-3d inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#7a8c5c_0%,#5f7046_100%)] px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-parchment shadow-[0_4px_0_0_#3d4a2c] disabled:cursor-not-allowed disabled:opacity-60 [--plaza-edge:#3d4a2c]"
          >
            <Icon icon="mdi:shape-square-plus" className="size-4" aria-hidden />
            {isCreating ? 'Creating...' : 'Create world'}
          </button>
        </div>
        )
      ) : null}

      {tab === 'join' ? (
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
            World name
            <input
              value={joinName}
              onChange={(event) => setJoinName(event.target.value)}
              maxLength={24}
              placeholder="Type the exact world name"
              className="rounded-md border-2 border-poster-teal/40 bg-parchment/80 px-3 py-2 font-medium text-ink outline-none focus:border-poster-gold"
            />
          </label>
          {joinError ? (
            <p className="text-sm font-semibold text-poster-orange-deep">
              {joinError}
            </p>
          ) : null}
          <button
            type="button"
            disabled={isJoining}
            {...definingPlazaButtonSfxDataAttributes(
              DEFINING_PLAZA_BUTTON_SFX_KIND.none
            )}
            onClick={() => {
              void handlingJoinByName();
            }}
            className="plaza-btn-3d inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#7a8c5c_0%,#5f7046_100%)] px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-parchment shadow-[0_4px_0_0_#3d4a2c] disabled:cursor-not-allowed disabled:opacity-60 [--plaza-edge:#3d4a2c]"
          >
            <Icon icon="mdi:door-open" className="size-4" aria-hidden />
            {isJoining ? 'Looking up...' : 'Join world'}
          </button>
        </div>
      ) : null}
    </div>
  );
}

type RenderingPlazaMultiplayerRoomListProps = {
  rooms: PlazaDevvitOnlineRoomListingEntry[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  emptyMessage: string;
  onRetry: () => void;
  onJoinRoom: (roomId: string) => void;
  allowJoinWhenFull?: boolean;
};

function RenderingPlazaMultiplayerRoomList({
  rooms,
  isLoading,
  isError,
  errorMessage,
  emptyMessage,
  onRetry,
  onJoinRoom,
  allowJoinWhenFull = false,
}: RenderingPlazaMultiplayerRoomListProps): React.JSX.Element {
  if (isLoading) {
    return (
      <ul className="flex flex-col gap-4" aria-label="Loading rooms">
        {[0, 1, 2].map((skeletonIndex) => (
          <li
            key={skeletonIndex}
            className="h-20 animate-pulse rounded-md border-2 border-poster-teal/20 bg-poster-teal/10"
          />
        ))}
      </ul>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-md border-2 border-poster-orange-deep/50 bg-poster-orange/10 px-4 py-6 text-center">
        <p className="text-sm font-semibold text-poster-orange-deep">
          {errorMessage}
        </p>
        <button
          type="button"
          {...definingPlazaButtonSfxDataAttributes(
            DEFINING_PLAZA_BUTTON_SFX_KIND.none
          )}
          onClick={() => {
            notifyingPlazaHomeScreenButtonClicked();
            onRetry();
          }}
          className="plaza-btn-3d inline-flex cursor-pointer items-center gap-2 rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#c1592f_0%,#a2481f_100%)] px-5 py-2.5 text-sm font-extrabold uppercase tracking-wider text-parchment shadow-[0_4px_0_0_#6d2c12] [--plaza-edge:#6d2c12]"
        >
          <Icon icon="mdi:refresh" className="size-4" aria-hidden />
          Retry
        </button>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <p className="rounded-md border-2 border-poster-teal/30 bg-poster-teal/10 px-4 py-5 text-center text-sm font-medium text-ink-soft">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="scrollbar-none flex max-h-[min(42vh,22rem)] flex-col gap-4 overflow-y-auto p-1">
      {rooms.map((room, roomOrderIndex) => {
        const isDisabled = room.isFull && !allowJoinWhenFull;

        return (
          <li key={room.roomId}>
            <button
              type="button"
              disabled={isDisabled}
              {...definingPlazaButtonSfxDataAttributes(
                DEFINING_PLAZA_BUTTON_SFX_KIND.none
              )}
              onClick={() => {
                notifyingPlazaHomeScreenButtonClicked();
                onJoinRoom(room.roomId);
              }}
              className="plaza-btn-3d plaza-pop-in flex w-full items-center gap-4 rounded-md border-2 px-4 py-4 text-left enabled:cursor-pointer enabled:border-poster-teal/50 enabled:bg-[linear-gradient(180deg,rgba(255,250,230,0.65)_0%,rgba(227,209,168,0.65)_100%)] enabled:shadow-[0_4px_0_0_rgba(44,74,82,0.7),0_8px_16px_rgba(20,28,26,0.2)] enabled:[--plaza-edge:rgba(44,74,82,0.7)] disabled:cursor-not-allowed disabled:border-ink/15 disabled:bg-ink/5 disabled:opacity-60"
              style={{ animationDelay: `${80 + roomOrderIndex * 70}ms` }}
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-poster-sage-deep/50 bg-poster-sage/20 text-poster-sage-deep">
                <Icon
                  icon={room.isPrivate ? 'mdi:lock' : 'ph:users-three-fill'}
                  className="size-6"
                  aria-hidden
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-base font-bold tracking-wide text-ink">
                  {room.displayName}
                </span>
                <span className="mt-1 flex items-center gap-1.5">
                  {Array.from({ length: room.maxPlayers }, (_, seatIndex) => (
                    <span
                      key={seatIndex}
                      aria-hidden
                      className={`size-2.5 rounded-full ${
                        seatIndex < room.participantCount
                          ? 'bg-poster-orange shadow-[0_0_5px_rgba(193,89,47,0.7)]'
                          : 'bg-ink/20'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-xs font-bold text-ink-soft">
                    {room.participantCount}/{room.maxPlayers} travelers
                    {room.isPrivate ? ' · private' : ''}
                  </span>
                </span>
              </span>
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider ${
                  isDisabled
                    ? 'bg-ink/10 text-ink-soft'
                    : 'bg-[linear-gradient(180deg,#7a8c5c_0%,#5f7046_100%)] text-parchment shadow-[0_2px_0_0_#3d4a2c]'
                }`}
              >
                {isDisabled ? 'Full' : room.participantCount === 0 ? 'Enter' : 'Join'}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
