# Reigncraft

CLAIM, TAME, AND CONQUER. A multiplayer survival game on Reddit set in **Corpus**: explore biomes, fight wildlife, harvest, cook, build, and survive hunger, weather, and disease with other players in a shared plaza shard.

## App overview

Reigncraft is a Devvit Web game. The feed shows a tall splash post; opening the post launches the full game view.

Players can:

- Move, sprint, jump, and fight with stamina-aware controls (desktop + mobile)
- Harvest trees, rocks, and forage; cook at campfires; manage inventory and hunger
- Explore biomes with day/night, weather, and survival pressure (frostbite, disease, buffs)
- Join small multiplayer rooms (plaza shards) with other Reddit users

This soft-release build is meant for playtesting on a dedicated community. The app is published **unlisted** (not in the public App Directory).

## Configuration

App config lives in `devvit.json`.

| Setting | Purpose |
| --- | --- |
| `convexUrl` | Convex deployment URL (multiplayer / backend data) |
| `giphyApiKey` | Optional GIPHY key (secret) |
| `geminiApiKey` | Optional Gemini key (secret) |

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
