class Tile {
    
    constructor(tileType) {
        this.tileType = tileType;
        this.tileImage = this.tileImage();
        this.walkAble = this.walkAble();    
    }

    tileImage() {
      let tileImage;
      tileImage = "../assets/tiles/" + this.tileType + ".png";
      return tileImage;
    }

    walkAble() {
        if(this.tileType === "floor"){
            return true;
        }
        return false;
    }
}

export default Tile;

