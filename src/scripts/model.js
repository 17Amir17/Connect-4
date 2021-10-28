export class Model {
  #board;
  constructor(sizeX, sizeY) {
    this.#gameBoard = [sizeX, sizeY];
  }

  set #gameBoard(size) {
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
    this.#board[x][y] = value;
  }
}
