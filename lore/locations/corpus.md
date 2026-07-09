# Corpus, the World

- **lore-id:** `corpus`
- **Canon status:** Established (world structure), Proposed (the name Corpus, NPC population, framing)
- **Sources:** `definingWorldPlazaPromoAnnouncementConstants.ts`, wildlife meat corpora
- **Supersedes:** `the-plaza` (lore-id retired; this entry absorbs it)

## The name

The world is named **Corpus**. It is Manus's name for his own creation, used in scripture, in inscriptions on his gifts ("the generosity of the Founder of Corpus"), and in everyday speech: Corpus hens, Corpus cattle, the grasslands of Corpus. The name means body: one body, many parts, each part working, which is exactly how Manus talks about it in his Addresses. Wanderers do not miss the implication that they are the parts.

> Dev note (out of fiction): shipped code identifiers and UI strings still say "plaza" and "World plaza" (`definingWorldPlazaPromoAnnouncementConstants.ts`, meat descriptions like "plaza hen"). "Plaza" is a legacy code/UI term only. Never write it in lore or new game copy; the rename pass on shipped strings is tracked in [`meta/open-questions.md`](../meta/open-questions.md).

## What it is

One continuous isometric landmass holding all twelve biomes, shared by up to 20 wanderers per room. The ground itself answers to the Apostle of Land (see [`world/the-twelve-apostles.md`](../world/the-twelve-apostles.md)); what wanderers claim, they claim inside somebody's ledger.

## Geography

- **Spawn** is the center of every wanderer's mental map. Distances are measured from it, and danger scales with distance. The Firelands cannot occur within 2,000 tiles of spawn, which wanderers read as the ladder starting everyone on a gentle rung on purpose.
- The twelve biomes tile outward in bands of rarity: common grasslands and forests near the familiar middle, rare swamps, badlands, and oceans farther out, and the legendary Firelands at the far edge of anyone's travels. Full list in [`locations/biomes.md`](biomes.md).
- **Water** matters: freshwater in plains and forests, ocean at the rim, swamp water where crocodiles wait. The beach is where wanderers first understand the world has an edge to explore, if not an end.

## Time and weather

Corpus has a full day and night cycle, and the wildlife obeys it: deer move at dusk, wolves hunt in the dark, lions patrol at dawn. Temperature is real and lethal at both ends, from Firelands heat to snowy plains cold. Weather and time are the world's most reliable schedule keepers; almost nothing else here runs on a clock.

## Who lives here

Wildlife, wanderers, and travelers. The wildlife is covered in [`species/wildlife.md`](../species/wildlife.md). Wanderers (player characters) are covered in [`species/wanderers.md`](../species/wanderers.md). Travelers, the roaming people and animals who can be met, bartered with, and invited to settle on claimed land, are Proposed and covered in [`species/npcs-and-friends.md`](../species/npcs-and-friends.md).

Today's shipped world shows only the first two, and every standing structure outside the Firelands is wanderer-built. That stays true as canon: settlement in Corpus starts at a campfire and is earned upward from there (see [`systems/claims-and-realms.md`](../systems/claims-and-realms.md)).
