"use strict";
import { initController, changeDirectionInputUp, changeDirectionInputDown } from "../controller/controller.js";
import { level1 } from "../config/levels.js";

const button = document.getElementById("nextlevel-btn");
button.addEventListener('click', startfunction);

let currentLevelIndex = 0;
let levels = [level1]; // Simplified initialization

function startfunction() {
  const bgMusic = document.getElementById('background-music');
  // Check if the music is already playing to avoid starting multiple times
  if (bgMusic.paused) {
    bgMusic.volume = 0.5; 
    bgMusic.play().catch(error => {
      console.error("Play attempt failed:", error);
    });
  }
  document.getElementById('nextlevel').classList.add('hidden');
  button.removeEventListener('click', startfunction);
  nextLevel(levels[currentLevelIndex]);
}

function startListening(level) {
  addKeyListeners();
  initController(level);
}

function nextLevel(level) {
  // currentLevelIndex++;
  startListening(level);
}

export function playNewGame() {
  const deathscreen = document.getElementById('deathscreen');
  const button = document.getElementById('deathscreen-btn');

  function nextLevelHandler() {
    deathscreen.classList.remove('show');
    deathscreen.classList.add('hidden');
    button.removeEventListener('click', nextLevelHandler);
    nextLevelSetup();
  }
  deathscreen.classList.remove('hidden');
  deathscreen.classList.add('show');

  button.addEventListener('click', nextLevelHandler);
}

export function nextLevelSetup() {
  const gamefield = document.getElementById("gamefield");
  const psstatus = document.getElementById("psstatus");
  clearPlayer();
  clearEnemies();
  psstatus.style.backgroundImage = "";
  gamefield.innerHTML = ""; // Clear the gamefield to remove old elements
  
  // Recreate the gamefield elements
  gamefield.innerHTML = `
    <div id="background"></div>
    <div id="characters">
        <div id="player"></div>
        <div id="item"></div>
    </div>
  `;

  nextLevel(levels[currentLevelIndex]);
}

function clearPlayer(){
  const player = document.getElementById("player");
  if (player) {
    player.remove();
  }
}

function clearEnemies() {
  const enemy = document.getElementById("enemy-0");
  if (enemy) {
    enemy.remove();
  }
}

export function createBoard(gameBoard) {
  const background = document.getElementById('background');

  while (background.firstChild) {
    background.removeChild(background.firstChild);
  }

  for (let i = 0; i < gameBoard.GRID_HEIGHT; i++) {
    for (let j = 0; j < gameBoard.GRID_WIDTH; j++) {
      const tile = document.createElement("tile");
      tile.classList.add("tile");
      background.append(tile);
    }

    background.style.setProperty("--GRID_WIDTH", gameBoard.GRID_WIDTH);
    background.style.setProperty("--GRID_HEIGHT", gameBoard.GRID_HEIGHT);
    background.style.setProperty("--TILE_SIZE", gameBoard.TILE_SIZE + "px");
  }
}

export function displayBoard(gameBoard) {
  const visualTiles = document.querySelectorAll("#background .tile");

  for (let i = 0; i < gameBoard.GRID_HEIGHT; i++) {
    for (let j = 0; j < gameBoard.GRID_WIDTH; j++) {
      const gameBoardTile = gameBoard.getTileCoord({ row: i, col: j });
      const visualTile = visualTiles[i * gameBoard.GRID_WIDTH + j];
      visualTile.classList.add(gameBoardTile.tileType);
    }
  }
}

export function displayItem(item) {
  const visualItem = document.getElementById("item");
  if (item) {
    visualItem.style.translate = `${item.x}px ${item.y - 80}px`;
  } else {
    visualItem.classList.add('hidden');
  }
}

export function displayInventory() {
  const visualPowerSupply = document.getElementById("psstatus");
  visualPowerSupply.style.backgroundImage = `url('./assets/tiles/scifi_hackspace_frama.png')`;
}

export function displayPlayerAtPosition(player) {
  const visualPlayer = document.getElementById('player');
  visualPlayer.style.translate = `${player.x - player.regX}px ${player.y - player.regY}px`;
}

export function displayPlayerAnimation(player) {
  const visualPlayer = document.getElementById("player");

  if (!player.moving) {
    visualPlayer.classList.remove("animate");
  } else {
    visualPlayer.classList.add("animate");
    visualPlayer.classList.remove("up", "down", "left", "right");
    visualPlayer.classList.add(player.direction);
  }
}

function addKeyListeners() {
  document.removeEventListener('keydown', keyDownHandler);
  document.removeEventListener('keyup', keyUpHandler);

  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', keyUpHandler);
}

function keyUpHandler(event) {
  const key = event.key;
  changeDirectionInputUp(key);
}

function keyDownHandler(event) {
  const key = event.key;
  changeDirectionInputDown(key);
}

/* DISPLAY ENEMIES */

export function createEnemyDiv(enemyType, enemyId){
  const characterDiv = document.getElementById("player");
  const visualEnemy = document.createElement(`div`);
  visualEnemy.classList.add(`${enemyType}`);
  visualEnemy.id = `enemy-${enemyId}`

  characterDiv.insertAdjacentElement('afterend', visualEnemy);
}

export function displayEnemiesAtPosition(enemy){
    const visualEnemy = document.getElementById(`enemy-0`)
    visualEnemy.style.translate = `${enemy.x - enemy.regX}px ${enemy.y - enemy.regY-40}px`
}


export function displayEnemiesAnimation(enemy){
    const visualEnemy = document.getElementById(`enemy-0`);

    if(!enemy.moving){
      visualEnemy.classList.remove("animate");
    } else {
      visualEnemy.classList.add("animate");
      visualEnemy.classList.remove("up", "down", "left", "right");
      visualEnemy.classList.add(enemy.direction);
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

// ENEMIES DEBUGGING
export function showDebugRegistrationPointEnemy(){
  const visualEnemy = document.getElementById('enemy-0');
  if(!visualEnemy.classList.contains('show-reg-point')){
    visualEnemy.classList.add('show-reg-point-e');
  }
}

export function showDebugEnemyRect(enemy){
  const visualEnemy = document.getElementById('enemy-0');
  if(!visualEnemy.classList.contains('show-rect')){
    visualEnemy.classList.add('show-rect');
  }
  visualEnemy.style.setProperty("--regEX", enemy.regX +"px")
  visualEnemy.style.setProperty("--regEY", enemy.regY +"px")
}

export function showDebugEnemyHitbox(enemy) {
  const visualEnemy = document.getElementById('enemy-0');
  if(!visualEnemy.classList.contains('show-hitbox-e')){
    visualEnemy.classList.add('show-hitbox-e');
  }
  visualEnemy.style.setProperty("--hitboxEX", enemy.hitbox.x + "px");
  visualEnemy.style.setProperty("--hitboxEY", enemy.hitbox.y + "px");
  visualEnemy.style.setProperty("--hitboxEW", enemy.hitbox.w + "px");
  visualEnemy.style.setProperty("--hitboxEH", enemy.hitbox.h + "px");
}