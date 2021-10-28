import { View } from './view.js';
import { Events } from './event.js';

export class Controller {
  #sizeX;
  #sizeY;
  #view;
  #model;
  constructor(parentElement, sizeX, sizeY) {
    this.#sizeX = sizeX;
    this.#sizeY = sizeY;
    this.#view = new View(parentElement, sizeX, sizeY);
    this.#subscribeEvents();
  }

  #subscribeEvents() {
    Events.subscribe('onBlockClick', this.#onBlockClick);
  }

  #onBlockClick(event) {
    alert(event.pos);
  }
}
