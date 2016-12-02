'use strict';

const fs = require('fs')

const KeypadLayout = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]

const FancyKeypadLayout = [
  [undefined, undefined, 1, undefined, undefined],
  [undefined, 2, 3, 4, undefined],
  [5, 6, 7, 8, 9],
  [undefined, 'A', 'B', 'C', undefined],
  [undefined, undefined, 'D', undefined, undefined],
]

const DirectionDelta = {
  U: [-1, 0],
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
}

const StartKeyPosition = [1, 1] // 5

function getKey(layout, position) {
  const v = position[0]
  const h = position[1]

  if (layout[v]) {
    return layout[v][h]
  }
}

const Keypad = function(layout) {
  return {
    layout,
    history: [StartKeyPosition],
    digits: [],

    position: function() {
      return this.history[this.history.length - 1]
    },

    move: function(direction) {
      const delta = DirectionDelta[direction]
      const newKeyPosition = [
        this.position()[0] + delta[0],
        this.position()[1] + delta[1],
      ]

      if (getKey(this.layout, newKeyPosition)) {
        this.history.push(newKeyPosition)
      }
    },

    recordDigit: function() {
      const key = getKey(this.layout, this.position())

      this.digits.push(key)
    },

    code: function() {
      return this.digits.join('')
    }
  }
}

const keypad = new Keypad(KeypadLayout)
const fancyKeypad = new Keypad(FancyKeypadLayout)

const instructionsText = fs.readFileSync(__dirname + '/input.txt', 'utf8')
const instructions = instructionsText.trim().split('\n')

instructions.forEach((instruction) => {
  const moves = instruction.split('')

  moves.forEach(keypad.move.bind(keypad))
  moves.forEach(fancyKeypad.move.bind(fancyKeypad))

  keypad.recordDigit()
  fancyKeypad.recordDigit()
})

console.log(`Keypad code is: ${keypad.code()}`)
console.log(`Fancy keypad code is: ${fancyKeypad.code()}`)
