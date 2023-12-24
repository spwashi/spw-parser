import {TokenFragment} from '../node/token/fragment.mjs';
import {Lens} from './lens.mjs';

export class RecursiveReductionLens extends Lens {
  static doFlatten = true;

  reduce(element, context: any = undefined) {
    if (element instanceof TokenFragment) {
      return this._reduceArray(element.parts, context);
    }

    if (typeof element === 'undefined' || (element === null)) {
      this._reduceNothing();
      return;
    }

    if (Array.isArray(element)) {
      return this._reduceArray(element, context);
    }

    if (typeof element === 'string') {
      return this._reduceString();
    }

    if (element.key) {
      return this._reduceAtom(element, context);
    }

    return this._reduceNode(element, context);
  }

  private _reduceNode(node, context) {
    const scope        = context.spawn(node);
    const items: any[] = [];
    for (const item of scope.loop(node)) {
      const el = this.reduce(item, scope);
      el && items.push(el);
    }

    const key  = RecursiveReductionLens.doFlatten ? items.flat() : items;
    const nest = RecursiveReductionLens.doFlatten ? false : !context.generation;
    return nest ? {kind: node.kind, key} : key;
  }

  private _reduceNothing() {

  }

  private _reduceAtom(node, context) {
    return context.key(node);
  }

  private _reduceString() {
    return null;
  }

  private _reduceArray(node, context) {
    const items: any[] = [];
    for (const item of node) {
      const reduced = this.reduce(item, context);
      if (!reduced) continue;
      items.push(reduced);
    }
    if (items.length < 2) return items[0];
    return items.flat();
  }
}