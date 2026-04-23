export class InputHandler {
    private keys: Record<string, boolean> = {};

    private touchStartX: number = 0;
    private touchStartY: number = 0;
    private swipeDirX: number = 0;
    private swipeDirY: number = 0;
    private hasSwipe: boolean = false;

    constructor() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // 모바일 터치 이벤트
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
            canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
            canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        }
    }

    private handleTouchStart(e: TouchEvent) {
        e.preventDefault(); // 스크롤 방지
        if (e.touches.length > 0 && e.touches[0]) {
            const touch = e.touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
        }
        this.hasSwipe = false;
        this.swipeDirX = 0;
        this.swipeDirY = 0;
    }

    private handleTouchMove(e: TouchEvent) {
        e.preventDefault(); // 스크롤 방지
        if (!this.touchStartX || !this.touchStartY) return;
        if (e.touches.length === 0 || !e.touches[0]) return;

        const touch = e.touches[0];
        const touchEndX = touch.clientX;
        const touchEndY = touch.clientY;

        const dx = touchEndX - this.touchStartX;
        const dy = touchEndY - this.touchStartY;

        // 약간의 임계값 적용 (스치듯 터치하는것 방지)
        if (Math.abs(dx) > 20 || Math.abs(dy) > 20) {
            if (Math.abs(dx) > Math.abs(dy)) {
                // 수평 이동
                this.swipeDirX = dx > 0 ? 1 : -1;
                this.swipeDirY = 0;
            } else {
                // 수직 이동
                this.swipeDirX = 0;
                this.swipeDirY = dy > 0 ? 1 : -1;
            }
            this.hasSwipe = true;

            // 스와이프를 한번 적용한 뒤 시작점 초기화 (연속 스와이프 처리를 위해)
            this.touchStartX = touchEndX;
            this.touchStartY = touchEndY;
        }
    }

    private handleTouchEnd(e: TouchEvent) {
        // 손을 떼면 스와이프 상태 초기화
        this.hasSwipe = false;
        this.swipeDirX = 0;
        this.swipeDirY = 0;
    }

    public getMovementVector(): { dx: number, dy: number } {
        let dx = 0;
        let dy = 0;

        // 키보드 우선
        if (this.keys['ArrowUp'] || this.keys['w']) dy -= 1;
        else if (this.keys['ArrowDown'] || this.keys['s']) dy += 1;
        else if (this.keys['ArrowLeft'] || this.keys['a']) dx -= 1;
        else if (this.keys['ArrowRight'] || this.keys['d']) dx += 1;

        // 키보드 입력이 없다면 스와이프 입력 확인
        if (dx === 0 && dy === 0 && this.hasSwipe) {
            dx = this.swipeDirX;
            dy = this.swipeDirY;
        }

        return { dx, dy };
    }
}
