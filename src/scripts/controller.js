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
  }

  #createEvents() {
    Events.addEvent('onGameEnd');
    Events.addEvent('onControllerConstructorEnd');
  }

  #subscribeEvents() {
    Events.subscribe('onBlockClick', this.#onBlockClick);
    Events.subscribe('onBlockHover', this.#onBlockHover);
    Events.subscribe('onBlockOut', this.#onBlockOut);
  }

  #onBlockClick = (event) => {
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
        Events.trigger('onGameEnd', { winner });
      } else {
        // If nobody won change turns
        this.#game.turn = this.#game.turn === 1 ? 2 : 1;
        Events.trigger('onBlockHover', { pos: placePos }); //Trigger new hover
      }
    } else alert('Cant place there!');
  };

  #getBlockPlacePos = (board, pos) => {
    for (let y = this.#sizeY - 1; y >= 0; y--) {
      if (board[y][pos[0]] === 0) return [pos[0], y];
    }
    return false;
  };

  #getWinner = (board) => {
    const verticleWinner = this.#verticleCheck(board);
    if (verticleWinner) return verticleWinner;
    const horizontalWinner = this.#horizontalCheck(board);
    if (horizontalWinner) return horizontalWinner;
    const diagonalWinner = this.#diagonalCheck(board);
    if (diagonalWinner) return diagonalWinner;
    return false;
  };

  #verticleCheck = (board) => {
    //Verticle Check
    for (let x = 0; x < this.#sizeX; x++) {
      let count = 1;
      let player = 0;
      for (let y = 0; y < this.#sizeY; y++) {
        const block = board[y][x];
        if (block === player && block != 0) {
          count += 1;
          if (count >= 4) return player;
        } else {
          player = block;
          count = 1;
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
      for (let x = 0; x < this.#sizeX; x++) {
        const block = board[y][x];
        if (block === player && block != 0) {
          count += 1;
          if (count >= 4) return player;
        } else {
          player = block;
          count = 1;
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
        for (let z = 0; z < 4; z++) {
          const block = board[y + z][x + z];
          if (block === player && block != 0) {
            count += 1;
            if (count >= 4) return player;
          } else break;
        }
      }
    }
    //Ascending diagonal
    for (let x = 0; x < this.#sizeX - 3; x++) {
      for (let y = this.#sizeY - 1; y >= 3; y--) {
        const player = board[y][x];
        let count = 0;
        for (let z = 0; z < 4; z++) {
          const block = board[y - z][x + z];
          if (block === player && block != 0) {
            count += 1;
            if (count >= 4) return player;
          } else break;
        }
      }
    }
    return false;
  };

  #onBlockHover = (event) => {
    const pos = this.#getBlockPlacePos(this.#model.board, event.pos);
    if (pos) this.#view.setBlock(pos, `${this.#game.turn}over`);
  };

  #onBlockOut = (event) => {
    const pos = this.#getBlockPlacePos(this.#model.board, event.pos);
    if (pos) this.#view.setBlock(pos, false);
  };
}
