const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#5551FF');
  gradient.addColorStop(1, '#7B61FF');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Border radius effect (simple square for now)
  
  // F letter
  ctx.fillStyle = 'white';
  ctx.font = `bold ${Math.floor(size * 0.65)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('F', size/2, size/2);
  
  // Save
  const buffer = canvas.toBuffer('image/png');
  const filename = path.join(__dirname, '..', `icon${size}.png`);
  fs.writeFileSync(filename, buffer);
  console.log(`✓ Created icon${size}.png`);
}

// Generate all icon sizes
[16, 48, 128].forEach(size => generateIcon(size));
console.log('\n✅ All icons generated successfully!');
