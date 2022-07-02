import {container} from "../../container/container.mjs";

export function* trailingContainers(cursor) {
  let containers = new Map([]);
  let _container;
  while ((_container = yield* cursor.scan([container])) && (_container = _container.token())) {
    let set = containers.get(_container.head.proto) ?? new Set();
    set.add(_container)
    containers.set(_container.head.proto, set)
  }
  return containers;
}