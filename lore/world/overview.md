# World Overview

- **lore-id:** `world-overview`
- **Canon status:** Proposed (built on Established game content; supersedes the earlier three-pillar overview)
- **Sources:** `src/client/splash.tsx` (title, tagline), `definingWorldPlazaPromoAnnouncementConstants.ts` (World plaza), meat description corpora ("plaza hen", "plaza grasslands")

## The pitch

Reigncraft takes place in **Corpus**: a world built by one god, Manus, as a contest to find a being worthy of replacing him. Everything that dies here comes back, because nothing is allowed to leave the ladder. Souls wake into Corpus with empty hands, claim ground, gather cores off the dead, and climb. The tagline is the loop: **claim, study, and conquer**.

The setting's flavor is grounded survival with a dry, deadpan streak. The god is real, generous, extremely pleased with himself, and the world's dominant religion has firm opinions about why the strong deserve their winnings. The player, mostly by playing normally, becomes exhibit A.

## The pillars

Every piece of lore should reinforce at least one of these.

### 1. One god, one question

Manus made Corpus, everyone knows it, and his only question is "Can you rise?" He never punishes anyone personally; the system does it for him, which is why his epithet is the Quiet Hand. He also never stops talking: his Addresses and his very public gifts are the founder's voice of the setting, warm, sincere, and entirely about himself. His law is four words: lose, return, grow, try again. See [`world/manus.md`](manus.md) and [`world/the-ladder.md`](the-ladder.md).

### 2. The soul is the economy

Every living thing carries a Spritcore and drops it at death. Cores are money, mana, experience, and rank in one object: proof that you survived. To grow stronger, something else has to become loot, and the whole world runs on not saying that out loud. See [`world/soul-and-spritcore.md`](soul-and-spritcore.md).

### 3. The world is owned

Twelve Apostles, Manus's hand-picked stewards, own the twelve things people need to live: land, ore, grain, buildings, tools, machines, roads, power, transport, knowledge, word, and credit. Each runs their domain like a fiefdom of the useful. A mortal who wants to face Manus must best all twelve first. See [`world/the-twelve-apostles.md`](the-twelve-apostles.md).

### 4. The argument runs through everything

Mereonism says the worthy rise and unequal outcomes prove unequal merit. The Uncored say no soul should be measured by how many cores it owns. Neither is written as simply right. The satire is delivered through concrete detail, never sermon. See [`systems/factions-and-faith.md`](../systems/factions-and-faith.md).

### 5. Survival is knowledge, not gear

Corpus kills the ignorant: raw boar meat carries worms, deer meat carries a wasting sickness fire cannot always burn out, the Firelands cook you at 62 degrees, and the frozen plains slow your blood until you stop. Veterans are people who learned which meat to cook and which chicken to never, ever anger. See [`systems/disease-and-immunity.md`](../systems/disease-and-immunity.md).

## Tone

Grounded, funny in a deadpan way, and quietly dark. Most of the world is believable ecology and honest physical danger. The strangeness is systemic rather than spooky: the dead return on schedule, wealth attracts predators, the god publishes his own praise, and the church has a hymn about it. Keep the mundane mundane so the weird parts land.

## What the setting is not

- Not a mystery-box cosmology. Manus and the ladder are known facts in-world. Mysteries that remain (the Seven Death Sins, what befriending does to a soul) are tracked deliberately in [`meta/open-questions.md`](../meta/open-questions.md).
- Not high fantasy in vocabulary. No elves, wizards, or prophecies. Strange things get concrete names: Spritcore, ember vents, obelisks, the ladder.
- Not preachy, and never on the nose. The world contains a pointed argument about wealth, worth, and generous founders, and the lore's job is to stage it in details, in deniable fantasy language, not to win it or explain it. The reference rules live in [`meta/style-guide.md`](../meta/style-guide.md).

## Deprecated pillars

The original overview claimed the world had no NPC civilization, no named god or villain, and used "the Plaza" as the world's proper name. All superseded: Manus and the Apostles are named canon, traveling NPCs who settle on claimed land are planned (see [`species/npcs-and-friends.md`](../species/npcs-and-friends.md)), and the world's name is Corpus. "Plaza" survives only in legacy code identifiers and shipped UI strings pending rename (see [`locations/corpus.md`](../locations/corpus.md) and [`meta/open-questions.md`](../meta/open-questions.md)); never write it in new lore or copy.
