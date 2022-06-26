import {numeric}   from "./atomic/numeric/numeric.mjs";
import {nominal}   from "./atomic/nominal/nominal.mjs";
import {phrasal}   from "./relational/phrasal/phrasal.mjs";
import {common}    from "./relational/common/common.mjs";
import {ordinal}   from "./relational/ordinal/ordinal.mjs";
import {operation} from "./operational/operation/operation.mjs";
import {container} from "./atomic/container/container.mjs";

const atomic      = [numeric, nominal, container];
const relational  = [phrasal, common, ordinal];
const operational = [operation];

export const ALL_GENERATORS = [
  ...atomic,
  ...relational,
  ...operational,
];