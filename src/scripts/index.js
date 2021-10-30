import { Controller } from './controller.js';
import '../styles/styles.css';
const parentElement = document.querySelector('main');
document.querySelector('#start').addEventListener('click', () => {
  const x = Number(document.querySelector('#sizeX').value);
  const y = Number(document.querySelector('#sizeY').value);
  document.querySelector('#welcome').hidden = true;
  new Controller(parentElement, x, y);
});
