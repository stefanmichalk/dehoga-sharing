const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Create a 32x32 PNG with simple square design
const width = 32;
const height = 32;
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#EC4899"/>
</svg>`;

// Convert SVG to ICO
sharp(Buffer.from(svg))
  .resize(32, 32)
  .toFormat('png')
  .toBuffer()
  .then(data => {
    // Save as ICO
    sharp(data)
      .toFile(path.join(__dirname, '../src/favicon.ico'))
      .then(() => console.log('favicon.ico generated successfully'))
      .catch(err => console.error('Error generating ICO:', err));

    // Also save the SVG
    fs.writeFileSync(path.join(__dirname, '../src/favicon.svg'), svg);
  })
  .catch(err => console.error('Error:', err));
