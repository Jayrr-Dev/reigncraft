import fs from 'node:fs';

const html = fs.readFileSync(
  'C:/Users/Main/.cursor/projects/c-Users-Main-Documents-Reddit-reigncraft/agent-tools/codepen-mountains.html',
  'utf8'
);
const match = html.match(/<svg xmlns=&quot;[\s\S]*?<\/svg>/);
if (!match) {
  console.error('SVG not found');
  process.exit(1);
}

const svg = match[0]
  .replaceAll('&quot;', '"')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&amp;', '&');

const outPath =
  'src/client/components/home/assets/plazaHomeScreenMountainScene.svg';
fs.mkdirSync('src/client/components/home/assets', { recursive: true });
fs.writeFileSync(outPath, svg);

const mountainIds = [...svg.matchAll(/id="(mountain-\d+)"/g)].map((m) => m[1]);
console.log('written', outPath, 'bytes', svg.length, 'mountains', mountainIds);
