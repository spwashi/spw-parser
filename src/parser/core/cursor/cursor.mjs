import {_debug} from "../constants.mjs";
import {Token}  from "../token/token.mjs";

export class Cursor {
  #token;
  #parent;
  start;
  offset;

  constructor(start, active) {
    this.offset  = start?.offset || 0;
    this.start   = active?.start ?? this.offset;
    this.input   = start?.input;
    this.level   = typeof start?.level !== 'undefined' ? start.level + 1 : 0;
    this.#parent = (active || start) || undefined;
    this.#token  = null;
  }

  get parent() {
    return this.#parent;
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

      if (token !== activeCursor?.token()) {
        yield cursor;
      }

      activeCursor = cursor;
    }

    return activeCursor;
  }

  * log(item) {
    if (_debug) {
      let tabs = '\t'.repeat(this.level);
      yield `${tabs}${this}`;
      yield `${tabs}\t${item.message}`;
      if (item.miss) yield `${tabs}\t\treason: ${item.miss}`;
    }
  }

  * take() {
    this.curr();
    let pos = this.pos();
    yield pos;
    this.advance();
    return pos;
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
    this.#token = this.#token ?? new Token(this);

    Object.assign(this.#token, token);
    return this;
  }

  static isCursorPosition(cursor) {
    if (!cursor) return false;
    return typeof cursor.offset !== 'undefined' && cursor.kind === 'char';
  }

  static isCursor(cursor) {
    return typeof cursor?.start !== 'undefined';
  }

  toString() {
    const json = this.toJSON();
    return `(line: ${json.start.line}, col: ${json.start.col})`
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