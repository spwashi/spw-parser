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

  * scan(generators) {
    let activeCursor = undefined;
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
      char:   this.curr(),
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
    this.#token = Object.assign(token, {cursor: this});

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

