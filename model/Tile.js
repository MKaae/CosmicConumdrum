class Tile {
    
    constructor(tileType) {
        this.tileType = tileType;
        this.walkable = this.isWalkable();
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;    
    }

    isWalkable() {
        if(this.tileType === "floor"){
            return true;
        } else {
            return false;
        }

    }
}

export default Tile;

