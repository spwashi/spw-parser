import {nominal}     from "../../nominal/nominal.mjs";
import {numeric}     from "../../numeric/numeric.mjs";
import {phrasal}     from "../../../relational/phrasal/phrasal.mjs";
import {common}      from "../../../relational/common/common.mjs";
import {ordinal}     from "../../../relational/ordinal/ordinal.mjs";
import {containing}  from "../containing.mjs";
import {operational} from "../../../operational/operational.mjs";

export const permittedConstituents = [
  nominal,
  numeric,
  containing,
  phrasal,
  common,
  ordinal,
  operational
];