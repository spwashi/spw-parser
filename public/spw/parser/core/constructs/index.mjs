import {numeric} from "./basic/numeric/numeric.mjs";
import {nominal} from "./basic/nominal/nominal.mjs";
import {phrasal} from "./composite/phrasal/phrasal.mjs";

const basic     = [numeric, nominal];
const composite = [phrasal];

export const ALL_GENERATORS =
               [
                 ...basic,
                 ...composite
               ];