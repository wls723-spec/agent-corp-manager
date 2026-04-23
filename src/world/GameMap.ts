import { CONFIG } from '../config/constants';
import { AssetManager } from '../core/AssetManager';

export class GameMap {
    private width: number;
    private height: number;
    private floorTileKey: string = 'floor';

    // Performance: Cache the static map drawing
    private offscreenCanvas: HTMLCanvasElement | null = null;
    private isPreRendered: boolean = false;

    constructor() {
        this.width = CONFIG.MAP_WIDTH_TILES;
        this.height = CONFIG.MAP_HEIGHT_TILES;
    }

    public isWalkable(gridX: number, gridY: number): boolean {
        // 현재는 장애물이 없으므로 맵 경계 내에만 있으면 이동 가능
        if (gridX < 0 || gridX >= this.width) return false;
        if (gridY < 0 || gridY >= this.height) return false;
        return true;
    }

    private preRender(assetManager: AssetManager): void {
        const floorImg = assetManager.getImage(this.floorTileKey);

        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCanvas.width = this.width * CONFIG.TILE_SIZE;
        this.offscreenCanvas.height = this.height * CONFIG.TILE_SIZE;

        const offCtx = this.offscreenCanvas.getContext('2d');
        if (!offCtx) return;

        // Draw all tiles once to the offscreen canvas
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                offCtx.drawImage(
                    floorImg,
                    col * CONFIG.TILE_SIZE,
                    row * CONFIG.TILE_SIZE,
                    CONFIG.TILE_SIZE,
                    CONFIG.TILE_SIZE
                );
            }
        }
        this.isPreRendered = true;
    }

    public render(ctx: CanvasRenderingContext2D, assetManager: AssetManager, cameraX: number, cameraY: number): void {
        if (!this.isPreRendered) {
            this.preRender(assetManager);
        }

        if (this.offscreenCanvas) {
            // Calculate what part of the pre-rendered canvas to draw
            const sourceX = Math.max(0, cameraX);
            const sourceY = Math.max(0, cameraY);

            // Adjust dimensions if near the edge of the map
            const drawWidth = Math.min(CONFIG.CANVAS_WIDTH, this.offscreenCanvas.width - sourceX);
            const drawHeight = Math.min(CONFIG.CANVAS_HEIGHT, this.offscreenCanvas.height - sourceY);

            ctx.drawImage(
                this.offscreenCanvas,
                sourceX, sourceY, drawWidth, drawHeight,
                0, 0, drawWidth, drawHeight
            );
        } else {
            // Fallback just in case preRender fails
            const floorImg = assetManager.getImage(this.floorTileKey);

            // 현재 카메라에 보이는 영역의 시작, 끝 타일 좌표 계산
            const startCol = Math.max(0, Math.floor(cameraX / CONFIG.TILE_SIZE));
            const endCol = Math.min(this.width, startCol + CONFIG.VIEWPORT_WIDTH_TILES + 1);

            const startRow = Math.max(0, Math.floor(cameraY / CONFIG.TILE_SIZE));
            const endRow = Math.min(this.height, startRow + CONFIG.VIEWPORT_HEIGHT_TILES + 1);

            for (let row = startRow; row < endRow; row++) {
                for (let col = startCol; col < endCol; col++) {
                    const drawX = Math.round(col * CONFIG.TILE_SIZE - cameraX);
                    const drawY = Math.round(row * CONFIG.TILE_SIZE - cameraY);
                    ctx.drawImage(floorImg, drawX, drawY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
                }
            }
        }
    }
}
