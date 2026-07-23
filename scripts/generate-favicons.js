const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets', 'images', 'misc');
const SVG = path.join(OUT, 'favicon-source.svg');

async function main() {
  const svg = fs.readFileSync(SVG);

  // ── PNG sizes ──
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png',  size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
  ];

  for (const { name, size } of sizes) {
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(path.join(OUT, name));
    console.log('  OK  ' + name + ' (' + size + 'x' + size + ')');
  }

  // ── ICO (multi-size: 16, 32, 48) ──
  const pngToIco = require('png-to-ico');
  const imagesToIco = pngToIco.default || pngToIco.imagesToIco;
  const [buf16, buf32, buf48] = await Promise.all([
    sharp(svg).resize(16, 16).png().toBuffer(),
    sharp(svg).resize(32, 32).png().toBuffer(),
    sharp(svg).resize(48, 48).png().toBuffer(),
  ]);

  const ico = await imagesToIco([buf16, buf32, buf48]);
  fs.writeFileSync(path.join(OUT, 'favicon.ico'), ico);
  console.log('  OK  favicon.ico (16x16, 32x32, 48x48)');

  console.log('\nAll favicons generated in ' + OUT);
}

main().catch(function (err) {
  console.error('Favicon generation failed:', err);
  process.exit(1);
});
