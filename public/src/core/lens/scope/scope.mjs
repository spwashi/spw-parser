export class TokenFragment {
  _head;
  _operator;

  constructor(head, operator = undefined, isPrefixed = false) {
    this._head       = head
    this._operator   = operator;
    this._isPrefixed = isPrefixed;

  }

  operator(operator) {
    if (!operator) return this._operator
    this._operator = operator;
  }

  get parts() {
    let parts = [this._head, this._operator].filter(Boolean);
    return this._isPrefixed ? parts.reverse() : parts;
  }
}

class Head extends TokenFragment {
}

export class BodyItem extends TokenFragment {
  get parts() {
    return this._isPrefixed ? super.parts.reverse() : super.parts;
  }
}

class Body extends TokenFragment {
}

class Tail extends TokenFragment {
}

class NodeBuilder {
  _seedNode;
  _trailingOperator;
  _tail;

  constructor(node) {
    this._seedNode    = node;
    this.fillOperator = getOperatorIterator(node);
  }

  get seedNode() {
    return this._seedNode;
  }

  initTail() {
    const node = this.seedNode;
    if (!node.tail) { return; }

    this._tail = new Tail(node.tail, this._trailingOperator, !!this._trailingOperator);

    return this._tail;
  }

  initBody() {
    const node = this.seedNode;
    const body = node?.body;
    if (!body) { return; }

    const items = [];
    for (const item of body) {
      items.push(new BodyItem(item, this._trailingOperator, false));
      this._trailingOperator = this.fillOperator();
    }

    this._body = new Body(items);

    return this._body;
  }

  initHead() {
    const node   = this.seedNode;
    let operator = this.fillOperator();
    if (node.head) {
      this._head = new Head(node.head, operator);
      operator   = undefined;
    }
    this._trailingOperator = operator;

    return this._head;
  }

  * generate() {
    const head = this.initHead();
    if (head) yield  head;

    const body = this.initBody();
    if (body) yield  body;

    const tail = this.initTail();
    if (tail) yield  tail;
  }

}

function getOperatorIterator(iterable) {
  let i = 0;
  return function () {
    let operator = iterable.operators?.[i];
    i++;
    return operator;
  };
}

export class Scope {
  constructor(parent, context) {
    this.generation = (parent?.generation ?? -1) + 1;
    this.context    = context ?? parent;
    this.root       = parent.root ?? parent;
  }

  spawn(context) {
    return new Scope(this, context);
  }

  key(item) {
    return item;
  }

  check(node) {
    return !!node;
  }

  get prefix() {
    if (!this.doPrefix) return;
    return `{`
  }

  get doPrefix() {
    return false; //(this.generation === 4);
  }

  get suffix() {
    if (!this.doPrefix) return;
    return '}';
  }

  * loop(_node) {
    if (Array.isArray(_node)) {
      for (let i of _node) {
        yield _node;
      }
      return;
    }

    if (!this.check(_node)) return;

    const nodeBuilder = new NodeBuilder(_node);
    if (this.prefix)
      yield this.prefix;


    yield* nodeBuilder.generate();

    if (this.suffix)
      yield this.suffix;
  }

}