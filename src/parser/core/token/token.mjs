import {Lens} from "../cursor/contexts/lens.mjs";

export class Token {
  kind;
  cursor;

  constructor(cursor) {
    this.cursor = cursor;
  }

  get identity() {
    const all     = [];
    const context = new Lens(this);
    for (const location of context.locate(this)) {
      let curr = [];
      for (let reduced of context.reduce(this, location)) {
        console.log(reduced)
        if (typeof reduced === 'undefined') { continue; }
        curr.push(reduced);
      }
      all.push(curr.flat().join(''))
    }

    return all;
  }
}