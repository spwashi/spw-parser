const FatalError = class extends Error {

}

let ERROR_MUST_BE_STRING   = 'Input must be a string';
let ERROR_CANNOT_BE_STRING = 'Cannot parse strings';

/**
 * Parser for the Spw Language
 *
 *
 * @param input {string} The input string to parse
 */
function parse(input) {
  const stringLength = input.length;
  if (typeof input !== 'string' || !stringLength) {
    throw new FatalError(ERROR_MUST_BE_STRING)
  }

  throw new FatalError(ERROR_CANNOT_BE_STRING);
}

function test() {
  __assertCannotBeString();
  return true;

  function __assertCannotBeString() {
    let error;
    try {
      parse(2)
    } catch (e) {
      error = e;
    }
    assert(
      error.message === ERROR_CANNOT_BE_STRING,
      'Must not be string'
    );
  }

  function assert(_test, msg = 'Failing Test') {
    if (_test) return;
    alert('Error!' + (msg));
    throw new Error(msg);
  }
}