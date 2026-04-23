import { CONFIG } from '../config/constants';
import { AssetManager } from '../core/AssetManager';
import { GameMap } from '../world/GameMap';

export class Player {
    private gridX: number;
    private gridY: number;

    // 보간 렌더링을 위한 픽셀 위치
    private pixelX: number;
    private pixelY: number;

    private isMoving: boolean = false;
    private moveTimer: number = 0;

    // 이동 시작과 끝 좌표
    private startX: number = 0;
    private startY: number = 0;
    private targetX: number = 0;
    private targetY: number = 0;

    constructor(startX: number, startY: number) {
        this.gridX = startX;
        this.gridY = startY;
        this.pixelX = this.gridX * CONFIG.TILE_SIZE;
        this.pixelY = this.gridY * CONFIG.TILE_SIZE;
    }

    public getPixelX(): number {
        return this.pixelX;
    }

    public getPixelY(): number {
        return this.pixelY;
    }

    public tryMove(dx: number, dy: number, gameMap: GameMap): void {
        if (this.isMoving) return; // 이미 이동 중이면 무시
        if (dx === 0 && dy === 0) return; // 이동 안함

        // 대각선 이동 방지
        if (Math.abs(dx) > 0 && Math.abs(dy) > 0) return;

        const nextGridX = this.gridX + dx;
        const nextGridY = this.gridY + dy;

        if (gameMap.isWalkable(nextGridX, nextGridY)) {
            // 이동 시작
            this.isMoving = true;
            this.moveTimer = 0;

            this.startX = this.pixelX;
            this.startY = this.pixelY;

            this.gridX = nextGridX;
            this.gridY = nextGridY;

            this.targetX = this.gridX * CONFIG.TILE_SIZE;
            this.targetY = this.gridY * CONFIG.TILE_SIZE;
        }
    }

    public update(deltaTime: number): void {
        if (this.isMoving) {
            this.moveTimer += deltaTime;

            // 이동 진행률 (0.0 ~ 1.0)
            let progress = this.moveTimer / CONFIG.MOVEMENT_SPEED_MS;

            if (progress >= 1.0) {
                progress = 1.0;
                this.isMoving = false; // 이동 완료
            }

            // 선형 보간 (Lerp)
            this.pixelX = this.startX + (this.targetX - this.startX) * progress;
            this.pixelY = this.startY + (this.targetY - this.startY) * progress;
        } else {
            // 안 움직일때 위치 고정
            this.pixelX = this.gridX * CONFIG.TILE_SIZE;
            this.pixelY = this.gridY * CONFIG.TILE_SIZE;
        }
    }

    public render(ctx: CanvasRenderingContext2D, assetManager: AssetManager, cameraX: number, cameraY: number): void {
        const playerImg = assetManager.getImage('player');

        const drawX = Math.round(this.pixelX - cameraX);
        const drawY = Math.round(this.pixelY - cameraY);

        ctx.drawImage(playerImg, drawX, drawY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
    }
}
