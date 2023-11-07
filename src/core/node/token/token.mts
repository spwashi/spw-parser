import {RecursiveReductionLens} from '../../lens/recursiveReductionLens.mjs';

export class Token {
  static kindJunctionStr = ' + ';
  _kind: string[]        = [];
  cursor;
  head;
  body;
  tail;

  constructor(cursor) {
    this.cursor = cursor;
  }

  set kind(kind: string) {
    this._kind.push(kind)
  }

  get kind(): string {
    return this._kind.join(' ');
  }

  get identity() {
    const all: any[] = [];
    const lens       = new RecursiveReductionLens(this);
    for (const location of lens.locate(this)) {
      const curr = lens.reduce(this, location);
      curr && all.push(curr);
    }
    const self = [this.head, this.body, this.tail];
    const kind = this.kind;
    function keys(curr) {
      console.log({curr, self, kind});
      return curr.key ? curr.key
                      : (Array.isArray(curr) ? curr.map(keys).join('') : curr);
    }
    console.log({all});
    return all.reduce((all, curr) => '' + all + keys(curr), '')
  }

  toJSON() {
    return Object.fromEntries(
      Object.entries(
        {
          identity: this.identity,
          kind:     [...this._kind].join(Token.kindJunctionStr),
          head:     this.head,
          body:     this.body,
          tail:     this.tail,
        },
      ).filter(([, v]) => !!v))
  }
}