'use strict'

module.exports = string => {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string')
  }

  return string
    .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    .replace(/-/g, '\\x2d')
};
