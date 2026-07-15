# Extract creature catch ids and classify grey vs color for chroma key.
import re
from pathlib import Path

text = Path("src/client/world/fishing/domains/definingWorldPlazaFishingCatchRegistry.ts").read_text(encoding="utf-8")
ids = re.findall(r"creatingCreatureCatch\(\{\s*\n\s*catchId: '([^']+)'", text)

GREY = {
    "freshwater-mussel",
    "stillglass-pike",
    "soft-shell-clam",
    "lake-whitefish",
    "cold-water-shrimp",
    "ladder-rime-char",
    "channel-catfish",
    "freshwater-drum",
    "carnegus-gravel-ray",
    "burbot",
    "creek-chub",
    "freshwater-snail",
    "skipstone-minnow",
    "arctic-grayling",
    "ice-rill-shrimp",
    "rime-sprig-goby",
    "fathead-minnow",
    "uncored-leechfish",
    "striped-bass",  # silvery
}

print(f"creatures={len(ids)}")
for i, catch_id in enumerate(ids):
    key = "blue" if catch_id in GREY else "grey"
    print(f"{i:02d}\t{key}\t{catch_id}")

Path("tmp/fish-sprites").mkdir(parents=True, exist_ok=True)
Path("tmp/fish-sprites/creature-order.txt").write_text("\n".join(ids) + "\n", encoding="utf-8")
Path("tmp/fish-sprites/greyish-ids.txt").write_text(
    "\n".join(x for x in ids if x in GREY) + "\n", encoding="utf-8"
)
