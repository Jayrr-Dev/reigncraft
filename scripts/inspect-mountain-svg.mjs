import fs from 'node:fs';

const svg = fs.readFileSync(
  'src/client/components/home/assets/plazaHomeScreenMountainScene.svg',
  'utf8'
);

for (let index = 1; index <= 11; index += 1) {
  const groupPattern = new RegExp(
    `<g id="mountain-${index}"[^>]*>([\\s\\S]*?)</g>`
  );
  const groupMatch = svg.match(groupPattern);
  if (!groupMatch) {
    console.log(`mountain-${index}: not found`);
    continue;
  }
  const fills = [...groupMatch[1].matchAll(/fill="(#[^"]+)"/g)].map(
    (m) => m[1]
  );
  const uniqueFills = [...new Set(fills)];
  console.log(
    `mountain-${index}: paths=${fills.length} fills=${uniqueFills.join(',')}`
  );
}
