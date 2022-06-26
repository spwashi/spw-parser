export function Cursor({i = 0, input = undefined, prev = undefined}) {
  this.i     = i;
  this._i    = i;
  this.prev  = prev;
  this.input = input || prev?.input;
}

Cursor.prototype.reset   = function (i) { return this.i = i ?? this._i; };
Cursor.prototype.curr    = function () { return this.input[this.i]; };
Cursor.prototype.advance = function () { return this.i = this.i + 1; };
Cursor.prototype.pos     = function () {
  return {
    char:   this.curr(),
    offset: this.i,
    prev:   this.prev,
  };
}