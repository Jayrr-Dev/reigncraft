# Farming glossary

| Term                  | Meaning                                                                  |
| --------------------- | ------------------------------------------------------------------------ |
| **Till**              | Hoe action that marks a walkable land tile as farmland (`tilled` phase). |
| **Plant**             | Consumes one wheat seed on a tilled tile; enters `planted` phase.        |
| **Sprout / grow**     | Automatic wall-clock phases before the crop is harvestable.              |
| **Mature**            | Crop ready for scythe harvest.                                           |
| **Scythe harvest**    | Timed channel that grants crop items and clears the tile.                |
| **Farmland tile key** | `"tileX,tileY"` string in local persistence.                             |
