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

  get #isTouchDevice() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  #addListeners() {
    // Subsribe to listeners
    this.#boardElement.addEventListener('click', this.#onBoardClick);
    this.#boardElement.addEventListener('touch', this.#onBoardClick);
    this.#boardElement.addEventListener('mouseover', this.#onMouseOverBoard);
    this.#boardElement.addEventListener('mouseout', this.#onMouseOutBoard);
    Events.subscribe('onGameEnd', this.#onGameEnd);
    Events.subscribe('onControllerConstructorEnd', this.#fazeBoard);
    Events.subscribe('onBlockPlaced', this.#onBlockPlaced);
    Events.subscribe('onTurnChanged', this.#onTurnChanged);
  }

  #onBoardClick = (event) => {
    // Add block
    const pos = this.#getBlockPos(event);
    Events.trigger('onBlockClick', { pos });
  };

  #onMouseOverBoard = (event) => {
    // Add hover event
    if (this.#isTouchDevice) return; //If touch device dont!
    const pos = this.#getBlockPos(event);
    Events.trigger('onBlockHover', { pos });
  };

  #onMouseOutBoard = (event) => {
    // Remove hover event
    if (this.#isTouchDevice) return; //If touch device dont!
    const pos = this.#getBlockPos(event);
    Events.trigger('onBlockOut', { pos });
  };

  #getBlockPos(event) {
    //Retrieves the pos dataset of the clicked element
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
    //Sets background of block according to pos and player
    //Selects the block with css selectors, each block a pos dataset
    //The color is based on a css class (player1 / player2)
    const posString = `${pos[0]},${pos[1]}`;
    const selector = `svg[data-pos="${posString}"]`;
    const circle = document.querySelector(selector).firstChild;
    if (player) circle.classList.add(`player${player}`);
    else {
      //If player is false remove hover background
      circle.classList.remove(`player1over`);
      circle.classList.remove(`player2over`);
    }
  }

  #clearBoard() {
    //Removes all blocks from board (change css rule)
    document.querySelectorAll('.circle').forEach((circle) => {
      circle.classList.remove('player1');
      circle.classList.remove('player2');
      circle.classList.remove('playerhighlight');
    });
  }

  #onGameEnd = async (event) => {
    //Block new clicks
    this.#boardElement.style.pointerEvents = 'none';
    //Give some time to render
    await this.#highlightWinProof(event.positions);
    document.body.style.backgroundColor =
      event.winner === 1 ? '#ff0000c2' : '#ffff00cf';
    setTimeout(() => {
      alert(`Player ${event.winner} won!`);
      this.#clearBoard();
      // Unblock clicks
      this.#boardElement.style.pointerEvents = '';
      // Reset body color
      document.body.style.backgroundColor = 'rgb(91, 149, 185)';
    }, 300);
  };

  #highlightWinProof = (positions) => {
    //Highlight the winning blocks
    return new Promise((resolve) => {
      setTimeout(() => {
        for (const pos of positions) {
          this.setBlock(pos, 'highlight');
        }
        resolve();
      }, 10);
    });
  };

  #fazeBoard = () => {
    //When the controller is done setting stuff up this will be called
    //This give the board 10 mili secs to render in the html page and then sets it opacity to 1
    //The #board has a css rule that transitions it in
    setTimeout(() => {
      this.#boardElement.style.opacity = 1;
    }, 10);
  };

  #onBlockPlaced = (event) => {
    // Once the block is placed I want to recall the hover event
    if (this.#isTouchDevice) return; // If touch device dont continue
    Events.trigger('onBlockHover', event);
  };

  #onTurnChanged = (event) => {
    //Here should be a cool player turn animation
  };
}
