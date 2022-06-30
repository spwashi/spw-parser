import {nominal}     from "../../../nodes/nominal/nominal.mjs";
import {numeric}     from "../../../nodes/numeric/numeric.mjs";
import {phrasal}     from "../../phrasal/phrasal.mjs";
import {container}   from "../../../nodes/container/container.mjs";
import {operational} from "../../../pragmatic/operational/operational.mjs";
import {common}      from "../../common/common.mjs";

export const permittedConstituents = [
  nominal, numeric, container,
  phrasal, common, operational
];