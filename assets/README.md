# Game assets layout

Reigncraft splits art and audio across three roots. Only `public/` is copied into the Devvit webview bundle.

## `public/` (shipped runtime)

Served at root-relative URLs (`/creatures/...`, `/fire/...`, etc.). Vite mirrors this tree into `dist/client/`.

```
public/
  creatures/              # wildlife + playable character sprites and vocals
    sprites/
      species/            # NPC species sheets (kebab-case folders)
      playable/           # girl-sample only
    sfx/
      vocals/             # beast, farm-animal, mixkit-wild, pixabay-wild, werewolf
      voice/              # girl-sample-voice
  fire/
    sprites/
      props/              # firelands biome props
      vfx/                # fire-flame, fire-smoke
    sfx/                  # campfire
  harvest/
    sprites/              # held-item 8-direction sheets (axes, swords, …)
    sfx/                  # filmcow-equipment
  environment/
    music/cozy-tunes/
    ambience/             # filmcow, tommusic, nox-flows, butterfly
  movement/sfx/           # filmcow-footsteps, nox-footsteps
  combat/sfx/             # 400-sounds-combat
  inventory/sfx/          # 400-sounds-items, filmcow-recorded
  home/sfx/               # fantasy-ui
```

**Rules**

- Kebab-case folder names; no spaces in shipped paths.
- Shipped audio under `public/` is Opus-in-`.ogg` (24k mono SFX, 48k mono loops). Re-encode with `scripts/compressingPublicAudioToOpus.ps1`; WAV masters live in `assets/source/audio-masters/`.
- Shipped sprite sheets under `public/` are lossless `.webp` (run `pnpm run compress:public-webp` after adding PNG exports).
- No `.zip`, `.rar`, or vendor dumps here.
- Animal avatar skins (husky, grizzly, etc.) reuse `creatures/sprites/species/` sheets; no duplicate copies under `playable/`.
- Register every family in a `defining*` module (`*_ASSET_BASE_URL`). Components resolve URLs through `resolving*Url` helpers; do not hardcode deep paths in UI.

**Bundled separately (not under `public/`)**

- Inventory tool icons: `src/client/world/inventory/assets/tools-icons/` via Vite `?url`
- UI fonts: `src/client/assets/fonts/`
- Home screen mountain SVG: `src/client/assets/home/`

## `assets/source/` (editor originals)

High-res sheets, aseprite files, and unused tile packs kept out of the upload. See per-pack README files (e.g. `assets/source/firelands/`, `assets/source/tools-8dir/`).

## `assets/inbox/` (staging)

New vendor downloads land here first. Extract, pick runtime files, then promote into the matching `public/<domain>/` subtree when wired in code.

## Adding assets

1. Drop vendor archive or folder in `assets/inbox/`.
2. Export runtime-sized files into the correct `public/<domain>/` subtree.
3. Add or extend a `defining*` registry with the new `*_ASSET_BASE_URL`.
4. Update matching `gameplay/mechanics/*/catalog.md` if player-facing.
5. Run asset existence tests (`checkingWildlifeSpeciesSfxPublicAssets`, URL resolver tests).
