export class Board {
  /**
   * Create a board out of svg elements with dataset of (x, y)
   * Change color of circle in block by changing fill
   * @param {Element} parentElement
   * @param {int} sizeX
   * @param {int} sizeY
   */
  static createBoard(parentElement, sizeX, sizeY, blockSize = 'default') {
    // Create a board element, attach blocks, and append to document
    blockSize = Board.#defineBlockSize(blockSize, sizeX, sizeY);
    const boardElement = document.createElement('div');
    boardElement.setAttribute('id', 'board');
    parentElement.appendChild(boardElement);
    if (sizeX < 6 || sizeY < 6) throw 'Board is too small min size is 6';
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

  static #defineBlockSize(blockSize, sizeX, sizeY) {
    // Get block size
    switch (blockSize) {
      //Dynamic settings make meautomatically calculate the blocksize
      //I take the smallest value of window height and width and divide in by the avg
      //amount of blocks in x and y times 0.8
      case 'dynamic':
        const w = window.innerWidth;
        const h = window.innerHeight;
        blockSize = (0.8 * (w > h ? h : w)) / (sizeX > sizeY ? sizeX : sizeY);
        break;
      // The default setting is 100 which works great for 7x7
      default:
        blockSize = 100;
    }
    return blockSize;
  }

  static #createBlockElement(blockSize, x, y) {
    // Creates a new block Element
    // A block element is basicaly a SVG element which is a special graphics element
    // with an svg circle element inside the circle's radius is 40% of the blocks size
    // and is placed in its center
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
    // A row element is pretty much just a div the css atached to it
    // that flexes it and set its direction to row
    const row = document.createElement('div');
    row.setAttribute('class', 'row');
    row.dataset.y = y;
    return row;
  }
}
