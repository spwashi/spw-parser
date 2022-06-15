const FatalError = class extends Error {

}

let ERROR_MUST_BE_STRING = 'Input must be a string';
let ERROR_UNKNOWN_TOKEN  = `not sure what this is`;


function assertStringInput(input) {
  if (typeof input !== 'string' || !input.length) {
    throw new FatalError(ERROR_MUST_BE_STRING)
  }
}

function isStringStarter(char) {
  return /[a-zA-Z]/.test(char);
}

function canContinueString(char) {
  return isStringStarter(char) || (char === '_');
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

    const curr    = () => input[i];
    const peek    = () => input[i + 1];
    const advance = () => i++ && curr();
    const pos     = () => ({char: curr(), pos: {offset: i}});

    function* phraseGenerator(input) {
      if (!input) return;
      let tok = [];

      let prev = input;
      let char = curr();
      while (tok.push(prev) && (char) === ' ') {
        while ((char = curr()) && (char) === ' ') {
          yield pos();
          advance();
        }
        const string = yield* stringGenerator();
        if (!string) {
          return false;
        }
        prev = string;
      }

      if (tok.length === 1) return prev;


      return {type: 'phrase', token: tok};
    }

    function* stringGenerator() {
      let char;
      let tok    = [];
      let _check = isStringStarter;
      while ((char = curr()) && _check(char)) {
        tok.push(char);
        yield pos();
        advance();
        _check = canContinueString;
      }
      if (!tok.length) return false;
      return tok.length ? {type: 'string', token: tok.join('')} : false;
    }

    let prev;
    while (i < input.length) {
      let char = curr();
      if (!char) return;

      let token;

      token = yield* stringGenerator();
      if (!(prev || token)) {
        throw new Error('cannot')
      }
      token = (yield* phraseGenerator(token || prev));

      if (!token || (token === prev)) {
        throw new FatalError(`${ERROR_UNKNOWN_TOKEN}:'${curr()}' at ${i}`)
      }

      prev = token;
      yield token;
    }
  }

  if (asGenerator) {
    return loop();
  }

  let out = [];
  for (let v of loop()) {
    out.push(v);
  }
  return out;
}

function test() {
  __assertInputMustBeString();
  __assertInputCanBeOneStringWithoutThrowingErrors();

  return true;

  function __assertInputCanBeOneStringWithoutThrowingErrors() {
    let error = new Error('');
    try {
      parse('boon ')
    } catch (e) {
      error = e;
    }
    assert(error.message.split(':')[0] === ERROR_UNKNOWN_TOKEN);


    let out, expected;
    {
      out      = parse('boon');
      expected = JSON.stringify(['b', 'o', 'o', 'n', {type: 'string', token: 'boon'}]);
      assert(
        JSON.stringify(out) === expected,
        'should have received: ' + expected + '. Actually received: ' + JSON.stringify(out)
      );
    }

    {
      error = null;
      try {
        out = parse('boon-boon-boon');
      } catch (e) {
        error = e;
      }
      assert(error === null)
    }
  }

  function __assertInputMustBeString() {
    let error;
    try {
      parse(2)
    } catch (e) {
      error = e;
    }
    assert(error.message === ERROR_MUST_BE_STRING, 'Did not throw correct error.');
  }

  function assert(_test, msg = 'Failing Test') {
    if (_test) return;
    alert('Error!' + (msg));
    throw new Error(msg);
  }
}