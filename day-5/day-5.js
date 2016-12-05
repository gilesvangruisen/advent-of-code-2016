'use strict'

const md5 = require('./md5')

function decodePart1(input) {
  var i = 0
  var code = ''

  while (code.length < 8) {
    const hash = md5(`${input}${i}`)

    if (hash.substring(0,5) === '00000') {
      console.log(`The next letter is`, hash.substring(5,6))
      code += hash.substring(5,6)
    }

    i++
  }

  return code
}

function decodePart2(input) {
  var i = 0
  var code = Array.from(Array(8))

  while (code.join('').length < 8) {
    const hash = md5(`${input}${i}`)

    const pos = parseInt(hash.substring(5, 6))
    const char = hash.substring(6, 7)

    if (isNextCharacter(hash, pos, code)) {
      code[pos] = char
      console.log('The next letter is', char)
      console.log('It was found at', i, hash)
      console.log('It will be at position', pos)
      console.log('The code so far is: ', formatCode(code))
    }

    i++
  }

  return code.join('')
}

function formatCode(code) {
  return code.map(char => {
    if (char === undefined) {
      return '_'
    } else {
      return char
    }
  }).join('')
}

function isNextCharacter(hash, pos, code) {
  const firstFive = hash.substring(0, 5)

  return firstFive === '00000'
      && pos !== undefined
      && pos < 8
      && !code[pos]
}

const input = 'cxdnnyjw'
const password = decodePart2(input)
console.log(`The door password is: `,password)
