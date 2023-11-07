import {Scope} from './scope.mjs';
import {Cursor} from '../node/cursor.mjs';
import {ConstructGenerator} from '../../parser/constructs/constructs.mjs';

export class Lens {
  generators: ConstructGenerator[] = [];

  Cursor = Cursor;

  source: any;

  constructor(source: any = undefined) {
    this.source = source;
  }

  getCursor(input) {
    return new (this.Cursor)({input, generators: this.generators});
  }

  * locate(element) {
    yield new Scope(element);
  }
}