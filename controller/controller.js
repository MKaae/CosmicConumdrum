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
let obstacles = [
    {x: 1,y: 1, width: 1, height: 1}
];



const controls = {
    left: false,
    right: false,
    up: false,
    down: false
}


export function initController(level) {
    gameBoard = new GameBoard(level.tileSet, level.enemyCount);
    player = new Player();

    for (let i = 0; i < level.enemies.length; i++) {
        const enemy = new Enemy("ghost", { x: level.enemies[i].x, y: level.enemies[i].y });
        createEnemyDiv(enemy.enemyType, i);
        enemies.push(enemy);
    }

    createBoard(gameBoard);

    requestAnimationFrame(tick)
}

let count = 0;
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
    
    while(count < 1){
        
        const aStarOutput = aStar(coordsFromPosForAStar({row: enemies[0].x, col: enemies[0].y}), coordsFromPosForAStar({row: player.x, col: player.y}));
        displayGrid(aStarOutput);
        // INSTEAD OF DISPLAY GRID - USE PART OF THIS FUNCTION TO SORT THE ASTARTOUTPUT AND USE THIS FOR GHOST
        // CREATE OBSTACLES ARRAY FROM walkable = false OBJECTS TO GIVE TO A STAR 
        
        
        count++;
    }
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
}

let highlightedTiles = [];

function showDebugTilesUnderPlayer() {
    highlightedTiles.forEach(tileCoords => unHighlightTile(tileCoords, gameBoard.GRID_WIDTH));

    const tileCoords = getTilesUnderPlayer(player);
    tileCoords.forEach(coords => highlightTile(coords, gameBoard.GRID_WIDTH));

    highlightedTiles = tileCoords;
}


// A STAR FUNCTION
function aStar(ghostPosition, playerPosition) {
    // Create an empty data structure to store the explored paths(/nodes)
    
    let explored = [];

    // Create a data structure to store the paths that are being explored
    let frontier = [{
        state: ghostPosition,
        cost: 0,
        estimate: heuristic(ghostPosition, playerPosition)
    }];

    // While there are paths being explored
    while (frontier.length > 0) {
        // Sort the paths in the frontier by cost, with the lowest-cost paths first
        frontier.sort(function (a, b) {
            return a.estimate - b.estimate;
        });

        // Choose the lowest-cost path from the frontier
        let node = frontier.shift();

        // Add this nodeto the explored paths
        explored.push(node);
        // If this nodereaches the playerPosition, return the node 
        if (node.state.x == playerPosition.x && node.state.y == playerPosition.y) {
            return explored;
        }

        // Generate the possible next steps from this node's state
        let next = generateNextSteps(node.state); // 

        
        // For each possible next step
        for (let i = 0; i < next.length; i++) {
            // Calculate the cost of the next step by adding the step's cost to the node's cost
            let step = next[i];
            let cost = step.cost + node.cost;

            // Check if this step has already been explored
            let isExplored = (explored.find(e => {
                return e.state.x == step.state.x &&
                    e.state.y == step.state.y
            }))

            //avoid repeated nodes during the calculation of neighbors
            let isFrontier = (frontier.find(e => {
                return e.state.x == step.state.x &&
                    e.state.y == step.state.y
            }))

            // If this step has not been explored
            if (!isExplored && !isFrontier) {
                // Add the step to the frontier, using the cost and the heuristic function to estimate the total cost to reach the playerPosition
                frontier.push({
                    state: step.state,
                    cost: cost,
                    estimate: cost + heuristic(step.state, playerPosition)
                });
            }
        }
    }

    // If there are no paths left to explore, return null to indicate that the playerPosition cannot be reached
    return null;
}

  // Define the function to generate the possible next steps from a given state
  function generateNextSteps(state) {
    // Define an array to store the next steps
    let next = [];
  
    // Check if the current state has any valid neighbors
    if (state.x > 0) {
      // If the current state has a neighbor to the left, add it to the array of next steps
      if(!isObstacle(state.x - 1, state.y)) {
        next.push({
          state: { x: state.x - 1, y: state.y },
          cost: 1
        });
      }
    }
    if (state.x < gameBoard.GRID_WIDTH - 1) {
      // If the current state has a neighbor to the right, add it to the array of next steps
      if(!isObstacle(state.x + 1, state.y)) {
        next.push({
          state: { x: state.x + 1, y: state.y },
          cost: 1
        });
      }
    }
    if (state.y > 0) {
      // If the current state has a neighbor above it, add it to the array of next steps
      if(!isObstacle(state.x, state.y - 1)) {
        next.push({
          state: { x: state.x, y: state.y - 1 },
          cost: 1
        });
      }
    }
    if (state.y < gameBoard.GRID_HEIGHT - 1) {
      // If the current state has a neighbor below it, add it to the array of next steps
      if(!isObstacle(state.x, state.y + 1)) {
        next.push({
          state: { x: state.x, y: state.y + 1 },
          cost: 1
        });
      } 
    }
    // Return the array of next steps
    return next;
  }

  function isObstacle(x, y) {
    return obstacles.find( o => o.x == x && o.y == y)
  }

  function heuristic(state, playerPosition) {

    // Calculate the number of steps required to reach the goal, using the Manhattan distance formula
    let dx = Math.abs(state.x - playerPosition.x);
    let dy = Math.abs(state.y - playerPosition.y);
    
    let penalty = pathIntersectsObstacle(state, playerPosition, obstacles) * 10; 
    return Math.sqrt(dx*dx + dy * dy) + penalty;
  }

  function pathIntersectsObstacle(start, end, obstacles) {
    // Convert the starting and ending coordinates to grid coordinates
    let {x:startX, y:startY} = start;
    let {x:endX, y:endY} = end;
  
    // Get the coordinates of all points on the path
    let path = getPath(startX, startY, endX, endY);
  
    //get the points in the array that are within the list of obstacles
    let instersections =  path.filter( point => !!obstacles.find( o => o.x == point[0] && o.y == point[1]) ).length
    return instersections
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

   // Define a function to display the grid and the nodeon the screen
function displayGrid(path) {
    // Create a two-dimensional array to represent the grid
    let grid = [];
    for (let x = 0; x < gameBoard.GRID_WIDTH; x++) {
      grid[x] = [];
      for (let y = 0; y < gameBoard.GRID_HEIGHT; y++) {
        grid[x][y] = " . ";
      }
    }
  
    // Mark the starting and goal states on the grid
    grid[0][0] = " S ";
    grid[5][5] = " G ";

    obstacles.forEach( obs => {
      grid[obs.x][obs.y] = " - "
    })
  
    // Mark the path on the grid
    let finished = false;
    let sortedPath = path.sort((a,b) => a.estimate - b.estimate)
    let currentCost = 0;
    let costs = []
    while(!finished) {
      let step = sortedPath.shift() 
      if(step.state.x == 0 && step.state.y == 0) {
        finished = true
      } else {
        if(!costs.includes(step.cost)){
          grid[step.state.x][step.state.y] = " X " 
          costs.push(step.cost)
        }
      }
      currentCost++
    }
  
    // Print the grid to the console
    for (let y = 0; y < gameBoard.GRID_HEIGHT; y++) {
      let line = "";
      for (let x = 0; x < gameBoard.GRID_WIDTH; x++) {
        line += grid[x][y]
      }
      console.log(line)
    }
  }