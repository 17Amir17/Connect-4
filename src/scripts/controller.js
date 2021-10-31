import { View } from './view.js';
import { Events } from './event.js';
import { Model } from './model.js';

export class Controller {
  #sizeX;
  #sizeY;
  #view;
  #model;
  #game;
  constructor(parentElement, sizeX, sizeY) {
    this.#sizeX = sizeX;
    this.#sizeY = sizeY;

    this.#createEvents();
    this.#view = new View(parentElement, sizeX, sizeY);
    this.#model = new Model(sizeX, sizeY);
    this.#subscribeEvents();
    this.#game = { turn: 1 };
    Events.trigger('onControllerConstructorEnd');
    Events.trigger('onTurnChanged', { player: this.#game.turn });
  }

  #createEvents() {
    //Controller events
    Events.addEvent('onGameEnd'); //Triggered when game ends
    Events.addEvent('onControllerConstructorEnd'); //Triggered after constructor
    Events.addEvent('onBlockPlaced'); //Triggered when block is placed
    Events.addEvent('onTurnChanged'); //Triggered when turn changed
  }

  #subscribeEvents() {
    //Subscribe to events
    Events.subscribe('onBlockClick', this.#onBlockClick);
    Events.subscribe('onBlockHover', this.#onBlockHover);
    Events.subscribe('onBlockOut', this.#onBlockOut);
  }

  #onBlockClick = (event) => {
    //A block was clicked
    //I now want to check its position get the board and handle the game
    const pos = event.pos;
    const board = this.#model.board;
    this.#handleGame(board, pos);
  };

  #handleGame = (board, pos) => {
    const placePos = this.#getBlockPlacePos(board, pos); //Get coords of block to place
    if (placePos) {
      // If you can place, place on both view and model
      this.#model.setBlock(placePos[0], placePos[1], this.#game.turn);
      this.#view.setBlock(placePos, false); //Remove the hover effect
      this.#view.setBlock(placePos, this.#game.turn);
      // Check if somebody won
      const winner = this.#getWinner(board);
      if (winner) {
        Events.trigger('onGameEnd', {
          winner: winner.player,
          positions: winner.winningCoords,
        });
      } else {
        // If nobody won change turns
        this.#game.turn = this.#game.turn === 1 ? 2 : 1;
        Events.trigger('onBlockPlaced', { pos: placePos }); //Trigger new hover
        Events.trigger('onTurnChanged', { player: this.#game.turn });
      }
    } else {
      // Do nothing for now
    }
  };

  #getBlockPlacePos = (board, pos) => {
    //Returns the pos of where the block should be placed on the board
    //If there is no where to place it, will return false
    for (let y = this.#sizeY - 1; y >= 0; y--) {
      if (board[y][pos[0]] === 0) return [pos[0], y];
    }
    return false;
  };

  #getWinner = (board) => {
    // Check for a winner in all direction
    // If no winner is found, returns false
    const verticleWinner = this.#verticleCheck(board);
    if (verticleWinner) return verticleWinner;
    const horizontalWinner = this.#horizontalCheck(board);
    if (horizontalWinner) return horizontalWinner;
    const diagonalWinner = this.#diagonalCheck(board);
    if (diagonalWinner) return diagonalWinner;
    return false;
  };

  // WIN CHECKS

  #verticleCheck = (board) => {
    //Verticle Check
    for (let x = 0; x < this.#sizeX; x++) {
      let count = 1;
      let player = 0;
      let winningCoords = [];
      for (let y = 0; y < this.#sizeY; y++) {
        const block = board[y][x];
        if (block === player && block != 0) {
          count += 1;
          winningCoords.push([x, y]);
          if (count >= 4) return { player, winningCoords };
        } else {
          player = block;
          count = 1;
          winningCoords = [[x, y]];
        }
      }
    }
    return false;
  };

  #horizontalCheck = (board) => {
    //Horizontal Check
    for (let y = 0; y < this.#sizeY; y++) {
      let count = 1;
      let player = 0;
      let winningCoords = [];
      for (let x = 0; x < this.#sizeX; x++) {
        const block = board[y][x];
        if (block === player && block != 0) {
          count += 1;
          winningCoords.push([x, y]);
          if (count >= 4) return { player, winningCoords };
        } else {
          player = block;
          count = 1;
          winningCoords = [[x, y]];
        }
      }
    }
    return false;
  };

  #diagonalCheck = (board) => {
    //Descending diagonal
    for (let x = 0; x < this.#sizeX - 3; x++) {
      for (let y = 0; y < this.#sizeY - 3; y++) {
        // console.log(x, y);
        const player = board[y][x];
        let count = 0;
        let winningCoords = [];
        for (let z = 0; z < 4; z++) {
          const block = board[y + z][x + z];
          if (block === player && block != 0) {
            count += 1;
            winningCoords.push([x + z, y + z]);
            if (count >= 4) return { player, winningCoords };
          } else break;
        }
      }
    }
    //Ascending diagonal
    for (let x = 0; x < this.#sizeX - 3; x++) {
      for (let y = this.#sizeY - 1; y >= 3; y--) {
        const player = board[y][x];
        let count = 0;
        let winningCoords = [];
        for (let z = 0; z < 4; z++) {
          const block = board[y - z][x + z];
          if (block === player && block != 0) {
            count += 1;
            winningCoords.push([x + z, y - z]);
            if (count >= 4) return { player, winningCoords };
          } else break;
        }
      }
    }
    return false;
  };

  // Handle some view events
  #onBlockHover = (event) => {
    // Tell view to change color of hovered block
    const pos = this.#getBlockPlacePos(this.#model.board, event.pos);
    if (pos) this.#view.setBlock(pos, `${this.#game.turn}over`);
  };

  #onBlockOut = (event) => {
    // Tell view to revert color of hovered block
    const pos = this.#getBlockPlacePos(this.#model.board, event.pos);
    if (pos) this.#view.setBlock(pos, false);
  };
}
