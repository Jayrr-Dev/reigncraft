# Wildlife of Corpus

- **lore-id:** `wildlife`
- **Canon status:** Established (species, temperaments, spawn tables, name tags), Proposed (ecology framing, ladder reading of upper tiers), Deprecated (soul saturation theory)
- **Sources:** `definingWildlifeSpeciesRegistry.ts`, `definingWildlifeBiomeSpawnTable.ts`, `definingWildlifeAggressionNameTagConstants.ts`, `definingWildlifeNameTagConstants.ts`

The animals of Corpus are its oldest inhabitants and most of its food economy. The ecology is real-world plausible on purpose: wolves actually stalk, crocodiles actually ambush, lions actually hunt in prides. The one uncanny layer is individuality, described at the bottom.

Animals ride the same ladder people do (see [`world/the-ladder.md`](../world/the-ladder.md)). When a wanderer kills a wolf, the wolf comes back, and sometimes it remembers. Herds refill and packs return not because the world is generous but because nothing is allowed to leave. This is the canon explanation for wildlife respawn, and it puts a quiet edge under every hunt: dinner holds a grudge now.

## The eleven species

### Tier 1: grazers and prey

- **Cow** and **Sheep**: placid grazers of the plains. Wanderer shorthand calls them "farm stock" though nobody farmed them; they were here first. Sheep are the wolf packs' favorite prey, a fact every plains claimant learns.
- **Chicken**: usually harmless. Usually. See [`species/the-cucco.md`](the-cucco.md) for the exception that earned its own file.
- **Deer**: skittish crepuscular browsers. Bolting is their whole strategy, and "a deer that bolted too slow" is the canonical description of venison.
- **Zebra**: savanna grazers, immune to heat. The only tier-1 animal that thrives where the scorch kills.

### Tier 2: the middle of the chain

- **Boar**: omnivores that give territorial warnings before charging. Fair, by the standards of Corpus. Ignore the warning and what happens next is on you.
- **Grey Wolf**: nocturnal pack stalkers. Wolves aggro as a pack, and their name tags run from Pup to Alpha. The forest at night is theirs, and wanderer camp placement customs exist because of it.

### Tier 3: apex

- **Brown Bear**: cathemeral omnivores, immune to cold, and the reason "retaliator" is a temperament category. A bear ignores you until you give it a reason.
- **Lion** and **Lioness**: crepuscular pride hunters of the savanna. Pride aggro means pulling one means pulling all. Lion meat's shipped description calls it cut from the king of the grasslands (the current string says "plaza grasslands", a legacy term pending rename), and it is priced in scars accordingly.
- **Crocodile**: swamp ambushers, deadly in water, slow on land. The entire strategy for surviving them is knowing which side of the waterline you are on.

## Temperament vocabulary

Keep these consistent in all copy: **passive**, **skittish**, **retaliator**, **stalker**, **predator**, **ambusher**. Each is a promise to the player about behavior, so lore text must not contradict them (never write a "gentle crocodile" scene).

## Individuality: the uncanny layer

Every animal in Corpus is an individual, and the world itself seems to announce them. Name tags declare size (Baby and Smoll up through Legendary, Gody, Hellish, Demon, Mythical) and disposition (Shy, Gentle, Docile at one end; Killer, Angry, Feral, Bloodthirsty at the other).

In fiction, wanderers can simply tell these things at a glance, the way you can tell a big dog from a small one. The extreme upper tiers (Demon, Mythical) are animals grown far past what one lifetime allows, because they have had more than one. These are the ladder's old climbers: killed, returned, grew, tried again, across more lives than anyone has counted (see [`world/the-ladder.md`](../world/the-ladder.md)). A Mythical bear is not a freak. It is a success story with teeth, and the reason veterans check name tags before checking anything else.

This also connects to wealth. Strong things can find core-heavy prey more easily, and a wanderer hauling a fortune reads, to something Mythical, like an easy rung up (Proposed; see [`world/soul-and-soulcore.md`](../world/soul-and-soulcore.md)).

Deprecated: the old "soul saturation" folk theory (animals passively soaking loose soul energy). Superseded by the ladder canon above; do not use it in new content.

## Ecology rules for new content

- Predators need prey: any new carnivore added to a biome should have a plausible food source in that biome's spawn table.
- Activity cycles are canon (nocturnal wolves, crepuscular deer and lions). Time-of-day lore should respect them.
- Animals speak only in onomatopoeia (GRRRRR!, Awooooo!, CHOMP!). No talking animals, ever. The animals of Corpus are animals. (Befriendable traveling animals are a Proposed exception handled in [`species/npcs-and-friends.md`](npcs-and-friends.md); they still do not talk.)
