class GameBoard {
    constructor(tileSet, enemyCount) {
        this.board = this.createBoard(tileSet);
        this.GRID_WIDTH = 16;
        this.GRID_HEIGHT = 15;
        this.TILE_SIZE = 40;
        this.ENEMY_COUNT = enemyCount;
    }
    createBoard(tileSet) {
        return tileSet;
    }
    getTileCoord({row, col}){
        return this.board[row][col];
    }

}

export default GameBoard;

