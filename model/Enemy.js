class Enemy {
    constructor(enemyType, startPos) {
        this.enemyType = enemyType;
        this.x = startPos.x;
        this.y = startPos.y;
        this.regX = 15,
        this.regY = 20,
        this.hitbox = {
                x: 10,
                y: 13,
                w: 12,
                h: 24
        }
        this.speed = 20,
        this.moving = false,
        this.direction = ""
    }
}

export default Enemy;