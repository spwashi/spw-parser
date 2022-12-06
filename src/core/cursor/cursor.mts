import {_debug} from "../../config.mts";
import {Token}  from "./token/token.mts";

export class Cursor {
  #token;
  #parent;

  offset;
  start;

  constructor(parent, former = undefined) {
    this.offset     = parent?.offset || 0;
    this.start      = former?.start ?? this.offset;
    this.input      = parent?.input;
    this.generators = parent?.generators;
    this.level      = typeof parent?.level !== 'undefined' ? parent.level + 1 : 0;
    this.#parent    = (former || parent) || undefined;
    this.#token     = null;
  }

  spawn(former) {
    const Constructor = this.constructor;
    return new Constructor(this, former);
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

  /**
   *
   * @param generators
   * @param former
   * @returns {Generator<*, undefined, *>}
   */
  * scan(generators = undefined, former = undefined) {
    generators = generators ?? this.generators;

    if (!generators) throw new Error('Cannot scan without generators');

    let activeCursor = former;

    for (const generator of generators) {
      const cursor = yield* generator(this, activeCursor);
      const token  = cursor ? cursor.token() : false;

      if (!token) continue;

      this.setOffset(cursor);

      if (token !== activeCursor?.token()) {
        yield cursor;
      }

      activeCursor = cursor;
    }

    return activeCursor;
  }

  /**
   *
   * @param item
   * @returns {Generator<string, void, *>}
   */
  * log(item) {
    if (_debug) {
      let tabs          = '\t'.repeat(this.level);
      const tabbedLabel = `${tabs}${this}`;
      yield tabbedLabel;
      const tabbedMessage = `${tabs}\t${item.message}`;
      yield tabbedMessage;
      if (item.miss) yield `${tabs}\t\treason: ${item.miss}`;
    }
  }

  /**
   *
   * @returns {Generator<{offset, kind: string}, {offset, kind: string}, *>}
   */
  * take() {
    let pos = this.pos();
    yield pos;
    this.advance();
    return pos;
  }

  /**
   *
   */
  advance() {
    this.offset = this.offset + 1;
  }

  pos() {
    return {
      kind:   'pos',
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
    return typeof cursor.offset !== 'undefined' && cursor.kind === 'pos';
  }
}

export class CharacterCursor extends Cursor {
  static isCharacterCursor(cursor) {
    return typeof cursor?.start !== 'undefined';
  }

  toString() {
    const json = this.toJSON();
    return `(line: ${json.start.line}, col: ${json.start.col})`
  }

  pos() {
    return {
      ...super.pos(),
      key: this.curr(),
    };
  }

  toJSON() {
    const offset     = this.offset - 1;
    const startSplit = this.input.slice(0, this.start).split('\n');
    const startLine  = startSplit.length;
    const text       = this.text;
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

  get text() {
    return this.input.slice(this.start, this.offset);
  }
}