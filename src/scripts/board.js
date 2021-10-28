export class Board {
  /**
   * Create a board out of svg elements with dataset of (x, y)
   * Change color of circle in block by changing fill
   * @param {Element} parentElement
   * @param {int} sizeX
   * @param {int} sizeY
   */
  static createBoard(parentElement, sizeX, sizeY) {
    const blockSize = 100;
    const boardElement = document.createElement('div');
    boardElement.setAttribute('id', 'board');
    parentElement.appendChild(boardElement);
    if (sizeX < 7 || sizeY < 7) throw 'Board is too small min size is 7';
    for (let y = 0; y < sizeY; y++) {
      const row = Board.#createRowElement(y);
      boardElement.appendChild(row);
      for (let x = 0; x < sizeX; x++) {
        const block = Board.#createBlockElement(blockSize, x, y);
        row.appendChild(block);
      }
    }
    return boardElement;
  }

  static #createBlockElement(blockSize, x, y) {
    const block = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    block.setAttribute('height', blockSize);
    block.setAttribute('width', blockSize);
    block.setAttribute('class', 'block');
    block.dataset.pos = [x, y];
    const circle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    circle.setAttribute('cx', blockSize / 2);
    circle.setAttribute('cy', blockSize / 2);
    circle.setAttribute('r', blockSize * 0.4);
    circle.setAttribute('fill', 'black');
    circle.setAttribute('class', 'circle');
    block.appendChild(circle);
    return block;
  }

  static #createRowElement(y) {
    const row = document.createElement('div');
    row.setAttribute('class', 'row');
    row.dataset.y = y;
    return row;
  }
}
