import re
from pathlib import Path

reg = Path(
    "src/client/world/wildlife/domains/definingWildlifeSpeciesRegistry.ts"
).read_text(encoding="utf-8")
sfx = Path(
    "src/client/world/wildlife/domains/definingWildlifeSpeciesSfxProfileRegistry.ts"
).read_text(encoding="utf-8")
start = reg.find("DEFINING_WILDLIFE_SPECIES_REGISTRY_BASE")
block = reg[start : reg.find("export const DEFINING_WILDLIFE_SPECIES_REGISTRY")]
species = {
    s.strip("'")
    for s in re.findall(r"\n  ('?[-a-z0-9]+'?): (?:definingWildlife|\{)", block)
}
sfx_block = sfx.split("DEFINING_WILDLIFE_SPECIES_SFX_PROFILE_BY_SPECIES_ID")[1].split(
    "};"
)[0]
sfx_ids = {
    s.strip("'") for s in re.findall(r"\n  ('?[-a-z0-9]+'?): \{", sfx_block)
}
print("missing", sorted(species - sfx_ids))
