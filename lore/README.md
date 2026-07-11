# Reigncraft World Bible

The lore and worldbuilding reference for Reigncraft ("CLAIM, STUDY, AND CONQUER"). Everything the in-game Codex Lore section, item flavor text, and future narrative content should draw from lives here.

The short version of the canon: the world is **Corpus**, built by the one god **Manus** as a contest to find a successor. Everything that dies comes back (the ladder). Every soul carries a **Soulcore**, dropped at death: money, mana, experience, and rank in one orb. Twelve loyal **Apostles** own everything people need to live, and a mortal must best all twelve to stand before Manus. The dominant faith (**Mereonism**) says the worthy rise; the rebellion (**the Uncored**) says no one rises alone. A quick always-loaded summary for AI sessions lives at `memory/lore-canon-reference.md`.

## How this bible works

Every entry is a markdown file with a small metadata header. The rules:

1. **Canon status is explicit.** Each entry declares one of:
   - `Established`: already shipped in the game (code, flavor text, UI copy). Do not contradict without a migration plan.
   - `Proposed`: new lore written here, not yet reflected in the game. Safe to revise freely.
   - `Deprecated`: superseded. Kept for history; do not use in new content.
2. **Stable IDs.** Every entry has a `lore-id` (kebab-case, never reused). Cross-reference entries by id or relative link so references survive renames.
3. **Ground lore in the game.** When an entry describes something that exists in code, it cites the source file. Invented lore must explain existing content, never fight it.
4. **Mechanics and lore stay linked.** If a mechanic changes (a disease is removed, a biome renamed), update the matching entry in the same PR.
5. **Naming: the world is Corpus.** "Plaza" is a legacy code/UI term only; never write it in lore or new copy. The rename pass on shipped strings is tracked in `meta/open-questions.md`.

## Directory map

| Folder       | Contents                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------- |
| `world/`     | Manus, the ladder, the soul and Soulcore, the Twelve Apostles, history, setting overview |
| `locations/` | Corpus itself, the thirteen biomes, the Firelands ruins                                  |
| `species/`   | Wildlife ecology, the Cucco, the Wanderers, travelers and friends (NPCs)                 |
| `systems/`   | Lore-facing rules: factions and faith, disease and immunity, claims and settlement       |
| `meta/`      | Style guide (voice, canonical terms, reference notes), open questions                    |

## Entry index

### World

- [`world/overview.md`](world/overview.md): what the setting is and the five lore pillars
- [`world/manus.md`](world/manus.md): the one god, the Quiet Hand, his Addresses and gifts
- [`world/the-ladder.md`](world/the-ladder.md): universal resurrection, merit, and its consequences
- [`world/soul-and-soulcore.md`](world/soul-and-soulcore.md): Soulcore canon, Soulbreak, death and return
- [`world/the-twelve-apostles.md`](world/the-twelve-apostles.md): the twelve stewards, their domains, and challenging them
- [`world/history.md`](world/history.md): creation, the Forgewrights, the Scorching, the Claim Age

### Locations

- [`locations/corpus.md`](locations/corpus.md): the world itself and its name
- [`locations/biomes.md`](locations/biomes.md): all thirteen biomes with lore notes
- [`locations/firelands-ruins.md`](locations/firelands-ruins.md): forge camps, portal shrines, obelisk circles, bastions

### Species

- [`species/wildlife.md`](species/wildlife.md): the full species roster, temperaments, the ladder's old climbers
- [`species/the-cucco.md`](species/the-cucco.md): aggressive chickens and Cucco Rage
- [`species/wanderers.md`](species/wanderers.md): who the players are in-fiction
- [`species/npcs-and-friends.md`](species/npcs-and-friends.md): travelers, befriending, settlement, permadeath

### Systems

- [`systems/factions-and-faith.md`](systems/factions-and-faith.md): Mereonism, the Uncored, and the argument between them
- [`systems/disease-and-immunity.md`](systems/disease-and-immunity.md): meat-borne sickness as survival culture
- [`systems/claims-and-realms.md`](systems/claims-and-realms.md): territory, plots, settlement stages, what claiming means

### Meta

- [`meta/style-guide.md`](meta/style-guide.md): voice, canonical terms, and the discreet-reference rules
- [`meta/open-questions.md`](meta/open-questions.md): unresolved decisions, ranked by urgency

## Where lore surfaces in the game

- Codex → Lore panel (currently "Coming soon"): `src/client/world/domains/definingWorldPlazaCodexConstants.ts`
- Item flavor text: `src/client/world/inventory/domains/definingWorldPlazaInventoryItemDescriptionCorpus.ts`
- Meat flavor text: `src/client/world/wildlife/domains/definingWildlifeMeatItemDescriptionCorpus.ts`
- Disease descriptions: `src/client/world/health/domains/definingWorldPlazaEntityDiseaseRegistry.ts`
- Biome codex summaries: `src/client/components/home/domains/definingPlazaBiomesGuideConstants.ts`
