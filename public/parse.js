const FatalError = class extends Error {

}

let ERROR_MUST_BE_STRING   = 'Input must be a string';
let ERROR_CANNOT_BE_STRING = 'Cannot parse strings';

function assertStringInput(input) {
  if (typeof input !== 'string' || !input.length) {
    throw new FatalError(ERROR_MUST_BE_STRING)
  }
}

/**
 * Parser for the Spw Language
 *
 *
 * @param input {string} The input string to parse
 * @param asGenerator {boolean?} Whether to loop through the generator or return it.
 */
function parse(input, asGenerator = false) {
  assertStringInput(input);

  function* loop() {
    let i = 0;
    while (i < input.length) {
      yield input[i];
      i++;
    }
  }

  if (asGenerator) {
    return loop();
  }

  let out = [];
  for (let v of loop()) {
    console.log(v);
    out.push(v);
  }
  return out;
}

function test() {
  __assertMustBeString();

  return true;

  function __assertMustBeString() {
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