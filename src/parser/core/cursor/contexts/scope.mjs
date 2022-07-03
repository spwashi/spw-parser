export class Scope {
  constructor(context) {
    this.generation = (context?.generation ?? -1) + 1;
    this.context    = context;
  }

  check(node) { return !!node; }

  * loop(iterable) {
    const inStringContext = typeof this.context === 'string';

    let i = 0;
    if (inStringContext) {
      yield `<${this.context}|`;
    }

    function* operator() {
      const operators = iterable.operators;
      if (operators?.[i]) {
        if (Array.isArray(operators?.[i])) {
          for (let operator of operators[i]) {
            if (operator) yield operator;
          }
        }
      }
    }

    if (!this.check(iterable)) return;

    yield iterable.head;

    yield* operator();

    for (const sub of iterable.body ?? []) {
      yield sub;
      yield* operator();
    }

    yield  iterable.tail;

    if (inStringContext) yield '>'
  }
}