import fs from 'fs';
import zlib from 'zlib';

function createPng(width, height, bgColor, drawBook) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth 8
  ihdrData.writeUInt8(6, 9); // color type 6: RGBA
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw image data: filter byte (0) + width * 4 bytes per row
  const rowStride = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowStride);

  // Background color #141311
  const [br, bg, bb] = bgColor;
  const gold = [194, 162, 100]; // #c2a264

  for (let y = 0; y < height; y++) {
    const rowStart = y * rowStride;
    rawData[rowStart] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pixelStart = rowStart + 1 + x * 4;
      
      // Draw simple book / codex pattern in gold
      const nx = x / width;
      const ny = y / height;
      const isBorder = (x < 6 || x >= width - 6 || y < 6 || y >= height - 6);
      const isInnerBorder = (x === 12 || x === width - 13 || y === 12 || y === height - 13);
      const isCenterSpine = (Math.abs(nx - 0.5) < 0.015 && ny > 0.15 && ny < 0.85);
      const isBookShape = (ny > 0.3 && ny < 0.8 && Math.abs(nx - 0.5) < 0.35 && (Math.abs(nx - 0.5) > 0.03));
      const isDiamond = Math.abs(nx - 0.5) + Math.abs(ny - 0.28) < 0.04;

      if (isBorder || isInnerBorder || isCenterSpine || isDiamond || (isBookShape && (Math.sin(ny * 40) > 0.7 || ny > 0.75))) {
        rawData[pixelStart] = gold[0];
        rawData[pixelStart + 1] = gold[1];
        rawData[pixelStart + 2] = gold[2];
        rawData[pixelStart + 3] = 255;
      } else {
        rawData[pixelStart] = br;
        rawData[pixelStart + 1] = bg;
        rawData[pixelStart + 2] = bb;
        rawData[pixelStart + 3] = 255;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ -1) >>> 0;
}

const crcTable = new Int32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c;
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const typeAndData = Buffer.concat([typeBuf, data]);

  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);

  return Buffer.concat([len, typeAndData, crc]);
}

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

fs.writeFileSync('public/pwa-192x192.png', createPng(192, 192, [20, 19, 17], true));
fs.writeFileSync('public/pwa-512x512.png', createPng(512, 512, [20, 19, 17], true));
fs.writeFileSync('public/pwa-maskable-512x512.png', createPng(512, 512, [20, 19, 17], true));
fs.writeFileSync('public/apple-touch-icon.png', createPng(180, 180, [20, 19, 17], true));
console.log('Icons generated successfully.');
