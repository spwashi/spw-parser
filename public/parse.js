const FatalError = class extends Error {

}

function parse(string) {
  alert(string);

  throw new FatalError('Cannot parse strings');
}