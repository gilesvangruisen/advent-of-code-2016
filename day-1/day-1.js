'use strict';

const fs = require('fs')

const Direction = {
  North: 0,
  East: 1,
  South: 2,
  West: 3,
}

const DirectionDelta = {
  L: -1,
  R: 1,
}

const PositionDelta = {
  North: { x: 0, y: 1 },
  East: { x: 1, y: 0 },
  South: { x: 0, y: -1 },
  West: { x: -1, y: 0 },
}

const Santa = function () {
  return {
    history: [{ x: 0, y: 0 }],
    direction: Direction.North,

    position: function() {
      return this.history[this.history.length - 1]
    },

    turn: function(direction) {
      const newDirection = this.direction + DirectionDelta[direction]

      if (newDirection > 3) {
        this.direction = 0
      } else if (newDirection < 0) {
        this.direction = 3
      } else {
        this.direction = newDirection
      }
    },

    moveForward: function() {
      const direction = Object.keys(Direction)[this.direction]
      const delta = PositionDelta[direction]

      const newPosition = {
        x: this.position().x + delta.x,
        y: this.position().y + delta.y,
      }

      this.history.push(newPosition)
    },

    revisits: function() {
      const visitCounts = this.history
        .reduce((accum, position) => {
          const key = JSON.stringify(position)
          accum[key] = (accum[key] || 0) + 1

          return accum
        }, {})

      return Object.keys(visitCounts)
        .filter((position) => {
          return visitCounts[position] > 1
        })
        .map(JSON.parse)
    }
  }
}

function doNTimes(n, f) {
  Array.from(Array(n)).forEach(f)
}

function distanceFromOrigin(position) {
  return Math.abs(position.x) + Math.abs(position.y)
}

const instructionsText = fs.readFileSync('input.txt', 'utf8')
const instructions = instructionsText.split(', ')
  .map((instruction) => {
    return {
      direction: instruction.substring(0, 1),
      stepCount: parseInt(instruction.substring(1)),
    }
  })

var santa = new Santa()

instructions.forEach((instruction) => {
  santa.turn(instruction.direction)
  doNTimes(instruction.stepCount, santa.moveForward.bind(santa))
})

const totalDistance = distanceFromOrigin(santa.position())
const firstRevisit = santa.revisits()[0]
const firstRevisitDistance = distanceFromOrigin(firstRevisit)

console.log(`Blocks from start: ${totalDistance}`)
console.log('First revisited:', firstRevisit)
console.log(`First revisited blocks from start: ${firstRevisitDistance}`)
