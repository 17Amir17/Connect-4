import { Controller } from './controller.js';
import '../styles/styles.css';
import { Events } from './event.js';
const parentElement = document.querySelector('main');
document.querySelector('#start').addEventListener('click', () => {
  const x = Number(document.querySelector('#sizeX').value);
  const y = Number(document.querySelector('#sizeY').value);
  document.querySelector('#welcome').hidden = true;
  try {
    new Controller(parentElement, x, y);
  } catch (error) {
    alert(error);
    document.querySelector('#welcome').hidden = false;
    Events.clearEvents();
  }
});
