import { AssetManager } from './AssetManager';
import { Renderer } from './Renderer';
import { InputHandler } from './InputHandler';
import { GameMap } from '../world/GameMap';
import { Player } from '../entities/Player';

export class Game {
    private assetManager: AssetManager;
    private renderer: Renderer;
    private inputHandler: InputHandler;
    private gameMap: GameMap;
    private player: Player;

    private lastTime: number = 0;

    constructor() {
        this.assetManager = new AssetManager();
        this.renderer = new Renderer('gameCanvas');
        this.inputHandler = new InputHandler();

        this.gameMap = new GameMap();
        // 플레이어를 맵 가운데에 초기화
        this.player = new Player(25, 25);
    }

    public async init(): Promise<void> {
        // 자산 비동기 로딩
        await Promise.all([
            this.assetManager.loadImage('floor', '/assets/floor.png'),
            this.assetManager.loadImage('player', '/assets/player.png'),
        ]);

        // 루프 시작
        requestAnimationFrame((time) => this.loop(time));
    }

    private loop(currentTime: number): void {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame((time) => this.loop(time));
    }

    private update(deltaTime: number): void {
        // 입력에 따른 이동 요청
        const { dx, dy } = this.inputHandler.getMovementVector();
        this.player.tryMove(dx, dy, this.gameMap);

        // 플레이어 상태 업데이트 (이동 보간 등)
        this.player.update(deltaTime);
    }

    private render(): void {
        this.renderer.render(this.assetManager, this.gameMap, this.player);
    }
}
