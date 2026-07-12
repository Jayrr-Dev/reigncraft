/**
 * Bulk-update gameplay/docs path cites after domain-first public/ migration.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

const replacements = [
  ['public/sprites/wildlife/', 'public/creatures/sprites/species/'],
  ['/sprites/wildlife/', '/creatures/sprites/species/'],
  [
    'public/sprites/avatars/girl-sample/',
    'public/creatures/sprites/playable/girl-sample/',
  ],
  ['/sprites/avatars/girl-sample', '/creatures/sprites/playable/girl-sample'],
  ['public/sprites/tools-8dir/', 'public/harvest/sprites/'],
  ['/sprites/tools-8dir/', '/harvest/sprites/'],
  ['public/sprites/firelands/', 'public/fire/sprites/props/'],
  ['/sprites/firelands/', '/fire/sprites/props/'],
  ['public/audio/sfx/campfire/', 'public/fire/sfx/campfire/'],
  ['/audio/sfx/campfire/', '/fire/sfx/campfire/'],
  [
    'public/audio/sfx/filmcow-equipment/',
    'public/harvest/sfx/filmcow-equipment/',
  ],
  [
    'public/audio/sfx/filmcow-recorded/',
    'public/inventory/sfx/filmcow-recorded/',
  ],
  ['/audio/sfx/filmcow-recorded/', '/inventory/sfx/filmcow-recorded/'],
  [
    'public/audio/sfx/400-sounds-items/',
    'public/inventory/sfx/400-sounds-items/',
  ],
  ['/audio/sfx/400-sounds-items/', '/inventory/sfx/400-sounds-items/'],
  [
    'public/audio/sfx/400-sounds-combat/',
    'public/combat/sfx/400-sounds-combat/',
  ],
  ['/audio/sfx/400-sounds-combat/', '/combat/sfx/400-sounds-combat/'],
  [
    'public/audio/sfx/filmcow-footsteps/',
    'public/movement/sfx/filmcow-footsteps/',
  ],
  ['/audio/sfx/filmcow-footsteps/', '/movement/sfx/filmcow-footsteps/'],
  ['public/audio/sfx/nox-footsteps/', 'public/movement/sfx/nox-footsteps/'],
  ['/audio/sfx/nox-footsteps/', '/movement/sfx/nox-footsteps/'],
  ['public/audio/sfx/fantasy-ui/', 'public/home/sfx/fantasy-ui/'],
  ['/audio/sfx/fantasy-ui/', '/home/sfx/fantasy-ui/'],
  ['public/audio/music/cozy-tunes/', 'public/environment/music/cozy-tunes/'],
  ['/audio/music/cozy-tunes/', '/environment/music/cozy-tunes/'],
  ['public/audio/sfx/werewolf/', 'public/creatures/sfx/vocals/werewolf/'],
  ['/audio/sfx/werewolf/', '/creatures/sfx/vocals/werewolf/'],
  ['public/audio/sfx/farm-animal/', 'public/creatures/sfx/vocals/farm-animal/'],
  ['/audio/sfx/farm-animal/', '/creatures/sfx/vocals/farm-animal/'],
  ['public/audio/sfx/beast/', 'public/creatures/sfx/vocals/beast/'],
  ['/audio/sfx/beast/', '/creatures/sfx/vocals/beast/'],
  ['public/audio/sfx/mixkit-wild/', 'public/creatures/sfx/vocals/mixkit-wild/'],
  ['/audio/sfx/mixkit-wild/', '/creatures/sfx/vocals/mixkit-wild/'],
  [
    'public/audio/sfx/pixabay-wild/',
    'public/creatures/sfx/vocals/pixabay-wild/',
  ],
  ['/audio/sfx/pixabay-wild/', '/creatures/sfx/vocals/pixabay-wild/'],
  [
    'public/audio/sfx/girl-sample-voice/',
    'public/creatures/sfx/voice/girl-sample-voice/',
  ],
  ['/audio/sfx/girl-sample-voice/', '/creatures/sfx/voice/girl-sample-voice/'],
];

const files = [
  'assets/inbox/README.md',
  'assets/source/firelands/README.md',
  'assets/source/tools-8dir/README.md',
  'gameplay/mechanics/characters/catalog.md',
  'gameplay/mechanics/movement-stamina/README.md',
  'gameplay/mechanics/movement-stamina/catalog.md',
  'gameplay/mechanics/movement-stamina/glossary.md',
  'gameplay/mechanics/movement-stamina/mechanics.md',
  'gameplay/mechanics/fire/catalog.md',
  'gameplay/mechanics/fire/glossary.md',
  'gameplay/mechanics/fire/mechanics.md',
  'gameplay/mechanics/wildlife/glossary.md',
  'gameplay/mechanics/wildlife/sfx-catalog.md',
  'gameplay/mechanics/wildlife/mechanics.md',
  'gameplay/mechanics/harvest/catalog.md',
  'gameplay/mechanics/harvest/mechanics.md',
  'gameplay/mechanics/fishing/catalog.md',
  'gameplay/mechanics/fishing/mechanics.md',
  'gameplay/mechanics/farming/catalog.md',
  'gameplay/mechanics/farming/mechanics.md',
  'gameplay/mechanics/inventory-food/mechanics.md',
  'gameplay/mechanics/multiplayer/catalog.md',
];

for (const relativePath of files) {
  const filePath = path.join(repoRoot, relativePath);
  let content = await readFile(filePath, 'utf8');
  for (const [from, to] of replacements) {
    content = content.replaceAll(from, to);
  }
  await writeFile(filePath, content);
  console.log('updated', relativePath);
}
