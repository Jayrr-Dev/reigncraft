import { createRoomContext, type Snapshot } from '@colyseus/react';
import type { ReactNode } from 'react';
import type { Room } from '@colyseus/sdk';
import type { DefiningWorldPlazaColyseusRoomState } from '@/components/world/colyseus/domains/definingWorldPlazaColyseusState';

/**
 * Shared Colyseus room hooks for the plaza DOM + Pixi trees.
 *
 * @see https://docs.colyseus.io/getting-started/react
 */
const worldPlazaColyseusRoomContext =
  createRoomContext<DefiningWorldPlazaColyseusRoomState>();

type ProvidingWorldPlazaColyseusRoomContextProps = {
  connect:
    | (() => Promise<Room<DefiningWorldPlazaColyseusRoomState>>)
    | null
    | undefined
    | false;
  deps?: React.DependencyList;
  children: ReactNode;
};

type UsingWorldPlazaColyseusRoomStateContext = <
  U = DefiningWorldPlazaColyseusRoomState,
>(
  selector?: (state: DefiningWorldPlazaColyseusRoomState) => U,
) => Snapshot<U> | undefined;

export const ProvidingWorldPlazaColyseusRoomContext: (
  props: ProvidingWorldPlazaColyseusRoomContextProps,
) => ReactNode = worldPlazaColyseusRoomContext.RoomProvider;

export const usingWorldPlazaColyseusRoomContext =
  worldPlazaColyseusRoomContext.useRoom;

export const usingWorldPlazaColyseusRoomStateContext: UsingWorldPlazaColyseusRoomStateContext =
  worldPlazaColyseusRoomContext.useRoomState;

export const usingWorldPlazaColyseusRoomMessageContext =
  worldPlazaColyseusRoomContext.useRoomMessage;
