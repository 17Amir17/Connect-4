import { Events } from './event.js';

export class Model {
  // The model class keeps track of the board
  // All board data is modified directly by accesing this class
  #size;
  #board;
  constructor(sizeX, sizeY) {
    this.#size = [sizeX, sizeY];
    this.#gameBoard = this.#size;
    Events.subscribe('onGameEnd', this.#onGameEnd);
  }

  set #gameBoard(size) {
    // Creates a new clean board
    // God knows why I started with the rows 🤦‍♂️
    const board = [];
    for (let y = 0; y < size[1]; y++) {
      const row = [];
      for (let x = 0; x < size[0]; x++) {
        row.push(0);
      }
      board.push(row);
    }
    this.#board = board;
  }

  get board() {
    return this.#board;
  }

  setBlock(x, y, value) {
    // Sets block value at x, y
    // Because I set the board to be rows first I must use y then x
    this.#board[y][x] = value;
  }

  #clearBoard() {
    // Re-initiates board making it clear again
    this.#gameBoard = this.#size;
  }

  #onGameEnd = () => {
    // Called when game ends
    this.#clearBoard();
  };
}
