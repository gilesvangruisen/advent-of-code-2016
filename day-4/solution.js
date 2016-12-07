'use strict';

const fs = require('fs')

const roomFormat = /([a-z-]*)\-([0-9]*)\[([a-z]*)\]/i

function parseRoom(room) {
  const parse = room.match(roomFormat)

  return {
    raw: room,
    name: parse[1],
    sector: parseInt(parse[2]),
    checksum: parse[3],
  }
}

function isRealRoom(room) {
  const name = room.name.replace(/\-/g, ' ')
  const counts = countCharacters(name)
  const sorted = sortCharacters(counts)
  const topChars = sorted.slice(0, 5).join('')

  return topChars === room.checksum
}

function countCharacters(text) {
  return text.split('')
    .filter(c => (c !== ' ')).reduce((accum, char) => {
    accum[char] = (accum[char] || 0) + 1

    return accum
  }, {})
}

function sortCharacters(counts) {
  const characters = Object.keys(counts)
  return characters.sort((c1, c2) => {
    const diff = counts[c2] - counts[c1]

    if (diff === 0) {
      // a-z tie-breaker
      return alphaSort(c1, c2)
    }

    return diff
  })
}

function alphaSort(a, b) {
  if (a < b) {
    return -1
  } else if (a > b) {
    return 1
  } else {
    return 0
  }
}

function sectorSum(accum, room) {
  return accum + room.sector
}

function decryptRoom(room) {
  return {
    realName: decryptName(room.name, room.sector),
    raw: room.raw,
    name: room.name,
    sector: room.sector,
  }
}

function decryptName(name, sector) {
  return name.split('')
    .map((char) => {
      if (char === '-') {
        return ' '
      }

      return advanceChar(char, sector)
    }).join('')
}

function advanceChar(char, n) {
  const reduced = n % 26

  if (n === 0) {
    return char
  } else if (char === 'z') {
    return advanceChar('a', reduced - 1)
  } else {
    const next = String.fromCharCode(char.charCodeAt(0) + 1)
    return advanceChar(next, reduced - 1)
  }
}

const input = fs.readFileSync('input.txt', 'utf8')
const rooms = input.split('\n')

const realRooms = rooms
  .map(parseRoom)
  .filter(isRealRoom)

const sectorSums = realRooms
  .reduce(sectorSum, 0)

const searchForNorth = realRooms
  .map(decryptRoom)
  .filter(room => {
    return room.realName.indexOf('north') >= 0
  })

const room = searchForNorth[0]

console.log(`Total potential rooms: ${rooms.length}`)
console.log(`Total real rooms: ${realRooms.length}`)
console.log(`The sum of their sectors is: ${sectorSums}`)
console.log(`North Pole objects are stored in room with sector ID: ${room.sector}`)
