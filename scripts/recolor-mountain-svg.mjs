import fs from 'node:fs';

const svgPath =
  'src/client/components/home/assets/plazaHomeScreenMountainScene.svg';
let svg = fs.readFileSync(svgPath, 'utf8');

/**
 * Remap the pen's palette to the poster's sunset/teal scheme:
 * far layers = warm sun haze, mid = cream/terracotta, near = deep teal.
 */
const colorRemap = [
  ['#74ADB7', '#d99a54'], // farthest ridge — melts into gold sky
  ['#3F8FAA', '#c8813f'],
  ['#097EB9', '#b06c3e'],
  ['#F9DCA7', '#eed2a0'], // cream ridge — keep sunlit
  ['#FF7D62', '#cf7444'], // terracotta
  ['#C45353', '#8a5a41'],
  ['#A03743', '#54544b'], // transition into teal foothills
  ['#2D1C0D', '#2c4a52'],
  ['#211308', '#233d45'],
  ['#160B04', '#1a3038'], // two nearest layers share this fill
];

for (const [from, to] of colorRemap) {
  svg = svg.replaceAll(`fill="${from}"`, `fill="${to}"`);
}

fs.writeFileSync(svgPath, svg);
console.log('recolored', svgPath, 'bytes', svg.length);
