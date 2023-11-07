import {Body, BodyItem, Head, Tail} from './token/fragment.mjs';

export class AstNode {
  _seedNode;
  _trailingOperator;
  _head;
  _body;
  _tail;
  fillOperator;

  constructor(seed) {
    this._seedNode    = seed;
    this.fillOperator = getOperatorIterator(seed);
  }

  get seedNode() {
    return this._seedNode;
  }

  private initTail() {
    const node = this.seedNode;
    if (!node.tail) { return; }

    const isPrefixed = !!this._trailingOperator;
    const fragmentHead = node.tail;

    this._tail = new Tail(fragmentHead);

    return this._tail;
  }

  private initBody() {
    const node = this.seedNode;
    const body = node?.body;
    if (!body) { return; }

    const items:any[] = [];
    for (const item of body) {
      this._trailingOperator = this.fillOperator();
      items.push(new BodyItem(item, this._trailingOperator, false));
    }

    debugger;
    this._body = new Body(items);

    return this._body;
  }

  private initHead() {
    const node   = this.seedNode;
    let operator = this.fillOperator();
    if (node.head) {
      this._head = new Head(node.head, operator);
      operator   = undefined;
    }
    this._trailingOperator = operator;

    return this._head;
  }

  * produce() {
    const head = this.initHead();
    if (head) yield head;

    const body = this.initBody();
    if (body) yield body;

    const tail = this.initTail();
    if (tail) yield tail;
  }

}

function getOperatorIterator(iterable) {
  let i = 0;
  return function () {
    const operator = iterable.operators?.[i];
    i++;
    return operator;
  };
}