import {container} from "../../container/generator.mjs";

export function* definition(cursor) {
  let containers = new Map([]);
  let _container;
  while ((_container = yield* cursor.scan([container])) && (_container = _container.token())) {
    let set = containers.get(_container.head.proto) ?? [];
    set.push(_container)
    containers.set(_container.head.proto.name, set)
  }
  return containers;
}

export function* takeDefinition(cursor) {
  const containers = yield* definition(cursor);
  cursor.token({definition: containers});
  if (containers.size) {
    cursor.token({body: [...containers.values()]});
  }
}
