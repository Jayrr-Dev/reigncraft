/**
 * Colyseus multiplayer constants for the world plaza.
 *
 * @module components/world/colyseus/domains/definingWorldPlazaColyseusConstants
 */

/** Match-maker room name exposed to the Colyseus client SDK. */
export const DEFINING_WORLD_PLAZA_COLYSEUS_ROOM_NAME = "world_plaza" as const;

/** Default Colyseus server URL for local development. */
export const DEFINING_WORLD_PLAZA_COLYSEUS_DEFAULT_URL =
  "http://localhost:2567" as const;

/** Default Colyseus listen port for the plaza game server. */
export const DEFINING_WORLD_PLAZA_COLYSEUS_DEFAULT_PORT = 2567;

/** Maximum players per plaza room instance. */
export const DEFINING_WORLD_PLAZA_COLYSEUS_MAX_CLIENTS = 20;

/** First shard index when auto-assigning an open room. */
export const DEFINING_WORLD_PLAZA_COLYSEUS_FIRST_SHARD_INDEX = 1;

/** Maximum number of plaza room shards. */
export const DEFINING_WORLD_PLAZA_COLYSEUS_MAX_SHARD_COUNT = 50;

/** Client message: update avatar grid position. */
export const DEFINING_WORLD_PLAZA_COLYSEUS_MOVE_MESSAGE = "move" as const;

/** Client message: send ephemeral chat text. */
export const DEFINING_WORLD_PLAZA_COLYSEUS_CHAT_MESSAGE = "chat" as const;

/** Server broadcast: chat bubble payload for all clients. */
export const DEFINING_WORLD_PLAZA_COLYSEUS_CHAT_BROADCAST = "chat" as const;

/** Client message: report local typing state changes. */
export const DEFINING_WORLD_PLAZA_COLYSEUS_TYPING_MESSAGE = "typing" as const;

/** Client message: update display name and name-tag profile metadata after join. */
export const DEFINING_WORLD_PLAZA_COLYSEUS_PROFILE_MESSAGE = "profile" as const;

/** Client message: request authoritative pickup of a shared ground item. */
export const DEFINING_WORLD_PLAZA_COLYSEUS_GROUND_PICKUP_MESSAGE =
  "groundPickup" as const;

/** Server message: granted quantity to the requesting client after pickup. */
export const DEFINING_WORLD_PLAZA_COLYSEUS_GROUND_PICKUP_GRANT_MESSAGE =
  "groundPickupGrant" as const;

/** Client message: drop inventory item onto the shared ground. */
export const DEFINING_WORLD_PLAZA_COLYSEUS_GROUND_DROP_MESSAGE =
  "groundDrop" as const;

/** Server message: confirms a ground drop was accepted for this client. */
export const DEFINING_WORLD_PLAZA_COLYSEUS_GROUND_DROP_ACK_MESSAGE =
  "groundDropAck" as const;

/** Server broadcast: a player's typing state for the indicator. */
export const DEFINING_WORLD_PLAZA_COLYSEUS_TYPING_BROADCAST = "typing" as const;

/** Minimum interval between outgoing move messages (ms). */
export const DEFINING_WORLD_PLAZA_COLYSEUS_MOVE_SEND_INTERVAL_MS = 50;

/** Server state patch interval; aligned with move send rate. */
export const DEFINING_WORLD_PLAZA_COLYSEUS_PATCH_RATE_MS = 50;

/** Join options sent from the plaza client to the Colyseus room. */
export interface DefiningWorldPlazaColyseusJoinOptions {
  roomIndex: number;
  userId: string;
  displayName: string;
  profileStatusKind?: string;
  avatarUrl?: string;
  avatarSkinId?: string;
  spawnX: number;
  spawnY: number;
}

/** Move payload from client to server. */
export interface DefiningWorldPlazaColyseusMovePayload {
  x: number;
  y: number;
  motionKind: string;
  facingDirection: string;
  jumpStartedAtMs: number;
  jumpArcPeakScreenPx: number;
  /** One-based world layer the avatar is standing on (1 = ground). */
  layer: number;
}

/** Chat payload from client to server. */
export interface DefiningWorldPlazaColyseusChatSendPayload {
  message: string;
}

/** Typing payload from client to server. */
export interface DefiningWorldPlazaColyseusTypingSendPayload {
  isTyping: boolean;
}

/** Profile metadata payload from client to server (post-join updates). */
export interface DefiningWorldPlazaColyseusProfileSendPayload {
  displayName?: string;
  profileStatusKind?: string;
  avatarUrl?: string;
  avatarSkinId?: string;
}

/** Typing payload broadcast from server to other clients. */
export interface DefiningWorldPlazaColyseusTypingBroadcastPayload {
  userId: string;
  displayName: string;
  isTyping: boolean;
  /** Sender grid X when the typing state changed. */
  x: number;
  /** Sender grid Y when the typing state changed. */
  y: number;
}

/** Chat payload broadcast from server to all clients. */
export interface DefiningWorldPlazaColyseusChatBroadcastPayload {
  userId: string;
  displayName: string;
  message: string;
  sentAt: string;
  /** Sender grid X when the message was sent. */
  x: number;
  /** Sender grid Y when the message was sent. */
  y: number;
}

/** Ground item pickup request from client to server. */
export interface DefiningWorldPlazaColyseusGroundPickupSendPayload {
  /** Target ground item instance id. */
  groundItemId: string;
  /** Quantity the client's inventory can accept (server caps to availability). */
  requestedQuantity: number;
}

/** Pickup grant from server to the requesting client only. */
export interface DefiningWorldPlazaColyseusGroundPickupGrantPayload {
  /** Ground item the grant resolves. */
  groundItemId: string;
  /** Item type the client should add to inventory. */
  itemTypeId: string;
  /** Quantity authoritatively granted to the requesting client. */
  quantity: number;
}

/** Ground item drop request from client to server. */
export interface DefiningWorldPlazaColyseusGroundDropSendPayload {
  readonly itemTypeId: string;
  readonly quantity: number;
  readonly gridX: number;
  readonly gridY: number;
  readonly layer: number;
  /** Inventory slot to clear after the server accepts the drop. */
  readonly slotIndex: number;
  /** Client avatar X in tile units at drop time (authoritative for range). */
  readonly playerX: number;
  /** Client avatar Y in tile units at drop time (authoritative for range). */
  readonly playerY: number;
}

/** Ground drop acknowledgement from server to the requesting client only. */
export interface DefiningWorldPlazaColyseusGroundDropAckPayload {
  readonly success: boolean;
  readonly groundItemId: string;
  readonly slotIndex: number;
}

/** Lifetime in ms before a shared ground item auto-despawns server-side (5 minutes). */
export const DEFINING_WORLD_PLAZA_COLYSEUS_GROUND_ITEM_DESPAWN_MS = 5 * 60 * 1000;

/** Server sweep interval for despawning and reseeding ground items (ms). */
export const DEFINING_WORLD_PLAZA_COLYSEUS_GROUND_ITEM_SWEEP_MS = 1_000;

/** Max Chebyshev tile distance the server allows for a pickup. */
export const DEFINING_WORLD_PLAZA_COLYSEUS_GROUND_ITEM_PICKUP_RADIUS_TILES = 1.5;

/** Max Chebyshev tile distance the server allows for a ground drop. */
export const DEFINING_WORLD_PLAZA_COLYSEUS_GROUND_ITEM_DROP_RADIUS_TILES = 2;

/** Max drift allowed between server and client position during a drop (tiles). */
export const DEFINING_WORLD_PLAZA_COLYSEUS_GROUND_ITEM_DROP_MAX_POSITION_DRIFT_TILES = 4;

/** One authoritative demo ground item spawn at a fixed world tile. */
export interface DefiningWorldPlazaColyseusGroundItemSeedEntry {
  itemTypeId: string;
  quantity: number;
  gridX: number;
  gridY: number;
  layer: number;
}

/**
 * Demo ground item layout seeded once per room shard near the world origin.
 * Empty so no demo loot spawns; player-dropped items still appear on the ground.
 */
export const DEFINING_WORLD_PLAZA_COLYSEUS_GROUND_ITEM_SEED_LAYOUT: readonly DefiningWorldPlazaColyseusGroundItemSeedEntry[] =
  [];
