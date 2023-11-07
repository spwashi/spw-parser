import {AstNode} from '../node/node.mjs';

export class Scope {
  private _generation;

  private _context;

  private _root;

  constructor(parent, context = undefined) {
    this._generation = (parent?._generation ?? -1) + 1;
    this._context    = context ?? parent;
    this._root       = parent._root ?? parent;
  }

  spawn(context) {
    return new Scope(this, context);
  }

  key(item) {
    return item;
  }

  * loop(seed) {
    if (Array.isArray(seed)) {
      for (const i of seed) {
        yield seed;
      }
      return;
    }

    if (!seed) return;

    const node = new AstNode(seed);
    yield* node.produce();
  }

}