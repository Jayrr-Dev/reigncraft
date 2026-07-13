# Open Questions

- **lore-id:** `meta-open-questions`
- **Canon status:** Established (as a tracking document)

Unresolved lore decisions. Each is marked **needs designer decision**, **decide before shipping related content**, or **keep open on purpose**. Move answered questions into the relevant entry and delete them here. This file is dev-facing; plain real-world terms are fine here.

## Needs designer decision

1. **Core drop mechanics vs shipped behavior.** The design calls for dropping 20% of carried cores on death and for wealth attracting stronger predators. Shipped Spritcore is non-droppable and never lost on death. Both cannot be true; the bible marks the drop/scent canon as Proposed. Decide whether the mechanic changes, the lore bends, or a banking system splits the difference.
2. **World rename pass: plaza to Corpus.** The world is now Corpus, and "plaza" is banned in lore and new copy. Shipped UI strings and flavor text still say "World plaza", "plaza hen", "plaza grasslands", etc. These need a copy rename pass to Corpus phrasing. Code identifiers (`definingWorldPlaza*` and similar) can stay as-is for now.
3. **The Seven Death Sins.** The designer mentioned "7 Death Sins" with no detail. Stub only; nothing invented. Needs a design brief before any lore is written.
4. **Permadeath exception rule for friends.** Befriended NPCs die permanently despite universal resurrection. The bible proposes the bond explanation (a soul that gives part of itself to a friend no longer weighs enough for the ladder to catch alone; see [`species/npcs-and-friends.md`](../species/npcs-and-friends.md)). Confirm or replace it, and define which exceptions let some friends return.
5. **Apostle name-to-domain mapping.** The designer's twelve names came without a full 1:1 mapping. The bible's proposal is in [`world/the-twelve-apostles.md`](../world/the-twelve-apostles.md). Confident: Willus Quill/Land (Penn), Rockless Fellus/Natural Resources (Rockefeller), Carnegus/Raw Materials (Carnegie), Dominus/Buildings (Trump), Stanous Black/Tools (Stanley Black), Herford/Machinery (Ford), Vander/Infrastructure (Vanderbilt), Leon Astronavis/Transportation (Musk), Quacker Berg/Data and Communication (Zuckerberg), Japa Morgus/Capital and Organization (JP Morgan). Needs confirmation: **Amboser/Energy** (read as Edison per the designer's list, but the name does not echo Edison cleanly) and **Zeche Tore/Technology and Knowledge** (read as Gates). Confirm both, or rename.
6. **Forgewrights recast.** The bible now reads the Forgewrights as the last civilization-scale challenge to the Apostles, ended by the Scorching, with the exact killing blow (Apostle answer vs their own apparatus) deliberately unresolved ([`world/history.md`](../world/history.md)). Confirm this recast.
7. **Core count vs existing character systems.** The design says carried cores determine strength (experience/rank). The shipped game has separate health, buff, and immune systems (`definingWorldPlazaEntityBuffRegistry.ts`, `definingWorldPlazaEntityImmuneSystemConstants.ts`). How core-count-as-power interacts with these is undesigned; the bible keeps core semantics fictional until it is.

## Decide before shipping related content

1. **Can the lava portals activate?** If a future feature uses them (dungeons, fast travel, a new region), that feature decides the answer. Until then, all portals are dark.
2. **What deals Soulbreak damage, in fiction?** Now framed as hits that wound the core directly. The first enemy or hazard that deals it should get a deliberate lore treatment consistent with that.
3. **Do obelisk circles do anything?** Currently soul-working apparatus of the Forgewrights, effects unconfirmed. If a mechanic attaches to them, coordinate with the failed-climb reading in [`world/history.md`](../world/history.md).
4. **Group realms.** Claims lore is written for individuals and informal groups. If formal teams, guilds, or shared plots ship, [`systems/claims-and-realms.md`](../systems/claims-and-realms.md) needs a section on collective ownership.
5. **The Codex Lore panel.** It says "Coming soon" (`definingWorldPlazaCodexConstants.ts`). First shipped lore should probably be: Corpus and the ladder intro, the biome band structure, and the Forgewright ruins teaser, in the wanderer voice. Anything shipped there makes its content Established; run it past the naming decisions above first.
6. **Faction presence in game.** Mereonism and the Uncored are fully Proposed. Their first shipped surface (flavor text, an NPC, a codex entry) should be chosen deliberately, since it locks tone.
7. **Named recurring rivals.** The ladder canon supports enemies that remember their killers ("the wolf I've killed five times"). If a rival mechanic ships, it becomes the flagship proof of resurrection canon; coordinate with wildlife name tags.

## Keep open on purpose

1. **Where did the Forgewrights land on the ladder?** Nothing leaves the ladder, so they are somewhere. No individual is ever identified as a returned Forgewright without a canon decision.
2. **Is there another shore beyond the ocean?** Nobody has reported one. Leon Astronavis calls the rim "unshipped routes"; that stays a claim, not a map.
3. **How many rungs are there, and where is the top?** The ladder's exact shape is never diagrammed. Twelve Apostles, then Manus, is the only published summit.
4. **What Manus actually wants a successor for.** He says the venture completes itself when someone rises. Whether there is a truth under the sincerity stays unwritten.

## Parking lot

Ideas raised but not yet developed. Promote to an entry when someone commits to them.

- Named legendary individual animals (a specific Mythical bear with a reputation) as emergent folklore, now backed by ladder canon.
- Seasonal or weather events with lore hooks.
- Wanderer graffiti/signs as an in-fiction historical record of the Claim Age.
- A cooking-culture entry if recipes expand beyond meat.
- Collected Addresses of Manus as an in-game readable, if a book/note system ever ships.
- Uncored work songs (The Red Choir) as ambient audio flavor.
