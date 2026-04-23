import { CONFIG } from '../config/constants';
import { AssetManager } from './AssetManager';
import { GameMap } from '../world/GameMap';
import { Player } from '../entities/Player';

export class Renderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;

        if (!this.canvas) {
            throw new Error(`Canvas element with id ${canvasId} not found`);
        }

        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Failed to get 2D context from canvas');
        }

        this.ctx = context;
        this.resize();

        window.addEventListener('resize', () => this.resize());
    }

    private resize(): void {
        const dpr = window.devicePixelRatio || 1;

        // 캔버스의 실제 해상도 설정
        this.canvas.width = CONFIG.CANVAS_WIDTH * dpr;
        this.canvas.height = CONFIG.CANVAS_HEIGHT * dpr;

        // 화면에 보여지는 크기 설정
        this.canvas.style.width = `${CONFIG.CANVAS_WIDTH}px`;
        this.canvas.style.height = `${CONFIG.CANVAS_HEIGHT}px`;

        // 픽셀 아트 선명하게 유지
        this.ctx.imageSmoothingEnabled = false;

        // DPR 비율 적용
        this.ctx.scale(dpr, dpr);
    }

    public render(assetManager: AssetManager, gameMap: GameMap, player: Player): void {
        // 화면 지우기
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

        // 카메라 중심을 플레이어에 맞춤
        let cameraX = player.getPixelX() + (CONFIG.TILE_SIZE / 2) - (CONFIG.CANVAS_WIDTH / 2);
        let cameraY = player.getPixelY() + (CONFIG.TILE_SIZE / 2) - (CONFIG.CANVAS_HEIGHT / 2);

        // 카메라가 맵 경계를 벗어나지 않도록 클램핑
        const maxCameraX = (CONFIG.MAP_WIDTH_TILES * CONFIG.TILE_SIZE) - CONFIG.CANVAS_WIDTH;
        const maxCameraY = (CONFIG.MAP_HEIGHT_TILES * CONFIG.TILE_SIZE) - CONFIG.CANVAS_HEIGHT;

        cameraX = Math.max(0, Math.min(cameraX, maxCameraX));
        cameraY = Math.max(0, Math.min(cameraY, maxCameraY));

        // 맵 및 플레이어 그리기
        gameMap.render(this.ctx, assetManager, cameraX, cameraY);
        player.render(this.ctx, assetManager, cameraX, cameraY);
    }
}
