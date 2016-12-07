'use strict';

const fs = require('fs')

function countCharacters(messages) {
  return messages.reduce((accum, message) => {
    message.split('').forEach((char, i) => {
      if (!accum[i]) { accum[i] = {} }
      if (!accum[i][char]) { accum[i][char] = 0 }

      accum[i][char] = accum[i][char] + 1
    })

    return accum
  }, {})
}

function sortCounts(counts) {
  return Object.keys(counts).sort((k1, k2) => {
    return counts[k1] - counts[k2]
  })
}

function mostCommonCharacter(counts) {
  const sorted = sortCounts(counts)

  return sorted[sorted.length - 1]
}

function leastCommonCharacter(counts) {
  const sorted = sortCounts(counts)

  return sorted[0]
}

function decodeMessage(messages, findCharacter) {
  const characterCounts = countCharacters(messages)

  return Object.keys(characterCounts)
    .reduce((accum, position) => {
      const counts = characterCounts[position]
      const topCharacter = findCharacter(counts)

      var message =  accum.split('')
      message[position] = topCharacter

      return message.join('')
    }, '_____')
}


const input = fs.readFileSync('input.txt', 'utf8')
const inputMessages = input.split('\n')

const highMessage = decodeMessage(inputMessages, mostCommonCharacter)
const lowMessage = decodeMessage(inputMessages, leastCommonCharacter)

console.log(`The message by highest frequency is: ${highMessage} (part 1)`)
console.log(`The message by lowest frequency is: ${lowMessage} (part 2)`)
