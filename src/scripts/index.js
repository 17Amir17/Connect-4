import { Controller } from './controller.js';

const parentElement = document.querySelector('main');
const game = new Controller(parentElement, 7, 7);
