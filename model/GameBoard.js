class GameBoard {
    constructor(tileSet, enemyCount) {
        this.GRID_WIDTH = 16;
        this.GRID_HEIGHT = 15;
        this.board = this.createBoard(tileSet);
        this.TILE_SIZE = 40;
        this.ENEMY_COUNT = enemyCount;
    }
    createBoard(tileSet) {
        // Iterater gennem alle vores tiles, og tilføj relationer
        for (let i = 0; i < this.GRID_HEIGHT; i++) {
            for (let j = 0; j < this.GRID_WIDTH; j++) {
                const currentTile = tileSet[i][j];
                currentTile.x = [i];
                currentTile.y = [j];
                if (i > 0) {
                    if (tileSet[i - 1][j].walkable) {
                        // check north
                        currentTile.north = tileSet[i - 1][j];
                    }
                }
                if (j < this.GRID_WIDTH-1) {
                    // check east
                    if (tileSet[i][j + 1].walkable) {
                        currentTile.east = tileSet[i][j + 1];
                    }
                }
                if (i < this.GRID_HEIGHT-1) {
                    // check south
                    if (tileSet[i + 1][j].walkable) {
                        currentTile.south = tileSet[i + 1][j];
                    }
                }
                if (j > 0) {
                    // check west
                    if (tileSet[i][j - 1].walkable) {
                        currentTile.west = tileSet[i][j - 1];
                    }
                }
            }
            // console.log(tileSet);
        }
        return tileSet;
    }
    getTileCoord({ row, col }) {
        return this.board[row][col];
    }

}

export default GameBoard;

