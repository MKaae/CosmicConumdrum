class Enemy {
    constructor(enemyType, startPos) {
        this.enemyType = enemyType;
        this.x = startPos.x;
        this.y = startPos.y;
        this.regX = 11,
        this.regY = 12,
            this.hitbox = {
                x: 10,
                y: 13,
                w: 12,
                h: 24
            }
        this.speed = 120,
        this.moving = true,
        this.direction = "down"
    }
}

export default Enemy;