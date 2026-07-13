# The Soul and Spritcore

- **lore-id:** `soul-and-spritcore`
- **Canon status:** Established (Spritcore item, non-droppable stack behavior, Soulbreak damage, death screens); Proposed (Manus-canon meaning, drop-on-death and wealth-scent mechanics); Deprecated (the old folk theories, kept at the bottom)
- **Sources:** `definingWorldPlazaSpritcoreConstants.ts` (name, K/M/B/T stack display), `definingWorldPlazaInventoryItemDescriptionCorpus.ts` ("Condensed soul energy"), `definingWorldPlazaEntityDamageKindRegistry.ts` (Soulbreak)

## Spritcore

Spritcore is condensed soul energy: small purple orbs, warm to the touch, faintly humming. Everyone and everything on the ladder has a core, and everything drops it when it dies. A Spritcore is proof that you survived, made portable.

The origin is no longer a mystery. Manus built the ladder to keep score, and cores are the score (see [`world/the-ladder.md`](the-ladder.md)). One object, four jobs:

- **Money.** Cores are the only currency anyone accepts, because they are the only thing everyone must earn the same way.
- **Mana.** Spellwork burns cores. Casting is spending, which keeps magic honest and keeps mages greedy.
- **Experience.** Growth across lives is stored in cores. What you carry is, in a real sense, what you have become.
- **Rank.** The church counts them, merchants count them, and so does everyone else, whatever they claim. A wanderer's worth in polite company is their core count, give or take manners.

The unavoidable arithmetic underneath all four: for you to get stronger, something else has to become loot. The whole economy of Corpus stands on that sentence, and most people prefer not to look straight at it. Manus, in an Address, put it more warmly: "Nothing in Corpus is wasted. Every ending is somebody's beginning." The corpse's view was not recorded.

> Naming note for writers: **Spritcore** / **Spritcores** is the final name. Older design notes said Magiccores; an earlier ship used Soulcore. Do not use those names in new copy.

## Wealth has a smell

Power attracts predators. A wanderer carrying a fat stack of cores is easier for strong things to find; hunters swear the world itself can smell wealth. Dying spills a fifth of what you carry, which makes the rich, in the standard tavern phrasing, treasure chests with legs. The prudent bank their cores in a claim; the proud carry them and walk fast.

> Status note: this whole section is Proposed. The shipped Spritcore is non-droppable and never lost on death (`definingWorldPlazaSpritcoreConstants.ts` and inventory behavior). The 20% drop and wealth-scent are designer intent that conflicts with shipped behavior, flagged in [`meta/open-questions.md`](../meta/open-questions.md). Do not put drop-on-death claims in shipped copy until the mechanic exists.

## Death and return

When anything dies in Corpus, Manus puts it back on the ladder. The death screens name the manner of death (YOU BURNED, YOU FROZE, YOU BLED OUT) and add a Manus flavor line about reforging for the climb. They never name a destination, because there is none. There is only the rung you fell from and the climb back to it.

The rule for lore copy stands: death is routine but never trivial. What changed is that everyone now knows whose arrangement this is, and has an opinion about it.

## Soulbreak

Most damage wounds the body. Soulbreak wounds the core directly.

In mechanics, Soulbreak is a rare hit that deals a percentage of max health and ignores shields. In fiction, it is a strike that skips the meat and lands on the thing Manus keeps score with. No armor made of matter can catch it, because it was never aimed at matter. Wanderers who survive one describe it the same way: cold, silent, and wrong, like a note played on a string inside them.

A soulbreak wound is the one injury that scares veterans more than dying, since dying is temporary and the core is not supposed to be touchable.

## Deprecated: the old folk theories

Kept for history. Do not use in new content.

- ~~The residue theory (soul leakage condensing over ages)~~ and ~~the forge theory (Forgewrights condensed souls deliberately)~~: both written when Spritcore's origin was a mystery. It is not a mystery. Manus made the ladder and the cores keep its score.
- ~~"Never explain the return mechanism."~~ The return mechanism is Manus. Characters may still grumble, marvel, or curse about it, but the bible no longer plays coy.
- ~~Spritcore "cannot be dropped or thrown away" as a fiction rule.~~ True of shipped mechanics today, but the fiction is moving toward loot-on-death; see the open question before writing either version into shipped copy.

## Writing rules for soul content

- Spritcore is physical and mundane in handling: counted, hoarded, spent, stolen off corpses. The uncanny part is what it counts, not what it is.
- "Soul" language stays concrete: energy, cores, breaks. No heaven, spirits, or ghosts.
- Copy may equate core-taking with merit, investment, ownership, or leveling up depending on who is talking (see [`systems/factions-and-faith.md`](../systems/factions-and-faith.md)). The corpse on the ground probably has a different opinion, and good copy remembers that without saying it twice.
