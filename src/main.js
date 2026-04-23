import { Game } from './core/Game';
// 게임을 실행합니다
window.addEventListener('DOMContentLoaded', async () => {
    const game = new Game();
    try {
        await game.init();
        console.log("Game initialized successfully");
    }
    catch (err) {
        console.error("Failed to initialize the game:", err);
    }
});
//# sourceMappingURL=main.js.map