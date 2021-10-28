import { Board } from './board.js';
import { Events } from './event.js';
export class View {
  #boardElement;
  constructor(parentElement, sizeX, sizeY) {
    this.#boardElement = Board.createBoard(parentElement, sizeX, sizeY);
    Events.addEvent('onBlockClick');
    this.#addListeners();
  }

  #addListeners() {
    this.#boardElement.addEventListener('click', this.#onBoardClick);
  }

  #onBoardClick(event) {
    if (event.target.classList.contains('block')) {
      const pos = event.target.dataset.pos;
      Events.trigger('onBlockClick', { pos });
    } else if (event.target.classList.contains('circle')) {
      const pos = event.target.parentElement.dataset.pos;
      Events.trigger('onBlockClick', { pos });
    }
  }
}
