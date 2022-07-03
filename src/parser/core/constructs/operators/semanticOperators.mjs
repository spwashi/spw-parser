const openConcept                         = {name: 'open-conceptual', key: '<', opposite: '>', kind: 'delimiter', open: true};
const openLocation                        = {name: 'open-locational', key: '(', opposite: ')', kind: 'delimiter', open: true};
const openStructure                       = {name: 'open-structural', key: '{', opposite: '}', kind: 'delimiter', open: true};
const openEssence                         = {name: 'open-essential ', key: '[', opposite: ']', kind: 'delimiter', open: true};
const closeConcept                        = {name: 'close-conceptual', key: '>', opposite: '<', kind: 'delimiter', close: true};
const closeLocation                       = {name: 'close-locational', key: ')', opposite: '(', kind: 'delimiter', close: true};
const closeStructure                      = {name: 'close-structural', key: '}', opposite: '{', kind: 'delimiter', close: true};
const closeEssence                        = {name: 'close-essential ', key: ']', opposite: '[', kind: 'delimiter', close: true};
const openContainerDelimitingOperators    =
        {
          '<': openConcept,
          '(': openLocation,
          '{': openStructure,
          '[': openEssence,

          _inverse: {
            '>': openConcept,
            ')': openLocation,
            '}': openStructure,
            ']': openEssence,
          }
        };
const closeContainerDelimitingOperators   = {
  '>':      closeConcept,
  ')':      closeLocation,
  '}':      closeStructure,
  ']':      closeEssence,
  _inverse: {
    '<': closeConcept,
    '(': closeLocation,
    '{': closeStructure,
    '[': closeEssence,
  }
};
export const containerDelimitingOperators =
               {
                 open:  openContainerDelimitingOperators,
                 close: closeContainerDelimitingOperators
               };
export const commonDelimitingOperators    = {
  ',': {name: 'common', key: ',', kind: 'delimiter'}
};
export const ordinalDelimitingOperators   = {
  ';':  {name: 'ordinal', key: ';', kind: 'delimiter'},
  '\n': {name: 'ordinal', key: ';', kind: 'delimiter'}
};
export const phrasalDelimitingOperators   = {
  ' ': {name: 'phrasal', key: ' ', kind: 'delimiter'}
};