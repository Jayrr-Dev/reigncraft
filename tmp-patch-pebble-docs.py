from pathlib import Path

p = Path(r"gameplay/mechanics/harvest/mechanics.md")
t = p.read_text(encoding="utf-8")
old = (
    "Pebbles scatter in every biome except Firelands (and water/shore tiles). "
    "Off-rocky density uses `DEFINING_WORLD_PLAZA_VEGETATION_STONE_NOISE_MIN` (**0.58**); "
    "rocky biome stays denser at **0.4**. Floor draw uses `drawsStoneDecorations` on all performance tiers."
)
new = (
    "Pebbles scatter in every biome except Firelands (and water/shore tiles). "
    "Off-rocky noise min **0.58**; rocky floor pebbles **0.64** (sparser than mega-boulders, which stay at **0.4**). "
    "Seeded on-tile jitter ±**20**/±**10** px. Floor draw uses `drawsStoneDecorations` on all performance tiers."
)
if old not in t:
    raise SystemExit("old text missing")
p.write_text(t.replace(old, new, 1), encoding="utf-8")
print("ok")
