import {Lens}          from "../../lens/lens.mjs";
import {TokenFragment} from "../../lens/scope/scope.mjs";

class RecursiveReductionLens extends Lens {
  static doFlatten = true;

  reduce(node, context) {
    if (node instanceof TokenFragment) {
      return this._reduceArray(node.parts, context);
    }

    if (typeof node === 'undefined' || (node === null)) {
      this._reduceNothing();
      return;
    }

    if (Array.isArray(node)) {
      return this._reduceArray(node, context);
    }

    if (typeof node === 'string') {
      return this._reduceString(node);
    }

    if (node.key) {
      return this._reduceAtom(node, context);
    }

    return this._reduceNode(node, context);
  }

  _reduceNode(node, context) {
    const scope = context.spawn(node);
    const items = [];
    for (const item of scope.loop(node)) {
      const el = this.reduce(item, scope);
      el && items.push(el);
    }
    const key = RecursiveReductionLens.doFlatten ? items.flat() : items;
    const nest  = RecursiveReductionLens.doFlatten ? false : !context.generation;
    return nest ? {kind: node.kind, key} : key;
  }

  _reduceNothing() {

  }

  _reduceAtom(node, context) {
    return context.key(node);
  }

  _reduceString() {
    return null;
  }

  _reduceArray(node, context) {
    const items = [];
    for (const item of node) {
      const reduced = this.reduce(item, context);
      if (!reduced) continue;
      items.push(reduced);
    }
    if (items.length < 2) return items[0];
    return items.flat();
  }
}

export class Token {
  // joins the token kind
  static kindJunctionStr = ' + ';

  _kind = [];
  cursor;

  constructor(cursor) {
    this.cursor = cursor;
  }

  set kind(kind) {
    this._kind.push(kind)
  }

  get kind() {
    return this._kind;
  }

  get identity() {
    const all  = [];
    const lens = new RecursiveReductionLens(this);
    for (const location of lens.locate(this)) {
      const curr = lens.reduce(this, location);
      curr && all.push(curr);
    }

    function keys(curr) {
      return curr.key ? curr.key : (Array.isArray(curr) ? curr.map(keys).join('') : curr);
    }

    return all.reduce((all, curr) => '' + all + keys(curr), '')
  }

  toJSON() {
    return Object.fromEntries(Object.entries({
                                               identity: this.identity,
                                               kind:     [...this.kind].join(Token.kindJunctionStr),
                                               head:     this.head,
                                               body:     this.body,
                                               tail:     this.tail,
                                             }).filter(([, v]) => !!v))
  }
}