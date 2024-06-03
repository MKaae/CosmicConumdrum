class Player{
    constructor(){
        this.x = 14,
        this.y = 10,
        this.regX = 11,
        this.regY = 12,
        this.hitbox = {
            x: 10,
            y: 13,
            w: 12,
            h: 24
        }
        this.speed = 120,
        this.moving = false,
        this.direction = undefined
    }
}

export default Player;