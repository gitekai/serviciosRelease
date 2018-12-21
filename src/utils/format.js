const normalizeWhiteSpace = (string) => {
  console.log(string)
  return string.replace(/\s{2,}/g, " ").trim();
};
const upperCaseFirstLetters = (string) => {
  return string.split(" ")
    .map(word => `${word.charAt(0).toUpperCase()}${word.substr(1)}`)
    .join(" ");
};

const upperCaseHiphenFollowed = (string) => {
  return string.split("-")
    .map(word => `${word.charAt(0).toUpperCase()}${word.substr(1)}`)
    .join("-");
};

export { normalizeWhiteSpace, upperCaseFirstLetters, upperCaseHiphenFollowed };
