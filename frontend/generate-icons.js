const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const logoPath = path.join(__dirname, '..', 'logo_materre.png');
const outDir = path.join(__dirname, 'src', 'assets', 'icons');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'icon-72x72.png', size: 72 },
  { name: 'icon-96x96.png', size: 96 },
  { name: 'icon-128x128.png', size: 128 },
  { name: 'icon-144x144.png', size: 144 },
  { name: 'icon-152x152.png', size: 152 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-384x384.png', size: 384 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

async function generateIcons() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const metadata = await sharp(logoPath).metadata();
  const w = metadata.width;   // 2816
  const h = metadata.height;  // 1536
  console.log(`Source: ${w}x${h}`);

  // The icon (roof + circle + star + leaves) is in the upper-center portion.
  // Text "maTerre" starts at roughly 62% from top.
  // Icon center is around x=50%, y=38% of the image.
  // Extract a square crop of the icon symbol only (no text).
  const iconHeight = Math.round(h * 0.58); // height of the icon area (no text)
  const iconSize = iconHeight; // square
  const cropLeft = Math.round((w - iconSize) / 2);
  const cropTop = Math.round(h * 0.03);  // small top margin

  console.log(`Cropping icon: left=${cropLeft}, top=${cropTop}, size=${iconSize}x${iconSize}`);

  // Extract the icon portion as a square and remove the beige/grey background
  const extracted = await sharp(logoPath)
    .extract({ left: cropLeft, top: cropTop, width: iconSize, height: iconSize })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = extracted;
  const pixels = Buffer.from(data);

  // Sample the background color from top-left corner
  const bgR = pixels[0], bgG = pixels[1], bgB = pixels[2];
  console.log(`Background color sampled: rgb(${bgR}, ${bgG}, ${bgB})`);

  // Remove background: make pixels close to the background color transparent
  const tolerance = 45;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
    const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
    if (dist < tolerance) {
      pixels[i + 3] = 0; // fully transparent
    } else if (dist < tolerance + 20) {
      // Soft edge: partial transparency for anti-aliasing
      const alpha = Math.round(((dist - tolerance) / 20) * 255);
      pixels[i + 3] = Math.min(pixels[i + 3], alpha);
    }
  }

  const iconBuffer = await sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();

  // Save a debug version to verify the crop
  await sharp(iconBuffer)
    .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(outDir, 'icon-debug-512.png'));
  console.log('Generated icon-debug-512.png for verification');

  // Generate all icon sizes from the cropped icon
  for (const { name, size } of sizes) {
    await sharp(iconBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(outDir, name));
    console.log(`Generated ${name} (${size}x${size})`);
  }

  // Favicon (32x32 PNG as .ico)
  await sharp(iconBuffer)
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(__dirname, 'src', 'favicon.ico'));
  console.log('Generated favicon.ico (icon only)');

  // Logo with text — also remove background
  const logoFull = await sharp(logoPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const logoPx = Buffer.from(logoFull.data);
  const logoBgR = logoPx[0], logoBgG = logoPx[1], logoBgB = logoPx[2];
  for (let i = 0; i < logoPx.length; i += 4) {
    const r = logoPx[i], g = logoPx[i + 1], b = logoPx[i + 2];
    const dist = Math.sqrt((r - logoBgR) ** 2 + (g - logoBgG) ** 2 + (b - logoBgB) ** 2);
    if (dist < tolerance) {
      logoPx[i + 3] = 0;
    } else if (dist < tolerance + 20) {
      const alpha = Math.round(((dist - tolerance) / 20) * 255);
      logoPx[i + 3] = Math.min(logoPx[i + 3], alpha);
    }
  }
  const logoCleanBuffer = await sharp(logoPx, { raw: { width: logoFull.info.width, height: logoFull.info.height, channels: 4 } })
    .png()
    .toBuffer();
  await sharp(logoCleanBuffer)
    .resize(400, 400, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(outDir, 'logo.png'));
  console.log('Generated logo.png (full logo with text, transparent bg, 400x400)');

  // Icon only at 400px for hero visual
  await sharp(iconBuffer)
    .resize(400, 400, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(outDir, 'icon.png'));
  console.log('Generated icon.png (icon only, 400x400)');

  // OG image — clean logo on dark green background
  await sharp(logoCleanBuffer)
    .resize(1200, 630, { fit: 'contain', background: { r: 27, g: 67, b: 50, alpha: 255 } })
    .png()
    .toFile(path.join(outDir, 'og-image.png'));
  console.log('Generated og-image.png (1200x630)');
}

generateIcons().then(() => console.log('\nAll icons generated!')).catch(console.error);
