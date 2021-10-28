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
      const pos = event.target.dataset.pos.split(',');
      pos[0] = Number(pos[0]);
      pos[1] = Number(pos[1]);
      Events.trigger('onBlockClick', { pos });
    } else if (event.target.classList.contains('circle')) {
      const pos = event.target.parentElement.dataset.pos.split(',');
      pos[0] = Number(pos[0]);
      pos[1] = Number(pos[1]);
      Events.trigger('onBlockClick', { pos });
    }
  }

  setBlock(pos, player) {
    const posString = `${pos[0]},${pos[1]}`;
    const selector = `svg[data-pos="${posString}"]`;
    const circle = document.querySelector(selector).firstChild;
    circle.classList.add(`player${player}`);
  }
}
