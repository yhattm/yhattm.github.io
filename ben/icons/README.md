# App Icons

This directory contains the app icons for the Business Card Scanner PWA.

## Current Status

SVG source files are available:
- `icon-192.svg` - 192x192 source icon
- `icon-512.svg` - 512x512 source icon

## Converting SVG to PNG

To generate the required PNG icons from the SVG sources, you can use one of these methods:

### Method 1: Using rsvg-convert (recommended)
```bash
# Install librsvg (if not already installed)
# macOS: brew install librsvg
# Ubuntu: sudo apt-get install librsvg2-bin

# Convert icons
rsvg-convert -w 192 -h 192 icon-192.svg -o icon-192.png
rsvg-convert -w 512 -h 512 icon-512.svg -o icon-512.png
```

### Method 2: Using ImageMagick
```bash
# Install ImageMagick (if not already installed)
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# Convert icons
convert icon-192.svg -resize 192x192 icon-192.png
convert icon-512.svg -resize 512x512 icon-512.png
```

### Method 3: Using Node.js (sharp)
```bash
# Install sharp
npm install --save-dev sharp

# Create conversion script
node -e "const sharp = require('sharp'); sharp('icon-192.svg').resize(192, 192).png().toFile('icon-192.png')"
node -e "const sharp = require('sharp'); sharp('icon-512.svg').resize(512, 512).png().toFile('icon-512.png')"
```

### Method 4: Using Online Tools
Upload the SVG files to:
- https://cloudconvert.com/svg-to-png
- https://svgtopng.com/
- https://convertio.co/svg-png/

## Icon Design

The icons feature:
- Blue (#3b82f6) background with rounded corners
- White business card representation
- Contact information lines in varying shades of blue
- Scan/camera indicator in the corner
- Clean, modern design suitable for PWA app icons
