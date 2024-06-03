"use strict";
import  { initController, changeDirectionInputUp ,changeDirectionInputDown } from "../controller/controller.js"
import { level1 } from "../config/levels.js";

function startListening(){
  console.log("STARTING PROGRAM...");
  addKeyListeners();
  initController(level1);
}

startListening();


export function createBoard(gameBoard){
  const background = document.getElementById('background');

  for(let i = 0; i < gameBoard.GRID_HEIGHT; i++){
    for(let j = 0; j < gameBoard.GRID_WIDTH; j++){
      const tile = document.createElement("tile");
      tile.classList.add("tile");
      background.append(tile);
    }

    background.style.setProperty("--GRID_WIDTH", gameBoard.GRID_WIDTH);
    background.style.setProperty("--GRID_HEIGHT", gameBoard.GRID_HEIGHT);
    background.style.setProperty("--TILE_SIZE", gameBoard.TILE_SIZE+"px");
  }
}

export function displayBoard(gameBoard){
  const visualTiles = document.querySelectorAll("#background .tile");
  
  for(let i = 0; i < gameBoard.GRID_HEIGHT; i++){
    for(let j = 0; j < gameBoard.GRID_WIDTH; j++){
      const gameBoardTile = gameBoard.getTileCoord({row: i, col: j});
      const visualTile = visualTiles[i * gameBoard.GRID_WIDTH + j];

      visualTile.classList.add(gameBoardTile.tileType);
    }
  }
}

export function displayPlayerAtPosition(player){
  const visualPlayer = document.getElementById('player');
  visualPlayer.style.translate = `${player.x - player.regX}px ${player.y - player.regY}px`
}

export function displayPlayerAnimation(player){
  const visualPlayer = document.getElementById("player");

  if(!player.moving){
    visualPlayer.classList.remove("animate");
  } else {
    visualPlayer.classList.add("animate");
    visualPlayer.classList.remove("up", "down", "left", "right");
    visualPlayer.classList.add(player.direction);
  }

}

function addKeyListeners() {
  document.addEventListener('keydown', () => keyDown(event))
  document.addEventListener('keyup', () => keyUp(event))
}

function keyUp(event) {
  const key = event.key;
  changeDirectionInputUp(key);
}

function keyDown(event) {
  const key = event.key;
  changeDirectionInputDown(key);
}

/* DISPLAY ENEMIES */

export function createEnemyDiv(enemyType, enemyId){
  const characterDiv = document.getElementById("characters");
  const visualEnemy = document.createElement(`div`);
  visualEnemy.classList.add(`${enemyType}`);
  visualEnemy.id = `enemy-${enemyId}`

  characterDiv.append(visualEnemy);
}

export function displayEnemiesAtPosition(enemies){
  for(let i = 0; i < enemies.length; i++){
    const visualEnemy = document.getElementById(`enemy-${i}`)
    visualEnemy.style.translate = `${enemies[0].x - enemies[0].regX}px ${enemies[0].y - enemies[0].regY}px`
  };
}

export function displayEnemiesAnimation(enemies){
  for(let i = 0; i < enemies.length; i++){
    const visualEnemy = document.getElementById(`enemy-${i}`);

    if(!enemies[i].moving){
      visualEnemy.classList.remove("animate");
    } else {
      visualEnemy.classList.add("animate");
      visualEnemy.classList.remove("up", "down", "left", "right");
      visualEnemy.classList.add(enemies[i].direction);
    }
  }
}
  

/* DEBUGGING MODE */

export function highlightTile( {row, col}, GRID_WIDTH ) {
  const visualTiles = document.querySelectorAll("#background .tile");
  const visualTile = visualTiles[row * GRID_WIDTH + col];

  visualTile.classList.add('highlight');
}   

export function unHighlightTile( {row, col}, GRID_WIDTH ){
  const visualTiles = document.querySelectorAll("#background .tile");
  const visualTile = visualTiles[row * GRID_WIDTH + col];

  visualTile.classList.remove('highlight');
}

export function showDebugPlayerRect(player){
  const visualPlayer = document.getElementById('player');
  if(!visualPlayer.classList.contains('show-rect')){
      visualPlayer.classList.add('show-rect');
  }
  visualPlayer.style.setProperty("--regX", player.regX +"px")
  visualPlayer.style.setProperty("--regY", player.regY +"px")
}

export function showDebugRegistrationPoint(){
  const visualPlayer = document.getElementById('player');
  if(!visualPlayer.classList.contains('show-reg-point')){
      visualPlayer.classList.add('show-reg-point');
  }
}

export function showDebugPlayerHitbox(player) {
  const visualPlayer = document.getElementById('player');
  if(!visualPlayer.classList.contains('show-hitbox')){
      visualPlayer.classList.add('show-hitbox');
  }
  visualPlayer.style.setProperty("--hitboxX", player.hitbox.x + "px");
  visualPlayer.style.setProperty("--hitboxY", player.hitbox.y + "px");
  visualPlayer.style.setProperty("--hitboxW", player.hitbox.w + "px");
  visualPlayer.style.setProperty("--hitboxH", player.hitbox.h + "px");
}