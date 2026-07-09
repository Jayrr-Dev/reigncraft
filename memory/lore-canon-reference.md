# Reigncraft Lore Canon Reference

Always-loaded summary of the world bible for AI sessions. Full detail lives under `lore/`. When touching lore, narrative, flavor text, item descriptions, NPC dialogue, or codex content, this file is the floor, not the ceiling: read the relevant `lore/` entry before writing anything substantial, and **check `lore/meta/open-questions.md` before answering a mystery**.

## Core canon

**The world is named Corpus.** Never use "plaza" in any new lore, copy, or naming; it survives only in legacy code identifiers and shipped UI strings that are pending rename (tracked in `lore/meta/open-questions.md`).

**Manus** is the one god, real and universally known. He built Corpus as a contest to find a being worthy of surpassing and succeeding him; his question is "Can you rise?" and his law is "Lose. Return. Grow. Try again." He never punishes anyone personally (epithet: the Quiet Hand); the system does it. He is a sincere, self-congratulating benevolent-founder figure: public Addresses, conspicuous gifts, genuinely believes he is saving everyone. Not comic-book evil.

**The ladder:** everything that dies, Manus resurrects: players, wildlife, enemies, Apostles. This retroactively explains shipped player and wildlife respawn. Enemies can return stronger and remember their killers. Demon/Mythical name-tag animals are old souls who climbed across many lives (the old "soul saturation" theory is Deprecated).

## Soulcore

Every entity carries a **Soulcore** (shipped item: purple orb, "Condensed soul energy", non-droppable currency). In canon it is simultaneously money, mana, experience, and social rank: proof you survived. Design intent (Proposed, conflicts with shipped behavior): 20% of carried cores drop on death, and wealth attracts stronger predators. Soulbreak damage (shipped) is a hit that wounds the core directly. Open naming question: designer notes say "Magiccore"; bible uses Soulcore. Do not rename code.

## The Twelve Apostles

Manus's hand-picked stewards. Loyal, worshipful, NOT gods. Each owns one thing people need to live. A mortal must best all twelve to face Manus; beating one grants no ownership of its domain. All Apostle content is Proposed.

| Apostle | Domain |
| ------- | ------ |
| Willus Quill | Land |
| Rockless Fellus | Natural Resources |
| Carnegus | Raw Materials |
| Dominus | Buildings |
| Stanous Black | Tools |
| Herford | Machinery |
| Vander | Infrastructure |
| Amboser | Energy (mapping unconfirmed) |
| Leon Astronavis | Transportation |
| Zeche Tore | Technology and Knowledge (mapping unconfirmed) |
| Quacker Berg | Data and Communication |
| Japa Morgus | Capital and Organization |

## Factions

**Mereonism** (followers: Mereons, "the Worthy") is the dominant faith: power must be earned, the worthy rise, unequal outcomes prove unequal merit. Core-taking is "merit" to the church, "investment" to merchants, "ownership" to nobles, "leveling up" to players. Founding text: The Weal of Wanderers, by the preacher Adom the Sifter.

**The Uncored** ("the Many") are the rebellion: "No soul should be measured by how many cores it owns." They pool cores, feed strangers, and call the player **Corekeeper** (an insult). Splinter sects: The Equal Flame, The Red Choir. Never called communists in-world. Neither faction is written as purely right; the satire is delivered through play and concrete detail, never sermons.

## The player (all Proposed)

The main character is a non-combatant: can only run and jump, but befriends easily. Progression is playing AS befriended friends (they fight, chop, build). Befriended NPCs die PERMANENTLY (exceptions TBD), a deliberate cosmological exception to the ladder; proposed explanation (bonds split the soul's weight) awaits designer confirmation. Traveling NPCs roam the world and can be bartered with, tamed, and invited to settle on claims. Settlement stages: campfire, home, town, up to Kingdom. Population = power. Conquest stays core.

## Canonical terms

Corpus, Manus, the Quiet Hand, Address (Manus's), the ladder, Soulcore, Soulbreak, the Twelve Apostles (names above), Mereonism / Mereons / the Worthy, the Uncored / the Many, Corekeeper, The Weal of Wanderers, Adom the Sifter, The Equal Flame, The Red Choir, Wanderer (player), Traveler (roaming NPC), Forgewrights, the Scorching, the Claim Age, Cucco. Damage kinds: Scorch, Frost, Burn, Soulbreak.

## Style rules (compressed)

- Never use real-world economic, political, or corporate vocabulary in fiction (no market/capital/class terms, no corporate titles, no real names of thinkers or magnates). The satire runs through deniable fantasy echoes only; reference key in `lore/meta/style-guide.md`.
- Every reference must pass the two-level test: coherent fantasy for readers who miss it, a grin for readers who catch it. Never explain a reference in fiction.
- Voice: veteran wanderer explaining to a newer one. Concrete over grand, deadpan comedy where earned, quietly dark. No em or en dashes, no high-fantasy vocabulary, no preaching the theme.

## Pointers

- Full bible: `lore/README.md` (index), `lore/world/` (Manus, ladder, Soulcore, Apostles, history), `lore/systems/factions-and-faith.md`, `lore/species/npcs-and-friends.md`.
- Canon statuses matter: Established = shipped (do not contradict), Proposed = lore only, Deprecated = do not use.
- Open items (Soulcore naming, core drops, Seven Death Sins, permadeath exceptions, Apostle mappings, plaza rename pass): `lore/meta/open-questions.md`. Check it before resolving anything that looks unresolved.
