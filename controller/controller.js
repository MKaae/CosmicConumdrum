import GameBoard from "../model/GameBoard.js"
import { 
    createBoard, displayBoard, displayPlayerAtPosition, 
    displayPlayerAnimation, highlightTile, unHighlightTile, 
    showDebugPlayerRect, showDebugRegistrationPoint, showDebugPlayerHitbox,
    displayEnemiesAtPosition, displayEnemiesAnimation, createEnemyDiv
 } from "../view/view.js"
 
import Player from "../model/Player.js"
import Enemy from "../model/Enemy.js"

let lastTimestamp = 0;

let gameBoard;
let player;
let enemies = [];

const controls = {
    left: false,
    right: false,
    up: false,
    down: false
}


export function initController(level) {
    gameBoard = new GameBoard(level.tileSet, level.enemyCount);
    player = new Player();
    
    for(let i = 0; i < level.enemies.length; i++){
        const enemy = new Enemy("ghost", {x: level.enemies[i].x, y: level.enemies[i].y} );
        createEnemyDiv(enemy.enemyType, i);
        enemies.push(enemy);
    }
    
    createBoard(gameBoard);

    requestAnimationFrame(tick)
}

function tick(timestamp) {
    requestAnimationFrame(tick);

    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;
    movePlayer(deltaTime);
    
    displayBoard(gameBoard); 

    displayEnemiesAtPosition(enemies);
    displayEnemiesAnimation(enemies);

    displayPlayerAtPosition(player);
    displayPlayerAnimation(player);
    // showDebugging();
}

function movePlayer(deltaTime) {
    player.moving = false;

    const newPos = {
        x: player.x,
        y: player.y
    }

    if (controls.right) {
        player.moving = true;
        player.direction = "right";
        newPos.x += player.speed * deltaTime;
    } else if (controls.left) {
        player.moving = true;
        player.direction = "left";
        newPos.x -= player.speed * deltaTime;
    }

    if (controls.up) {
        player.moving = true;
        player.direction = "up";
        newPos.y -= player.speed * deltaTime;
    } else if (controls.down) {
        player.moving = true;
        player.direction = "down";
        newPos.y += player.speed * deltaTime;
    }

    if (canMovePlayerToPos(player, newPos)) {
        player.x = newPos.x;
        player.y = newPos.y;
    } else {
        player.moving = false;
        const newXpos = {
            x: newPos.x,
            y: player.y
        }
        const newYpos = {
            x: player.x,
            y: newPos.y
        }
        if (canMovePlayerToPos(player, newXpos)) {
            player.moving = true;
            player.x = newPos.x;
            player.y = player.y;
        }
        if (canMovePlayerToPos(player, newYpos)) {
            player.moving = true;
            player.x = player.x;
            player.y = newPos.y;
        }
    }
}

function canMovePlayerToPos(player, pos) {
    const coords = getTilesUnderPlayer(player, pos);
    return coords.every(canMoveTo);
}

function getTilesUnderPlayer(player, newPos = { x: player.x, y: player.y }) {
    const tileCoords = [];

    const topLeft = { x: newPos.x - player.regX + player.hitbox.x, y: newPos.y - player.regY + player.hitbox.y }
    const topRight = { x: topLeft.x + player.hitbox.w, y: topLeft.y }
    const bottomLeft = { x: topLeft.x, y: topLeft.y + player.hitbox.h }
    const bottomRight = { x: topLeft.x + player.hitbox.w, y: topLeft.y + player.hitbox.h }

    const topLeftCoords = coordsFromPos(topLeft);
    const topRightCoords = coordsFromPos(topRight);
    const bottomLeftCoords = coordsFromPos(bottomLeft);
    const bottomRightCoords = coordsFromPos(bottomRight);

    tileCoords.push(topLeftCoords);
    tileCoords.push(topRightCoords);
    tileCoords.push(bottomLeftCoords);
    tileCoords.push(bottomRightCoords);

    return tileCoords;
}

function coordsFromPos({ x, y }) {
    const row = Math.floor(y / gameBoard.TILE_SIZE);
    const col = Math.floor(x / gameBoard.TILE_SIZE);
    const coord = { row, col }
    return coord;
}

function canMoveTo({ row, col }) {
    if (row < 0 || row >= gameBoard.GRID_HEIGHT || col < 0 || col >= gameBoard.GRID_WIDTH) {
        return false;
    }
    const walkable = getTileCoord({ row, col });
    if (walkable) {
        return true;
    } else {
        return false;
    }
}

export function getTileCoord({ row, col }) {
    return gameBoard.board[row][col].walkable;
}

export function changeDirectionInputUp(newInput) {
    switch (newInput) {
        case "ArrowLeft": controls.left = false; break;
        case "ArrowRight": controls.right = false; break;
        case "ArrowUp": controls.up = false; break;
        case "ArrowDown": controls.down = false; break;
    }
}

export function changeDirectionInputDown(newInput) {
    switch (newInput) {
        case "ArrowLeft": controls.left = true; break;
        case "ArrowRight": controls.right = true; break;
        case "ArrowUp": controls.up = true; break;
        case "ArrowDown": controls.down = true; break;
    }
}

/* DEBUGGING MODE */
function showDebugging(){
  showDebugTilesUnderPlayer();
  showDebugPlayerRect(player);
  showDebugRegistrationPoint();
  showDebugPlayerHitbox(player);
}

let highlightedTiles = [];

function showDebugTilesUnderPlayer(){
    highlightedTiles.forEach(tileCoords => unHighlightTile(tileCoords, gameBoard.GRID_WIDTH));

    const tileCoords = getTilesUnderPlayer(player);
    tileCoords.forEach(coords => highlightTile(coords, gameBoard.GRID_WIDTH));

    highlightedTiles = tileCoords;
}
