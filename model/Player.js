class Player{
    constructor(){
        this.x = 266,
        this.y = 540,
        this.regX = 15,
        this.regY = 20,
        this.hitbox = {
            x: 10,
            y: 11,
            w: 13,
            h: 24
        }
        this.speed = 240,
        this.moving = false,
        this.direction = undefined
    }
}

export default Player;