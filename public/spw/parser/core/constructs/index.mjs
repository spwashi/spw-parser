import {numeric} from "./basic/numeric/numeric.mjs";
import {nominal} from "./basic/nominal/nominal.mjs";
import {phrasal} from "./composite/phrasal/phrasal.mjs";
import {common}  from "./composite/common/common.mjs";

const basic     = [numeric, nominal];
const composite = [phrasal, common];

export const ALL_GENERATORS =
               [
                 ...basic,
                 ...composite
               ];