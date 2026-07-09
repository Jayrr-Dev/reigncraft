# Claims, Realms, and Settlement

- **lore-id:** `claims-and-realms`
- **Canon status:** Established (realm, plots, claims, save coords, teleport mechanics); Proposed (settlement loop, NPC population); Deprecated (the "no NPCs ever" framing)
- **Sources:** `definingPlazaTutorialConstants.ts` (Realm, Plots, Claims, temporary tile claims, Save Coords, Track, Teleport to Plot)

"Claim, tame, and conquer" is the game's tagline, and this file is the fiction underneath it. In Corpus, all land already has an owner of record (see [`world/the-twelve-apostles.md`](../world/the-twelve-apostles.md), Willus Quill), but the Apostle of Land does not care who works a parcel, only that the world keeps producing climbers. So on the ground, ownership is a performance: you hold what you mark, build on, and defend.

## The vocabulary

Keep these terms consistent between lore, tutorial, and codex copy:

- **Claim**: marked ground. A claim says "someone intends to hold this" to everyone who walks past. Temporary tile claims are the lightest version, a footprint that fades.
- **Plot**: a claim with commitment. Plots are where wanderers build, store, and return to; "Teleport to Plot" exists because a plot is, in fiction, the place your soul considers home.
- **Realm**: the sum of what a wanderer (or a group) holds. A realm is not a legal entity, it is a reputation: the area where your walls stand and other people adjust their plans because of it.

## Why claiming means anything

There is no guard to call and no court to appeal to. A claim holds for exactly two reasons:

1. **Custom.** Wanderer culture broadly respects marked ground, because everyone benefits from the norm on the days they are the one away from home. Mereonism blesses the custom enthusiastically, since held ground is proof of merit by definition.
2. **Consequence.** The claimant will come back. On the ladder (see [`world/the-ladder.md`](../world/the-ladder.md)), driving someone off their land permanently is nearly impossible. You can take a plot; keeping it against an owner who returns forever is another matter. Grudges outlive bodies.

## Settlement: the planned loop (Proposed)

The designer's planned core loop turns claims from campsites into societies. All of this is Proposed until it ships; details in [`species/npcs-and-friends.md`](../species/npcs-and-friends.md).

Traveling people and animals roam Corpus. A wanderer with claimed ground can barter with them, win them over, and invite them to settle. Then the loop compounds:

- **Population is power.** More settlers means more hands, more defense, and standing to invite more and stronger arrivals. Land worth holding is land people live on, so how much you can meaningfully claim is limited by how many souls will stay.
- **Settlers unlock the world.** Settled NPCs open stores and crafts and whatever mechanics ship with them. A claim with people on it does things an empty claim cannot.
- **Settlements grow in stages:** campfire, home, town, and upward until Kingdom. Each stage is earned through the one below it. Nobody starts with a keep. Everybody starts with a fire and one friend who decided to stay.

Conquest stays core through all of it: the loop is claim, settle, grow, and conquer, then conquer more. What the loop never includes is inheriting the world's upper management. Beating an Apostle does not hand you their domain (see [`world/the-twelve-apostles.md`](../world/the-twelve-apostles.md)); a Kingdom is still, in the eyes of Corpus's owners of record, a very successful tenant.

## The unspoken rules

Player-made customs the lore treats as real wanderer culture (descriptive, not enforced):

- Marked ground is someone's. Build elsewhere.
- The beach is neutral (see [`locations/biomes.md`](../locations/biomes.md)).
- A campfire may be used by a stranger; the pot's contents may not. Uncored fires are the exception, on purpose, and they will tell you about it.
- Reading someone's sign is fine. Replacing it is a declaration.

## Home and the soul

Save Coords, tracking, and plot teleportation all get one fictional explanation: a wanderer's soul remembers places it has committed to. Marking coordinates is a small act of binding; a plot is a large one. This keeps convenience mechanics inside the fiction without inventing machinery for them.

## Deprecated

The earlier version of this file assumed a world with no NPCs, where all order was player-made and no formal structures could ever exist. Superseded: travelers, settlers, and settlement progression are planned canon. What survives from the old stance: no NPC guards or courts enforce claims today, and shipped copy must not promise settlement mechanics before they exist.

## Writing rules

- Conquest is canon and morally unweighted between players. The lore does not treat raiders as villains or defenders as heroes; it treats both as weather the other must plan for. The moral commentary in the setting comes from the factions, not the narrator (see [`systems/factions-and-faith.md`](factions-and-faith.md)).
- "Realm" in copy always refers to player holdings, never to the world or to the Apostles' domains.
- Settlement-stage vocabulary (campfire, home, town, Kingdom) is Proposed; do not use it in shipped copy until the feature ships.
