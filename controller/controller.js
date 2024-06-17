import GameBoard from "../model/GameBoard.js"
import {
  createBoard, displayBoard, displayPlayerAtPosition,
  displayPlayerAnimation, highlightTile, unHighlightTile,
  showDebugPlayerRect, showDebugRegistrationPoint, showDebugPlayerHitbox,
  displayEnemiesAtPosition, displayEnemiesAnimation, createEnemyDiv, 
  showDebugRegistrationPointEnemy, showDebugEnemyHitbox, showDebugEnemyRect,
  displayItem, displayInventory, nextLevelSetup, playNewGame
} from "../view/view.js"

import Player from "../model/Player.js"
import Enemy from "../model/Enemy.js"
import Item from "../model/Item.js"

let lastTimestamp = 0;

let gameBoard;
let player;
let enemies = [];
let obstacles;
let aStarOutput = [];
let item = [];


const controls = {
  left: false,
  right: false,
  up: false,
  down: false
}

export function initController(level) {
  gameBoard = [];
  player = {};
  enemies = [];
  item = [];
  obstacles = [];
  aStarOutput = [];

  gameBoard = new GameBoard(level.tileSet, level.enemyCount, level.item, level.exit);
  player = new Player();

  for (let i = 0; i < level.enemies.length; i++) {
    const enemy = new Enemy("ghost", { x: level.enemies[i].x, y: level.enemies[i].y });
    createEnemyDiv(enemy.enemyType, i);
    enemies.push(enemy);
  }
  if(gameBoard.item !== null){
    item = new Item(level.item.x, level.item.y, level.item.name);
  }
  createBoard(gameBoard);
  obstacles = gameBoard.obstacles;
  requestAnimationFrame(tick)
}

function tick(timestamp) {
  requestAnimationFrame(tick);

  const deltaTime = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;
  
  aStarOutput = aStar(coordsFromPosForAStar({ row: enemies[0].x, col: enemies[0].y }), coordsFromPosForAStar({ row: player.x, col: player.y }));

  if (item) {
    checkItem();
  } else {
    checkWin();
  }

  movePlayer(deltaTime);
  displayItem(item);
  displayPlayerAtPosition(player);
  displayPlayerAnimation(player);

  moveGhost(deltaTime);

  const reset = checkCollision();
  if (reset) {
    return;
  }

  displayEnemiesAtPosition(enemies[0]);
  displayEnemiesAnimation(enemies[0]);

  displayBoard(gameBoard, aStarOutput);
  showDebugging();
}


function checkCollision(){
  if(
    player.x < enemies[0].x + enemies[0].hitbox.w &&
    player.x + player.hitbox.w > enemies[0].x &&
    player.y  < enemies[0].y + enemies[0].hitbox.h &&
    player.y + player.hitbox.h > enemies[0].y 
  ) {
    playNewGame();
    return true;
  }
}

function checkItem(){
  const itemCoords = coordsFromPos({x: item.x, y:item.y})
  const playerCoords = coordsFromPos({x: player.x - player.regX, y:player.y - player.regX})
  if(itemCoords.row == playerCoords.row 
    && itemCoords.col == playerCoords.col
  ){
    item = false;
    displayInventory();
    return;
  }
}

function checkWin(){
  const playerCoords = coordsFromPos({x: player.x - player.regX, y:player.y - player.regY});
  const exitCoords = coordsFromPos({x: gameBoard.EXIT.x, y: gameBoard.EXIT.y});
  if(exitCoords.row == playerCoords.row
    && exitCoords.col == playerCoords.col
  ) {
    enemies = [];
    nextLevelSetup();
  }
}

function moveGhost(deltaTime, count = 1) {
  console.log(aStarOutput)
  enemies[0].moving = false;
  let targetX;
  let targetY;

  // Current ghost position (top-left corner of the ghost's hitbox)
  const ghostX = enemies[0].x;
  const ghostY = enemies[0].y;

  if(aStarOutput.length > 4){
    targetX = (aStarOutput[count].x + 0.5) * 40;  // We defined the tile sizes to be 40x40
    targetY = (aStarOutput[count].y + 0.5) * 40;
  } else {
    targetX = player.x;
    targetY = player.y;
  }

  // Calculate direction and movement
  let moveX = 0;
  let moveY = 0;
  
  // find direction based on positioning
  if (Math.abs(ghostX - targetX) >= Math.abs(ghostY - targetY)) {
    // horizontal movement
    if (ghostX < targetX) {
      enemies[0].moving = true;
      enemies[0].direction = "right";
      moveX = Math.min(enemies[0].speed * deltaTime, targetX - ghostX);
    } else {
      enemies[0].moving = true;
      enemies[0].direction = "left";
      moveX = -Math.min(enemies[0].speed * deltaTime, ghostX - targetX);
    }
  } else {
    // vertical movement
    if (ghostY < targetY) {
      enemies[0].moving = true;
      enemies[0].direction = "down";
      moveY = Math.min(enemies[0].speed * deltaTime, targetY - ghostY);
    } else {
      enemies[0].moving = true;
      enemies[0].direction = "up";
      moveY = -Math.min(enemies[0].speed * deltaTime, ghostY - targetY);
    }
  }

  enemies[0].x += moveX;
  enemies[0].y += moveY;
  count = 1;
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
/* Returns the closest tile to a player */
function coordsFromPos({ x, y }) {
  const row = Math.floor(y / gameBoard.TILE_SIZE);
  const col = Math.floor(x / gameBoard.TILE_SIZE);
  const coord = { row, col }
  return coord;
}

/* Returns the closest tile to a player */
function coordsFromPosForAStar({ row, col }) {
  const y = Math.floor(row / gameBoard.TILE_SIZE);
  const x = Math.floor(col / gameBoard.TILE_SIZE);
  const coord = { y, x }
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
function showDebugging() {
  showDebugTilesUnderPlayer();
  showDebugPlayerRect(player);
  showDebugRegistrationPoint();
  showDebugPlayerHitbox(player);
  
  showDebugTilesUnderEnemy();
  showDebugEnemyRect(enemies[0]);
  showDebugRegistrationPointEnemy();
  showDebugEnemyHitbox(enemies[0]);
}


let highlightedTilesEnemy = []

function showDebugTilesUnderEnemy(){
  highlightedTilesEnemy.forEach(tileCoords => unHighlightTile(tileCoords, gameBoard.GRID_WIDTH));

  const tileCoords = getTilesUnderEnemy(enemies[0]);
  tileCoords.forEach(coords => highlightTile(coords, gameBoard.GRID_WIDTH));

  highlightedTilesEnemy = tileCoords;
}

let highlightedTiles = [];

function showDebugTilesUnderPlayer() {
  highlightedTiles.forEach(tileCoords => unHighlightTile(tileCoords, gameBoard.GRID_WIDTH));

  const tileCoords = getTilesUnderPlayer(player);
  tileCoords.forEach(coords => highlightTile(coords, gameBoard.GRID_WIDTH));

  highlightedTiles = tileCoords;
}
/* 

  ENEMY MOVEMENTS

*/
function getTilesUnderEnemy(enemy, newPos = { x: enemies[0].x, y: enemies[0].y }) {
  const tileCoords = [];

  const topLeft = { x: newPos.x - enemy.regX + enemy.hitbox.x, y: newPos.y - enemy.regY + enemy.hitbox.y }
  const topRight = { x: topLeft.x + enemy.hitbox.w, y: topLeft.y }
  const bottomLeft = { x: topLeft.x, y: topLeft.y + enemy.hitbox.h }
  const bottomRight = { x: topLeft.x + enemy.hitbox.w, y: topLeft.y + enemy.hitbox.h }

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

/* 

  A STAR FUNCTIONALITY

*/

function aStar(ghostPosition, playerPosition) {
  // Initialize the frontier with the initial state
  let frontier = [{
    state: ghostPosition,
    cost: 0,
    estimate: heuristic(ghostPosition, playerPosition)
  }];
  
  // use came frmo path to start reconstruct path
  let cameFrom = {};
  cameFrom[ghostPosition.x + ',' + ghostPosition.y] = null;
  
  while (frontier.length > 0) {
    // Sort the frontier by the total cost estimate
    frontier.sort((a, b) => a.estimate - b.estimate);
    
    // Get the node with the lowest cost
    let current = frontier.shift();
    // If we've reached the playerPosition reconstruct the path and return it
    if (current.state.x === playerPosition.x && current.state.y === playerPosition.y) {
      return reconstructPath(cameFrom, current.state);
    }
    
    // Generate next steps from current state
    let nextSteps = generateNextSteps(current.state);
    
    // Process each next step
    for (let step of nextSteps) {
      let newCost = current.cost + step.cost;
      let newState = step.state;
      
      // Check if the new state has been explored
      if (!(newState.x + ',' + newState.y in cameFrom) || newCost < current.cost) {
        cameFrom[newState.x + ',' + newState.y] = current.state;
        let estimate = newCost + heuristic(newState, playerPosition);
        frontier.push({ state: newState, cost: newCost, estimate: estimate });
      }
    }
  }
  
  // If no path is found, return null
  return null;
}

function reconstructPath(cameFrom, currentState) {
  let path = [];
  let node = currentState;
  while (node) {
    path.unshift(node); // Add node to the beginning of the path array
    node = cameFrom[node.x + ',' + node.y];
  }
  return path;
}

// Define the function to generate the possible next steps from a given state
function generateNextSteps(state) {
  // Define an array to store the next steps
  let next = [];

  // Check if the current state has any valid neighbors
  if (state.x > 0) {
    // If the current state has a neighbor to the left, add it to the array of next steps
    if (!isObstacle(state.x - 1, state.y)) {
      next.push({
        state: { x: state.x - 1, y: state.y },
        cost: 1
      });
    }
  }
  if (state.x < gameBoard.GRID_WIDTH - 1) {
    // If the current state has a neighbor to the right, add it to the array of next steps
    if (!isObstacle(state.x + 1, state.y)) {
      next.push({
        state: { x: state.x + 1, y: state.y },
        cost: 1
      });
    }
  }
  if (state.y > 0) {
    // If the current state has a neighbor above it, add it to the array of next steps
    if (!isObstacle(state.x, state.y - 1)) {
      next.push({
        state: { x: state.x, y: state.y - 1 },
        cost: 1
      });
    }
  }
  if (state.y < gameBoard.GRID_HEIGHT + 1) {
    // If the current state has a neighbor below it, add it to the array of next steps
    if (!isObstacle(state.x, state.y + 1)) {
      next.push({
        state: { x: state.x, y: state.y + 1 },
        cost: 1
      });
    }
  }  // Return the array of next steps
  return next;
}

function isObstacle(x, y) {
  return obstacles.find(o => o.x == x && o.y == y)
}

function heuristic(state, playerPosition) {
  // Calculate the number of steps required to reach the goal, using the Manhattan distance formula
  let dx = Math.abs(state.x - playerPosition.x);
  let dy = Math.abs(state.y - playerPosition.y);

  let penalty = pathIntersectsObstacle(state, playerPosition, obstacles) * 10;
  return Math.sqrt(dx * dx + dy * dy) + penalty;
}

function pathIntersectsObstacle(start, end, obstacles) {
  // Convert the starting and ending coordinates to grid coordinates
  let { x: startX, y: startY } = start;
  let { x: endX, y: endY } = end;
  // Get the coordinates of all points on the path
  let path = getPath(startX, startY, endX, endY);
  //get the points in the array that are within the list of obstacles
  let instersections = path.filter(point => !!obstacles.find(o => o.x == point[0] && o.y == point[1])).length
  return instersections;
}

function getPath(startX, startY, endX, endY) {
  // Initialize an empty array to store the coordinates of the points on the path
  let path = [];

  // Use the Bresenham's line algorithm to get the coordinates of the points on the path
  let x1 = startX, y1 = startY, x2 = endX, y2 = endY;
  let isSteep = Math.abs(y2 - y1) > Math.abs(x2 - x1);
  if (isSteep) {
    [x1, y1] = [y1, x1];
    [x2, y2] = [y2, x2];
  }
  let isReversed = false;
  if (x1 > x2) {
    [x1, x2] = [x2, x1];
    [y1, y2] = [y2, y1];
    isReversed = true;
  }
  let deltax = x2 - x1, deltay = Math.abs(y2 - y1);
  let error = Math.floor(deltax / 2);
  let y = y1;
  let ystep = null;
  if (y1 < y2) {
    ystep = 1;
  } else {
    ystep = -1;
  }
  for (let x = x1; x <= x2; x++) {
    if (isSteep) {
      path.push([y, x]);
    } else {
      path.push([x, y]);
    }
    error -= deltay;
    if (error < 0) {
      y += ystep;
      error += deltax;
    }
  }

  // If the line is reversed, reverse the order of the points in the path
  if (isReversed) {
    path = path.reverse();
  }
  return path;
}









