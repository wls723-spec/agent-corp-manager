import { CONFIG } from '../config/constants';
import { AssetManager } from '../core/AssetManager';

export class GameMap {
    private width: number;
    private height: number;
    private floorTileKey: string = 'floor';

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

    public render(ctx: CanvasRenderingContext2D, assetManager: AssetManager, cameraX: number, cameraY: number): void {
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
