import {_debug} from '../../config.mjs';
import {Token} from './token/token.mjs';

export class Cursor {
  readonly #parent;
  #token;
  offset;
  start;
  input;
  generators: GeneratorFunction[] | undefined;
  level;

  constructor(parent, former?: Cursor) {
    this.offset     = parent?.offset || 0;
    this.start      = former?.start ?? this.offset;
    this.input      = parent?.input;
    this.generators = parent?.generators;
    this.level      = typeof parent?.level !== 'undefined' ? parent.level + 1 : 0;
    this.#parent    = (former || parent) || undefined;
    this.#token     = null;
  }

  spawn(former) {
    const Constructor = this.constructor as typeof Cursor;
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

  * scan(generatorArray = undefined, former?: Cursor) {
    const generators = generatorArray ?? this.generators;
    if (!generators) throw new Error('Cannot scan without generators');


    let activeCursor = former;
    for (const generator of generators) {
      const cursor = yield* generator(this, activeCursor);
      const token  = cursor ? cursor.getToken() : false;

      if (!token) continue;

      this.setOffset(cursor);

      if (token !== activeCursor?.getToken()) {
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
      const tabs        = '\t'.repeat(this.level);
      const tabbedLabel = `${tabs}${this}`;
      yield tabbedLabel;
      const tabbedMessage = `${tabs}\t${item.message}`;
      yield tabbedMessage;
      if (item.miss) yield `${tabs}\t\treason: ${item.miss}`;
    }
  }
  
  __log_taken: any[] = [];
  /**
   *
   * @returns {Generator<{offset, kind: string}, {offset, kind: string}, *>}
   */
  * take() {
    const pos = this.pos();
    this.__log_taken.push(pos);
    yield pos;
    this.advance();
    return pos;
  }

  advance() {
    this.offset = this.offset + 1;
  }

  pos() {
    return {
      kind:   'pos',
      offset: this.offset,
    };
  }

  getToken() {
    return this.#token;
  }

  token(token) {
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
        offset: this.start,
      },
      end:   {
        line:   startLine + midSplit.length - 1,
        col:    (midSplit.pop()?.length || 1) - 1,
        offset: offset,
      },
      text:  text,
      // parent: this.#parent?.level ? this.#parent : undefined
    }
  }

  get text() {
    return this.input.slice(this.start, this.offset);
  }
}