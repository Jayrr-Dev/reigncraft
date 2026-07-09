# Lore Style Guide

- **lore-id:** `meta-style-guide`
- **Canon status:** Established (process rules for this bible)

How to write Reigncraft lore, whether in this bible or in shipped copy (codex entries, item descriptions, tutorial text).

## Voice

The default voice is **a veteran wanderer explaining things to a newer one**. Practical, a little dry, occasionally funny, never mystical for its own sake. The existing meat descriptions set the bar:

> "Plucked off a plaza hen, still slick and cold."
> "Lean haunch from a deer that bolted too slow."
> "Cut from the king of the plaza grasslands."

Short, concrete, and carrying attitude without announcing it. Match this. (The "plaza" wording in those shipped strings is legacy; see the naming rule below.)

## Rules

1. **Concrete over grand.** "Ember vents and ash" beats "a land of eternal flame". Name physical things.
2. **The known is stated flat; the unknown is attributed.** Manus, the ladder, and the Apostles are facts and copy treats them as facts. Genuinely open things (the Forgewrights' story, the Seven Death Sins) come sourced: "the ruins suggest", "the chronicle claims", "some wanderers say".
3. **Sentence-length variety.** Mix short and long. Avoid stacks of dramatic fragments.
4. **No high fantasy vocabulary.** No elves, wizards, prophecies, or "ancient evil". Strange things get plain names: Soulcore, obelisks, the ladder, the Scorching.
5. **Comedy is allowed where earned.** The Cucco file is the template: funny because the threat is real. Mereonist and Founder material runs the same register applied to money and generosity: deadpan, specific, slightly alarming on the second read.
6. **The satire is felt, not stated.** No character explains the theme, no narrator editorializes. Stage the argument in concrete detail (the village that cannot afford healing, the worker who mines cores and owns none) and stop there.
7. **No em dashes or en dashes anywhere in prose.** Use commas, periods, colons, or parentheses.
8. **Mechanics terms are sacred.** Scorch, Frost, Burn, Soulbreak, temperament names, disease names: lore must use them exactly as the UI does.
9. **"Plaza" is banned in lore and new copy.** It survives only in code identifiers and not-yet-renamed shipped UI strings. Never write it in new lore, flavor text, or naming. The world is Corpus.

## Canonical terms

| Term | Use | Avoid |
| ---- | --- | ----- |
| Corpus | The world's name, in all registers | "the Plaza", "the map", "the server" |
| Manus | The one god, the Founder of Corpus | "the gods", generic "God" |
| The Quiet Hand | Manus's common epithet | Explaining what it echoes |
| Address (Manus's) | The god's public appearances and collected sayings | "sermon" for Manus specifically (sermons are for clergy) |
| The ladder | The resurrection and merit cosmology | "samsara", "the cycle", afterlife terms |
| Apostle / the Twelve | Manus's stewards, by name (Willus Quill, Rockless Fellus, Carnegus, Dominus, Stanous Black, Herford, Vander, Amboser, Leon Astronavis, Zeche Tore, Quacker Berg, Japa Morgus) | "gods", "demigods", "bosses" |
| Soulcore | The core item (singular and plural), full canon in the soul file | "Magiccore" (design-notes name), "souls", "soul gems" |
| Mereonism / Mereons / the Worthy | The dominant faith and its followers | Real-world economic or political labels |
| The Uncored / the Many | The rebel faction | "communists", "rebels" as a proper name |
| Corekeeper | The Uncored's insult for accumulators, the player included | Using it as a neutral title |
| The Weal of Wanderers | Mereonism's founding text | Quoting real-world economists |
| The Equal Flame, The Red Choir | Uncored splinter sects | Expanding them beyond texture without a canon decision |
| Wanderer | Player character in fiction | "the player", "hero", "adventurer" |
| Traveler | Roaming NPC (Proposed) | "quest giver", "villager" before settlement ships |
| Forgewrights | The lost Firelands people (a wanderer nickname) | "the Ancients", "precursors" |
| The Scorching | The catastrophe that made the Firelands | "the cataclysm", "the fall" |
| The Claim Age | The current era | Dated calendars of any kind |
| Cucco | Aggressive chickens specifically | Using it for normal chickens |

## Reference notes (out of fiction, for the design team only)

The setting satirizes economic history and founder mythology through multilevel, deniable references. The pattern, so future writers keep it going:

- **Never use the real vocabulary in fiction.** Banned in-fiction: real thinkers' and magnates' names, and terms of the trade on either side of the argument (markets, capital, class, the famous "hand" phrase, corporate titles and org-speak). Dev-facing metadata like this section may use them.
- **The reference key so far.** Manus is a founder-god in the venture mold: keynote Addresses, conspicuous philanthropy, mission language, total sincerity. "The Quiet Hand" and Adom the Sifter's "led by a hand none of them see" lines echo a certain moral philosopher of self-interest; "The Weal of Wanderers" distorts his famous title. Adom the Sifter is himself the echo, at name level. The Uncored's pamphlet lines rework a famous manifesto (the spectre opening, the "nothing to lose but" close, the from-each cadence) and the labor-value idea ("every core is someone's spent life"). "The opiate jab" appears as "the ladder is a lullaby." The Apostles distort historical magnates one to one; the mapping table is in [`world/the-twelve-apostles.md`](../world/the-twelve-apostles.md). "Corpus" carries the body/company double meaning; never explain it in fiction.
- **Two-level test for every new reference.** A reader who knows nothing about the source material must get coherent fantasy that works on its own. A reader who knows the source should catch it and grin. If the joke needs the reader to know the source, cut it; if the name is a phonetic gag that breaks tone, file it down further.

## Process

- New lore starts as `Proposed`. It becomes `Established` when it ships in game copy; update the entry's status in the same PR.
- Check [`meta/open-questions.md`](open-questions.md) before answering a mystery in shipped copy. Some questions are waiting on the designer, not on inspiration.
- When a mechanic changes, grep this folder for the affected terms and update entries alongside the code.
- Before finalizing any prose, apply the humanizer pass (`.cursor/skills/humanizer/SKILL.md`): no em or en dashes, no AI filler, concrete detail over grand phrasing.
