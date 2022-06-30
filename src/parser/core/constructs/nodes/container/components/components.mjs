import {nominal}     from "../../nominal/nominal.mjs";
import {numeric}   from "../../numeric/numeric.mjs";
import {phrasal} from "../../../semantic/phrasal/phrasal.mjs";
import {common}  from "../../../semantic/common/common.mjs";
import {ordinal} from "../../../semantic/ordinal/ordinal.mjs";
import {container}   from "../container.mjs";
import {operational} from "../../../pragmatic/operational/operational.mjs";

export const permittedConstituents = [
  nominal,
  numeric,
  container,
  phrasal,
  common,
  ordinal,
  operational
];