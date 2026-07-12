/**
 * One-shot migration: media-type public/ → domain-first layout.
 * Run from repo root: node scripts/migratePublicDomainFirst.mjs
 */
import { cp, mkdir, readdir, rename, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const publicDir = path.join(repoRoot, 'public');

function toKebabCase(name) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

async function ensureDir(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

async function moveDirectory(sourcePath, destPath) {
  await ensureDir(path.dirname(destPath));
  try {
    await rename(sourcePath, destPath);
  } catch {
    await cp(sourcePath, destPath, { recursive: true });
    await rm(sourcePath, { recursive: true, force: true });
  }
}

async function moveContents(sourceDir, destDir) {
  await ensureDir(destDir);
  const entries = await readdir(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    await moveDirectory(
      path.join(sourceDir, entry.name),
      path.join(destDir, entry.name)
    );
  }
}

async function migrateWildlifeSpecies() {
  const wildlifeDir = path.join(publicDir, 'sprites', 'wildlife');
  const speciesDir = path.join(publicDir, 'creatures', 'sprites', 'species');
  await ensureDir(speciesDir);

  const folders = await readdir(wildlifeDir, { withFileTypes: true });
  for (const folder of folders) {
    if (!folder.isDirectory()) continue;
    const kebab = toKebabCase(folder.name);
    await moveDirectory(
      path.join(wildlifeDir, folder.name),
      path.join(speciesDir, kebab)
    );
  }
  await rm(wildlifeDir, { recursive: true, force: true });
}

async function migratePlayableAvatars() {
  const avatarsDir = path.join(publicDir, 'sprites', 'avatars');
  const playableDir = path.join(publicDir, 'creatures', 'sprites', 'playable');
  await ensureDir(playableDir);

  const keepPlayable = ['girl-sample'];
  const deleteDuplicates = [
    'husky',
    'grizzly',
    'golden-retriever',
    'cat-orange',
    'pinguin',
  ];

  for (const skin of keepPlayable) {
    const source = path.join(avatarsDir, skin);
    try {
      await stat(source);
      await moveDirectory(source, path.join(playableDir, skin));
    } catch {
      console.warn(`skip missing playable avatar: ${skin}`);
    }
  }

  for (const skin of deleteDuplicates) {
    const duplicate = path.join(avatarsDir, skin);
    try {
      await stat(duplicate);
      await rm(duplicate, { recursive: true, force: true });
      console.log(`deleted duplicate avatar: ${skin}`);
    } catch {
      console.warn(`skip missing duplicate avatar: ${skin}`);
    }
  }

  await rm(avatarsDir, { recursive: true, force: true });
}

async function migrateCreatureSfx() {
  const sfxBase = path.join(publicDir, 'audio', 'sfx');
  const vocalsDir = path.join(publicDir, 'creatures', 'sfx', 'vocals');
  const voiceDir = path.join(publicDir, 'creatures', 'sfx', 'voice');

  const vocalPacks = [
    'beast',
    'farm-animal',
    'mixkit-wild',
    'pixabay-wild',
    'werewolf',
  ];

  for (const pack of vocalPacks) {
    await moveDirectory(path.join(sfxBase, pack), path.join(vocalsDir, pack));
  }

  await moveDirectory(
    path.join(sfxBase, 'girl-sample-voice'),
    path.join(voiceDir, 'girl-sample-voice')
  );
}

async function migrateFire() {
  const fireSprites = path.join(publicDir, 'fire', 'sprites');
  await moveDirectory(
    path.join(publicDir, 'sprites', 'firelands'),
    path.join(fireSprites, 'props')
  );

  const vfxDir = path.join(fireSprites, 'vfx');
  await ensureDir(vfxDir);
  await moveDirectory(
    path.join(publicDir, 'sprites', 'vfx', 'fire-flame'),
    path.join(vfxDir, 'fire-flame')
  );
  await moveDirectory(
    path.join(publicDir, 'sprites', 'vfx', 'fire-smoke'),
    path.join(vfxDir, 'fire-smoke')
  );

  await moveDirectory(
    path.join(publicDir, 'audio', 'sfx', 'campfire'),
    path.join(publicDir, 'fire', 'sfx', 'campfire')
  );
}

async function migrateHarvest() {
  const harvestSprites = path.join(publicDir, 'harvest', 'sprites');
  await moveContents(
    path.join(publicDir, 'sprites', 'tools-8dir'),
    harvestSprites
  );
  await rm(path.join(publicDir, 'sprites', 'tools-8dir'), {
    recursive: true,
    force: true,
  });

  await moveDirectory(
    path.join(publicDir, 'audio', 'sfx', 'filmcow-equipment'),
    path.join(publicDir, 'harvest', 'sfx', 'filmcow-equipment')
  );
}

async function migrateEnvironment() {
  await moveDirectory(
    path.join(publicDir, 'audio', 'music', 'cozy-tunes'),
    path.join(publicDir, 'environment', 'music', 'cozy-tunes')
  );

  const ambienceDir = path.join(publicDir, 'environment', 'ambience');
  const ambiencePacks = [
    'filmcow-ambience',
    'tommusic-ambience',
    'nox-flows-ambience',
    'butterfly-ambience',
  ];

  for (const pack of ambiencePacks) {
    await moveDirectory(
      path.join(publicDir, 'audio', 'sfx', pack),
      path.join(ambienceDir, pack)
    );
  }
}

async function migrateMovement() {
  const movementSfx = path.join(publicDir, 'movement', 'sfx');
  await moveDirectory(
    path.join(publicDir, 'audio', 'sfx', 'filmcow-footsteps'),
    path.join(movementSfx, 'filmcow-footsteps')
  );
  await moveDirectory(
    path.join(publicDir, 'audio', 'sfx', 'nox-footsteps'),
    path.join(movementSfx, 'nox-footsteps')
  );
}

async function migrateCombat() {
  await moveDirectory(
    path.join(publicDir, 'audio', 'sfx', '400-sounds-combat'),
    path.join(publicDir, 'combat', 'sfx', '400-sounds-combat')
  );
}

async function migrateInventory() {
  const inventorySfx = path.join(publicDir, 'inventory', 'sfx');
  await moveDirectory(
    path.join(publicDir, 'audio', 'sfx', '400-sounds-items'),
    path.join(inventorySfx, '400-sounds-items')
  );
  await moveDirectory(
    path.join(publicDir, 'audio', 'sfx', 'filmcow-recorded'),
    path.join(inventorySfx, 'filmcow-recorded')
  );
}

async function migrateHome() {
  await moveDirectory(
    path.join(publicDir, 'audio', 'sfx', 'fantasy-ui'),
    path.join(publicDir, 'home', 'sfx', 'fantasy-ui')
  );
}

async function cleanupOldRoots() {
  for (const stale of [
    path.join(publicDir, 'sprites'),
    path.join(publicDir, 'audio'),
  ]) {
    try {
      const entries = await readdir(stale);
      if (entries.length === 0) {
        await rm(stale, { recursive: true, force: true });
      } else {
        console.warn(`stale root not empty, manual check: ${stale}`, entries);
      }
    } catch {
      // already removed
    }
  }
}

async function main() {
  console.log('Migrating public/ to domain-first layout...');
  await migrateWildlifeSpecies();
  await migratePlayableAvatars();
  await migrateCreatureSfx();
  await migrateFire();
  await migrateHarvest();
  await migrateEnvironment();
  await migrateMovement();
  await migrateCombat();
  await migrateInventory();
  await migrateHome();
  await cleanupOldRoots();
  console.log('Migration complete.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
