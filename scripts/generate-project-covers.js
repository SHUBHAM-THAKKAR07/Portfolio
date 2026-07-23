const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = path.join(__dirname, '..', 'assets', 'images', 'projects');

const projects = [
  {
    dir: 'project-01-checkedin',
    title: 'CheckedIn',
    subtitle: 'Event Management + QR Attendance',
    badge: '1st Place — Hackathon',
  },
  {
    dir: 'project-02-assetflow',
    title: 'AssetFlow',
    subtitle: 'Odoo Asset Tracking Module',
    badge: 'Odoo Hackathon — Results Pending',
  },
  {
    dir: 'project-03-cozastore',
    title: 'CozaStore',
    subtitle: 'Full E-commerce Platform',
    badge: 'Internship Project',
  },
];

function svgCover(p) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A0A0B"/>
      <stop offset="100%" stop-color="#131316"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#g)"/>

  <!-- accent line top -->
  <rect x="80" y="80" width="120" height="4" fill="#7CFF6B"/>
  <text x="80" y="130" font-family="'JetBrains Mono','Consolas',monospace" font-size="16" font-weight="600" fill="#7CFF6B" letter-spacing="2">// PROJECT</text>

  <!-- title -->
  <text x="80" y="380" font-family="'Fraunces','Georgia',serif" font-size="96" font-weight="700" fill="#F5F5F4">${p.title}</text>
  <text x="80" y="440" font-family="'Inter','Helvetica',sans-serif" font-size="28" font-weight="300" fill="#8B8B92">${p.subtitle}</text>

  <!-- badge bottom -->
  <rect x="80" y="660" width="${p.badge.length * 8 + 32}" height="40" rx="20" fill="none" stroke="#1F1F23" stroke-width="1.5"/>
  <text x="96" y="686" font-family="'JetBrains Mono','Consolas',monospace" font-size="14" font-weight="500" fill="#8B8B92">${p.badge}</text>

  <!-- decorative dots -->
  <circle cx="1080" cy="160" r="40" fill="none" stroke="#1F1F23" stroke-width="1.5"/>
  <circle cx="1080" cy="160" r="24" fill="none" stroke="#1F1F23" stroke-width="1.5"/>
  <circle cx="1080" cy="160" r="8" fill="#7CFF6B"/>

  <!-- bottom accent bar -->
  <rect x="80" y="740" width="${1200 - 160}" height="2" fill="#1F1F23"/>
</svg>`;
}

async function main() {
  for (const p of projects) {
    const dir = path.join(PROJECTS_DIR, p.dir);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const svg = Buffer.from(svgCover(p));

    await sharp(svg)
      .jpeg({ quality: 85 })
      .toFile(path.join(dir, 'cover.jpg'));
    console.log('  OK  ' + p.dir + '/cover.jpg (1200x800)');
  }
  console.log('\nAll project covers generated.');
}

main().catch(function (e) { console.error(e); process.exit(1); });
