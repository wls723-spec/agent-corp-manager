export const CONFIG = {
    // 렌더링될 타일 하나의 크기 (픽셀)
    TILE_SIZE: 32,

    // 게임 화면(캔버스)에 보여질 격자 크기
    VIEWPORT_WIDTH_TILES: 25,
    VIEWPORT_HEIGHT_TILES: 15,

    // 실제 캔버스의 너비, 높이
    get CANVAS_WIDTH() {
        return this.VIEWPORT_WIDTH_TILES * this.TILE_SIZE;
    },
    get CANVAS_HEIGHT() {
        return this.VIEWPORT_HEIGHT_TILES * this.TILE_SIZE;
    },

    // 전체 맵 크기 (타일 개수)
    MAP_WIDTH_TILES: 50,
    MAP_HEIGHT_TILES: 50,

    // 캐릭터 이동 속도 (타일 단위 이동, 초당 픽셀 이동이 아니라 다음 타일로 가기까지 걸리는 프레임 속도 등을 위해)
    // 값이 작을수록 빠릅니다 (이동 보간에 사용).
    MOVEMENT_SPEED_MS: 150
};
