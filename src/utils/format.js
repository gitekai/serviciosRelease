const normalizeWhiteSpace = string => {
  console.log(string);
  return string.replace(/\s{2,}/g, " ").trim();
};
const upperCaseFirstLetters = string => {
  return string
    .split(" ")
    .map(word => `${word.charAt(0).toUpperCase()}${word.substr(1)}`)
    .join(" ");
};

const upperCaseHiphenFollowed = string => {
  return string
    .split("-")
    .map(word => `${word.charAt(0).toUpperCase()}${word.substr(1)}`)
    .join("-");
};

const toCursorHash = string => Buffer.from(string).toString("base64");
const fromCursorHash = string => {
  const result = Buffer.from(string, "base64").toString("ascii");
  return new Date(result).getTime() / 1000.0;
};

export {
  normalizeWhiteSpace,
  upperCaseFirstLetters,
  upperCaseHiphenFollowed,
  toCursorHash,
  fromCursorHash
};
