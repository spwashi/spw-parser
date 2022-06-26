import {nominal}     from "../../nominal/nominal.mjs";
import {numeric}     from "../../numeric/numeric.mjs";
import {phrasal}     from "../../../relational/phrasal/phrasal.mjs";
import {common}      from "../../../relational/common/common.mjs";
import {ordinal}     from "../../../relational/ordinal/ordinal.mjs";
import {container} from "../container.mjs";
import {operation} from "../../../operational/operation/operation.mjs";

export const permittedConstituents = [
  nominal, numeric, container,
  phrasal, common, ordinal,
  operation
];