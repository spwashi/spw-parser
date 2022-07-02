function makeKey(token, context) {
  const operators = token.operators ?? [];
  const head      = token.head;
  const body      = token.body;
  const tail      = token.tail;

  function addItemToList(curr, list) {
    let item = curr.key;
    item     = item ?? curr.identify?.(context)?.[1];
    item     = item ?? '';
    if (Array.isArray(item)) return list.push(...item)
    return list.push(item);
  }

  const key = [head, ...body ?? [], tail,].reduce((obj, item) => {
    if (item) {
      addItemToList(item, obj.list);
    }
    let operator = operators[obj.i] ?? [];
    operator     = Array.isArray(operator) ? operator : [operator];
    operator.forEach(operator => {
      addItemToList(operator, obj.list)
    })
    return {...obj, i: obj.i + 1}
  }, {i: 0, list: []}).list;

  return context.generation ? [context.getId(token), key.flat().filter(Boolean)].filter(Boolean)
                            : [context.getId(token), key.flat().join('')].join('|')
}

export class Cursor {
  #token;
  #parent;
  start;
  end;
  offset;

  constructor(start, prev) {
    this.offset = start?.offset || 0;
    this.start  = prev?.start ?? this.offset;
    this.input  = start?.input;
    this.level  = typeof start?.level !== 'undefined' ? start.level + 1 : 0;
    if (start instanceof Cursor) {
      this.#parent = start;
    }
    this.#token = null;
  }

  setOffset(cursor) {
    this.offset = cursor.offset;
  }

  curr() {
    return this.input[this.offset];
  }

  * scan(generators, prev = undefined) {
    let activeCursor = prev;
    for (const generator of generators) {
      const cursor = yield* generator(this, activeCursor);
      const token  = cursor ? cursor.token() : false;
      if (!token) {
        continue;
      }
      this.setOffset(cursor);

      if (token !== activeCursor?.token())
        yield token;

      activeCursor = cursor;
    }

    return activeCursor;
  }

  advance() {
    this.offset = this.offset + 1;
  }

  pos() {
    return {
      kind:   'char',
      key:    this.curr(),
      offset: this.offset,
    };
  }

  token(token) {
    if (typeof token === "undefined") {
      return this.#token;
    }
    if (token === false) {
      this.#token = token;
      return this;
    }
    if (this.#token) {
      Object.assign(this.#token, token);
      return this;
    }
    this.#token = Object.assign({
                                  kind: undefined,
                                  // proto:    undefined,
                                  identify: function (parent = {generation: -1, threshold: 1}) {
                                    const context = {
                                      makeKey: makeKey,
                                      getId:   (token) => {
                                        switch (token.kind) {
                                          default:
                                            return token.cursor.start;
                                        }
                                      },
                                      ...parent,
                                      generation: parent.generation + 1,
                                    };
                                    return context.makeKey(this, context)
                                  },
                                  get _key() {
                                    return this.identify();
                                  },
                                  // operators: undefined,
                                  // label:     undefined,
                                  // head:      undefined,
                                  // body:      [],
                                  // tail:      undefined,
                                }, token, {cursor: this});

    return this;
  }

  toJSON() {
    const offset     = this.offset - 1;
    const startSplit = this.input.slice(0, this.start).split('\n');
    const startLine  = startSplit.length;
    const text       = this.input.slice(this.start, this.offset);
    const midSplit   = text.split('\n');
    return {
      level: this.level,
      start: {
        line:   startLine,
        col:    (startSplit.pop()?.length || 1) - 1,
        offset: this.start
      },
      end:   {
        line:   startLine + midSplit.length - 1,
        col:    (midSplit.pop()?.length || 1) - 1,
        offset: offset
      },
      text:  text,
      // parent: this.#parent?.level ? this.#parent : undefined
    }
  }
}

