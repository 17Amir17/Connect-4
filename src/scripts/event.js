export class Events {
  /**
   * Custom events Class
   * I create my own events, subscribe to them by name
   * Trigger them by name
   * Trigger calls all methods subscribed
   */
  static #events = {};

  static addEvent(name) {
    if (name in this.#events) throw 'Event already exists';
    this.#events[name] = [];
  }

  static subscribe(name, cb) {
    if (!(name in this.#events)) throw 'Event not found!';
    this.#events[name].push(cb);
  }

  static trigger(name, data) {
    if (!(name in this.#events)) throw 'Event not found!';
    for (const cb of this.#events[name]) {
      if (data) cb(data);
      else cb();
    }
  }
}
