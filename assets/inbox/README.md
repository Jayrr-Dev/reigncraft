# Asset inbox (not shipped)

Vendor packs, archives, and unused extracts land here first. They are **not** copied into the Devvit webview bundle.

When you wire assets into gameplay:

1. Extract or export only the files you need.
2. Place runtime-sized assets under the matching `public/<domain>/` subtree.
3. Register paths in a `defining*` module (`*_ASSET_BASE_URL`).
4. Keep aseprite / hi-res originals in `assets/source/` when applicable.

Do not put `.zip`, `.rar`, or unreferenced dumps back under `public/`.
