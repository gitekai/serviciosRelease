import {
  normalizeWhiteSpace,
  upperCaseFirstLetters,
  upperCaseHiphenFollowed,
  fromCursorHash,
  toCursorHash
} from "./format";

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

export {
  pipe,
  normalizeWhiteSpace,
  upperCaseFirstLetters,
  upperCaseHiphenFollowed,
  fromCursorHash,
  toCursorHash
};
