import {Scope}  from "./scope/scope.mts";
import {Cursor} from "../cursor/cursor.mts";

export class Lens {
  generators = [];
  Cursor     = Cursor;

  constructor(source = undefined) {
    this.source = source;
  }

  source;

  getCursor(input) {
    return new (this.Cursor)({input, generators: this.generators});
  }

  * locate(element) {
    yield new Scope(element);
  }

  * reduce(node, context) {
    throw new Error('unimplemented')
  }
}

