class Tile {
    
    constructor(tileType) {
        this.tileType = tileType;
        this.walkable = this.isWalkable();
        this.west = null;
        this.east = null;
        this.north = null;
        this.south = null;
        this.x = null;
        this.y = null;    
    }

    isWalkable() {
        if(this.tileType === "floor"){
            return true;
        } else if (this.tileType === "exit") {
            return true;
        } else {
            return false;
        }
    }

    setNorth(newNorth){
        this.north = newNorth;
    }
    setTileType(newTileType){
        this.tileType = newTileType;
    }
}

export default Tile;

