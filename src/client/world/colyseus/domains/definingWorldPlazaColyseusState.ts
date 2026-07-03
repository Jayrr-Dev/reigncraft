import { MapSchema, Schema, defineTypes } from "@colyseus/schema";
import { DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE } from "@/components/world/domains/definingWorldPlazaAvatarMotionConstants";
import { DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT } from "@/components/world/domains/definingWorldPlazaAvatarSkinConstants";
import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DEFAULT_DIRECTION } from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";

/**
 * Synchronized player record in a plaza Colyseus room.
 */
export class DefiningWorldPlazaColyseusPlayer extends Schema {
  userId: string = "";

  displayName: string = "Member";

  profileStatusKind: string = "";

  avatarUrl: string = "";

  avatarSkinId: string = DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT;

  x: number = 0;

  y: number = 0;

  motionKind: string = DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE;

  facingDirection: string = DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DEFAULT_DIRECTION;

  jumpStartedAtMs: number = 0;

  jumpArcPeakScreenPx: number = 0;

  layer: number = 1;
}

defineTypes(DefiningWorldPlazaColyseusPlayer, {
  userId: "string",
  displayName: "string",
  profileStatusKind: "string",
  avatarUrl: "string",
  avatarSkinId: "string",
  x: "number",
  y: "number",
  motionKind: "string",
  facingDirection: "string",
  jumpStartedAtMs: "number",
  jumpArcPeakScreenPx: "number",
  layer: "number",
});

/**
 * Synchronized ground item lying in the shared plaza world.
 *
 * Authoritative for all clients in a room shard: a single pickup mutation on
 * the server removes/decrements it for everyone, preventing duplicates.
 */
export class DefiningWorldPlazaColyseusGroundItem extends Schema {
  id: string = "";

  itemTypeId: string = "";

  quantity: number = 1;

  gridX: number = 0;

  gridY: number = 0;

  layer: number = 1;

  spawnedAtMs: number = 0;
}

defineTypes(DefiningWorldPlazaColyseusGroundItem, {
  id: "string",
  itemTypeId: "string",
  quantity: "number",
  gridX: "number",
  gridY: "number",
  layer: "number",
  spawnedAtMs: "number",
});

/**
 * Synchronized plaza room state broadcast to every connected client.
 */
export class DefiningWorldPlazaColyseusRoomState extends Schema {
  roomIndex: number = 1;

  players = new MapSchema<DefiningWorldPlazaColyseusPlayer>();

  groundItems = new MapSchema<DefiningWorldPlazaColyseusGroundItem>();
}

defineTypes(DefiningWorldPlazaColyseusRoomState, {
  roomIndex: "number",
  players: { map: DefiningWorldPlazaColyseusPlayer },
  groundItems: { map: DefiningWorldPlazaColyseusGroundItem },
});
