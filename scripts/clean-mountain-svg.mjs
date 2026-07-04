import fs from 'node:fs';

const svgPath =
  'src/client/components/home/assets/plazaHomeScreenMountainScene.svg';
let svg = fs.readFileSync(svgPath, 'utf8');

svg = svg
  .replace(/<g id="sun-burst">[\s\S]*?<\/g>/, '')
  .replace(/id="scene-1"/, 'id="plaza-mountain-scene"')
  .replace(
    /preserveAspectRatio="xMinYMin slice"/,
    'preserveAspectRatio="xMidYMax slice"'
  );

fs.writeFileSync(svgPath, svg);
console.log('cleaned svg bytes', svg.length);
