import {parse} from "../parse.mjs";

export let ERROR_INPUT_MUST_BE_STRING = 'Input must be a string';

var alert = typeof alert !== 'undefined' ? alert : console.error;

test()

function test() {
  __assertInputMustBeString();
  __assertInputCanBeOneAnchorWithoutThrowingErrors();

  return true;

  function __assertInputCanBeOneAnchorWithoutThrowingErrors() {
    {
      let out, expected;
      out = parse('boon ');
      assert(out === false, 'incorrectly parsing trailing space - [' + JSON.stringify(out) + ']');
    }
    {
      let out, expected;
      out      = parse('boon');
      expected = JSON.stringify({"kind": "nominal", "key": "boon"});
      assert(
        JSON.stringify(out) === expected,
        'should have received: ' + expected + '. Actually received: ' + JSON.stringify(out)
      );
    }

  }

  function __assertInputMustBeString() {
    let error;
    try {
      parse(2)
    } catch (e) {
      error = e
    }
    assert(error.message === ERROR_INPUT_MUST_BE_STRING, 'Did not throw correct error.');
  }

  function assert(_test, msg) {
    if (!msg) throw new Error('Expected a message')
    if (_test) return;
    alert('Error!' + (msg));
    throw new Error(msg);
  }
}