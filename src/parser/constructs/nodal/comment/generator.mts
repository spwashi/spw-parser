export function* comment(start, prev) {
  const cursor = start.spawn(prev);

  cursor.token({kind: 'comment'});

  yield* cursor.log({message: 'checking comment'});

  if (cursor.curr() !== '/' || cursor.input?.[cursor.offset + 1] !== '/') {
    yield* cursor.log({
                        message: 'not comment',
                        miss:    'no comment prefix',
                      });
    cursor.token(false);
    return prev ?? false;
  }

  yield* cursor.take();
  yield* cursor.take();

  const body: any[] = [];

  while (cursor.curr() && cursor.curr() !== '\n' && cursor.curr() !== '\r') {
    body.push({key: cursor.curr()});
    yield* cursor.take();
  }

  cursor.token({head: {body: [{key: '/'}, {key: '/'}]}});
  cursor.token({body});

  return cursor;
}
