export class Cursor {
  #token;

  constructor(prev) {
    this.offset = prev?.offset || 0;
    this.start  = this.offset;
    this.input  = prev?.input;
    if (prev instanceof Cursor) {
      this.parent = prev;
    }
    this.#token = null;
  }

  setOffset(i) { return this.offset = i ?? this.start; }

  curr() { return this.input[this.offset]; }

  advance() {
    return this.offset = this.offset + 1;
  }

  pos() {
    return {
      char:   this.curr(),
      offset: this.offset,
    };
  }

  token(token = {}) {
    if (this.#token) {
      return Object.assign(this.#token, token);
    }
    return this.#token = Object.assign(token, {cursor: this});
  }

  toJSON() {
    return {
      start: this.start,
      end:   this.offset,
      text:  this.input.slice(this.start, this.offset),
    }
  }
}

