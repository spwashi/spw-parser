import {Scope} from "./scope.mjs";

export class Lens {
  constructor(source) {
    this.source = source;
  }

  source;

  * locate(element,) {
    yield element.cursor.parent <= this.source.cursor.parent ? undefined : '*';
  }


  * reduce(node, context) {
    if (typeof node === 'undefined') return;

    if (Array.isArray(node)) {
      for (let item of node) {
        yield* this.reduce(item, context);
      }
      return;
    }

    if (typeof node === 'string') {
      yield node;
      return
    }

    if (node.key) {
      yield node.key;
      return;
    }

    const next = new Scope(context);
    for (let item of next.loop(node)) {
      yield* this.reduce(item, next);
    }
  }
}