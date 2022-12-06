import {nominal}     from "../../nominal/generator.mts";
import {numeric}     from "../../numeric/generator.mts";
import {phrasal}     from "../../../operational/semantic/phrasal/generator.mts";
import {common}      from "../../../operational/semantic/common/generator.mts";
import {ordinal}     from "../../../operational/semantic/ordinal/generator.mts";
import {container}   from "../generator.mts";
import {operational} from "../../../operational/pragmatic/generator.mts";
import {literal}     from "../../literal/generator.mts";

export const containerPartOptions = [
  nominal,
  numeric,
  container,
  literal,
  phrasal,
  common,
  ordinal,
  operational
];