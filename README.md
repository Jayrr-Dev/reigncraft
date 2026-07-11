# Reigncraft

CLAIM, TAME, AND CONQUER. A multiplayer survival game on Reddit set in **Corpus**: play as any animal in this world, explore biomes, fight wildlife, harvest, cook, build, and survive hunger, weather, and disease with other players in a shared plaza shard.

## App overview

Reigncraft is a [Devvit Web](https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_overview)
**Tech stack**
| Layer | Stack |
| ------------------ | ------------------------------------ |
| Client UI | React 19, Tailwind CSS 4, Vite |
| Plaza world | PixiJS 8 (`pixi.js` + `@pixi/react`) |
| Devvit server | Node.js 22, Hono, tRPC v11 |
| Multiplayer / data | Convex |
| Session state | Redis (via Devvit) |
| Audio | `star-audio` |
| Tests | Vitest |

Client code lives under `src/client`, server under `src/server`, shared types under `src/shared`. Gameplay systems (combat, terrain, wildlife, inventory, and so on) hang off the Pixi scene in `src/client/world/`.

Players can:

- Play as any animal in this world (skins differ in stats, skills, and immunities)
- Move, sprint, jump, and fight with stamina-aware controls (desktop + mobile)
- Harvest trees, rocks, and forage; cook at campfires; manage inventory and hunger
- Explore biomes with day/night, weather, and survival pressure (frostbite, disease, buffs)
- Join small multiplayer rooms (plaza shards) with other Reddit users

This soft-release build is meant for playtesting on a dedicated community. The app is published **unlisted** (not in the public App Directory).

## Content snapshot

Numbers below match the current registries. Detail lives in `gameplay/mechanics/`.

| Content               |     Count |
| --------------------- | --------: |
| Biomes                |    **13** |
| Wildlife species      |    **48** |
| Diseases              |    **16** |
| Buffs & debuffs       |    **96** |
| Playable characters   |     **7** |
| Character skills      |     **3** |
| Hunger tiers          |     **5** |
| Tool families × tiers | **6 × 4** |
| Enchantments          |     **4** |

### Biomes (13)

Biomes differ in climate, forage, and which animals show up. Snowy plains and firelands hit you with cold or heat. Swamp and beach lean toward water life. Savanna and jungle pull different predators. The Biomes Guide lists vegetation and resources per region. Named realms add discovery labels as you walk.

### Wildlife (48 species)

Spawn is per biome, not world-wide random. `definingWildlifeBiomeSpawnTable.ts` holds weighted pools: density threshold, species weights, pack size ranges. Anchors drop packs on a grid. Each animal rolls size tier, sleep schedule, and aggression (`tame`, `normal`, or `aggressive`). A few entries only appear at night (omega-wolf packs). Global difficulty levers can thin density or shift the predator mix.

Species also differ in vitals, diet, activity window (day, night, dusk, or anytime), and aggro radius. Behavior comes from one of seven temperaments:

| Temperament | Behavior                                                     | Examples                     |
| ----------- | ------------------------------------------------------------ | ---------------------------- |
| Docile      | May follow or flee; shows "Betray?" before you can hurt them | Shepherd dog, cats           |
| Passive     | Graze; flee when hurt (aggressive rolls can fight)           | Cow, sheep, chicken          |
| Skittish    | Bolt when startled; some run toward rivers or cliffs         | Deer, zebra, horses          |
| Retaliator  | Warn on territory, then chase; defend young                  | Boar, bear, elephant, rhino  |
| Predator    | Hunt in a wide radius; pride or pack pressure                | Lion, lioness, polar bear    |
| Ambusher    | Short aggro; pounce from cover or water edge                 | Crocodile, jaguar            |
| Stalker     | Shadow at range, surround, then rush                         | Grey wolf, omega wolf, hyena |

On top of temperament: pack and herd panic, defend-young, juveniles seeking adults, gap jumps over water and terrain, hunting prey on the food chain, vocals and speech bubbles, corpse Study for the bestiary, and meat loot. Kill an animal, cook the raw meat at a campfire, then eat it. Raw meat is the main way you catch disease.

### Diseases (16)

Eating raw meat (or some contact cases) rolls a chance to infect. Incubation has no HUD badge. When symptoms start, the disease can apply poison, sleep, confusion, or disease debuffs for a fixed in-game duration. Infections track the animal: poultry to salmonellosis, deer to chronic wasting, wolves to wolf fever, cattle to mad cow, and so on. Severity runs from mild to critical. Some cooked meat still keeps a small residual risk.

### Buffs & debuffs (96)

One registry, four buckets:

| Category  |  Count | Role                                                                |
| --------- | -----: | ------------------------------------------------------------------- |
| Defence   | **21** | Incoming damage, block/dodge, armor-style EV shifts                 |
| Combat    | **12** | Outgoing damage, crit/variance                                      |
| Utility   |  **6** | Movement and QoL from skills or toggles                             |
| Character | **57** | Well-fed eats, disease grants, frostbite, skin skills, status locks |

Most of the character bucket is symptoms (nausea slow, joint lock, weakness) so food, cold, and skills all show up the same way on the HUD.

### Characters, hunger, tools

Seven skins. They differ in HP, defense, speed, jump, hunger drain, and immunities (Husky and Penguin resist cold; Grizzly resists bleed). Skills are `minor-heal`, `swift-stride`, and `heat-ward`, assigned per skin.

Five hunger tiers from well fed down to starving. They change stamina regen, run drain, walk speed, and jump cost.

Six tool families (sword, axe, pickaxe, hoe, scythe, fishrod), each with four tiers from wood to gold: more damage, faster harvest, higher durability. Four enchantments attach as passive or active mods (Extra Wood on axes; Steady Grip and Blueprint Flash on the build tool). Farming ships wheat only for now.

## Configuration

App config lives in `devvit.json`.

| Setting        | Purpose                                            |
| -------------- | -------------------------------------------------- |
| `convexUrl`    | Convex deployment URL (multiplayer / backend data) |
| `giphyApiKey`  | Optional GIPHY key (secret)                        |
| `geminiApiKey` | Optional Gemini key (secret)                       |

HTTP allowlist includes the Convex cloud host and related APIs. Redis is enabled for server state.

Playtest subreddit (dev): `r/reigncraft_dev` (`dev.subreddit` in `devvit.json`).

## Deploy / soft release

```bash
# Local playtest (installs to r/reigncraft_dev, hot reload)
pnpm run dev

# Private upload (owner-only; test subs under 200 subscribers)
pnpm run deploy

# Submit for Reddit review as unlisted (soft release)
pnpm run launch
# same as: npx devvit publish --bump patch

# After approval, install on a sub you moderate
npx devvit install <subreddit>

# Public directory listing (only when ready for any mod to install)
npx devvit publish --public
```

Requires Node 22+, Devvit CLI login (`pnpm run login`), and moderation rights on the target subreddit.

## Changelog

### Soft release (current)

- Survival plaza loop: movement, combat, harvest, cooking, hunger, biomes
- Multiplayer plaza shards via Devvit + Convex
- Mobile and desktop controls; tall splash + expanded game entrypoints
- Unlisted publish for closed playtesting (not App Directory listed)
