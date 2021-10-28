import { Board } from './board.js';
import { Events } from './event.js';
export class View {
  #boardElement;
  constructor(parentElement, sizeX, sizeY) {
    this.#boardElement = Board.createBoard(
      parentElement,
      sizeX,
      sizeY,
      'dynamic'
    );
    Events.addEvent('onBlockClick');
    Events.addEvent('onBlockHover');
    Events.addEvent('onBlockOut');
    this.#addListeners();
  }

  #addListeners() {
    this.#boardElement.addEventListener('click', this.#onBoardClick);
    this.#boardElement.addEventListener('mouseover', this.#onMouseOverBoard);
    this.#boardElement.addEventListener('mouseout', this.#onMouseOutBoard);
    Events.subscribe('onGameEnd', this.#onGameEnd);
  }

  #onBoardClick = (event) => {
    const pos = this.#getBlockPos(event);
    Events.trigger('onBlockClick', { pos });
  };

  #onMouseOverBoard = (event) => {
    const pos = this.#getBlockPos(event);
    Events.trigger('onBlockHover', { pos });
  };

  #onMouseOutBoard = (event) => {
    const pos = this.#getBlockPos(event);
    Events.trigger('onBlockOut', { pos });
  };

  #getBlockPos(event) {
    if (event.target.classList.contains('block')) {
      const pos = event.target.dataset.pos.split(',');
      pos[0] = Number(pos[0]);
      pos[1] = Number(pos[1]);
      return pos;
    } else if (event.target.classList.contains('circle')) {
      const pos = event.target.parentElement.dataset.pos.split(',');
      pos[0] = Number(pos[0]);
      pos[1] = Number(pos[1]);
      return pos;
    }
    return false;
  }

  setBlock(pos, player) {
    const posString = `${pos[0]},${pos[1]}`;
    const selector = `svg[data-pos="${posString}"]`;
    const circle = document.querySelector(selector).firstChild;
    if (player) circle.classList.add(`player${player}`);
    else {
      //If player is false remove hover
      circle.classList.remove(`player1over`);
      circle.classList.remove(`player2over`);
    }
  }

  #clearBoard() {
    document.querySelectorAll('.circle').forEach((circle) => {
      circle.classList.remove('player1');
      circle.classList.remove('player2');
    });
  }

  #onGameEnd = (event) => {
    //Give some time to render
    setTimeout(() => {
      alert(`Player ${event.winner} won!`);
      this.#clearBoard();
    }, 10);
  };
}
