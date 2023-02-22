/**
 * Returns a string of form "abc...xyz"
 * @param {string} str string to string
 * @param {number} n number of chars to keep at front/end
 * @returns {string}
 */
export const getEllipsisTxt = (str, n) => {
  if (str) {
    return `${str.slice(0, n)}...${str.slice(str.length - n)}`
  }
  return ""
}

/**
 * Returns a string of form "abc.."
 * @param {string} str string to string
 * @param {number} n number of chars to keep at front
 * @returns {string}
 */
export const getTruncatedTxt = (str, n) => {
  return str?.length > n ? str.substring(0, n - 1) + "..." : str;
};