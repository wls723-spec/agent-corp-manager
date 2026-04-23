const fs = require('fs');
const { createCanvas } = require('canvas');

const TILE_SIZE = 32;

// --- Generate Floor Tile ---
function generateFloorTile() {
    const canvas = createCanvas(TILE_SIZE, TILE_SIZE);
    const ctx = canvas.getContext('2d');

    // Base color (office floorish)
    ctx.fillStyle = '#b0c4de';
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

    // Grid lines for tiles
    ctx.strokeStyle = '#a0b4ce';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, TILE_SIZE, TILE_SIZE);

    // Add some simple patterns (dots)
    ctx.fillStyle = '#90a4be';
    ctx.fillRect(4, 4, 4, 4);
    ctx.fillRect(24, 24, 4, 4);
    ctx.fillRect(24, 4, 4, 4);
    ctx.fillRect(4, 24, 4, 4);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./public/assets/floor.png', buffer);
    console.log('Created floor.png');
}

// --- Generate Player Character ---
function generatePlayer() {
    const canvas = createCanvas(TILE_SIZE, TILE_SIZE);
    const ctx = canvas.getContext('2d');

    // Player body
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(6, 6, 20, 20);

    // Player border
    ctx.strokeStyle = '#c92a2a';
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, 20, 20);

    // Player eyes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10, 10, 4, 4);
    ctx.fillRect(18, 10, 4, 4);

    ctx.fillStyle = '#000000';
    ctx.fillRect(11, 11, 2, 2);
    ctx.fillRect(19, 11, 2, 2);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./public/assets/player.png', buffer);
    console.log('Created player.png');
}

generateFloorTile();
generatePlayer();
