'use strict';

const ipFormat = /(\[?[a-z]+\]?)/gi
const abbaFormat = /([a-z])(?!\1)([a-z])\2\1/gi
const abaFormat = /([a-z])(?!\1)([a-z])(?!\2)\1/gi

function parseIP(address) {
  const initial = {
    raw: address,
    hypernets: [],
    supernets: [],
  }

  return address.match(ipFormat)
    .reduce((accum, match) => {
      if (match.charAt(0) === '[') {
        accum.hypernets.push(match)
      } else {
        accum.supernets.push(match)
      }

      return accum
    }, initial)
}

function concatMatches(strs, format) {
  return strs.reduce((accum, str) => {
    return accum.concat(match(str, format))
  }, [])
}

function abaToBab(aba) {
  const c = aba.split('')
  return `${c[1]}${c[0]}${c[1]}`
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function match(str, pattern) {
  var _str = str;
  var matches = [];
  var match;

  while(!!(match = _str.match(pattern)) === true) {
    matches = matches.concat(match)

    _str = _str.substring(1)
  }

  return matches.filter(onlyUnique)
}

function supportsTLS(address) {
  const supernetMatches = concatMatches(address.supernets, abbaFormat)
  const hypernetMatches = concatMatches(address.hypernets, abbaFormat)

  return supernetMatches.length > 0 && hypernetMatches.length === 0
}

function supportsSSL(address) {
  const supernetMatches = concatMatches(address.supernets, abaFormat)
  const hypernetMatches = concatMatches(address.hypernets, abaFormat)

  return hypernetMatches.filter(match => {
    const inverse = abaToBab(match)
    return supernetMatches.indexOf(inverse) >= 0
  }).length > 0
}

const fs = require('fs')
const input = fs.readFileSync('input.txt', 'utf8')
const inputLines = input.split('\n')
const addresses = inputLines.map(parseIP)

const tsl = addresses.filter(supportsTLS)
const ssl = addresses.filter(supportsSSL)

console.log(`${tsl.length} address support TSL`)
console.log(`${ssl.length} address support SSL`)
