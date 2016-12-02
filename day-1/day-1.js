'use strict';

var fs = require('fs')

const stepsText = fs.readFileSync('input.txt', 'utf8')
const steps = stepsText.split(', ')

var santa = {
  history: [{ x: 0, y: 0 }],
  visitCounts: {},
  position: function() {
    return this.history[this.history.length - 1]
  },
  _direction: 0,

  direction: function() {
    if (this._direction >= 0) {
      return this._direction % 4
    } else if ((this._direction % 2) !== 0) {
      return Math.abs((this._direction - 2) % 4)
    } else {
      return Math.abs(this._direction % 4)
    }
  },

  turn: function(direction) {
    if (direction === 'R') {
      this._direction = this._direction + 1
    } else if (direction === 'L') {
      this._direction = this._direction - 1
    }
  },

  takeStep: function() {
    var nextPosition = this.position()

    switch(this.direction()) {
      case 0:
        nextPosition.y = nextPosition.y + 1
        break;
      case 1:
        nextPosition.x = nextPosition.x + 1
        break;
      case 2:
        nextPosition.y = nextPosition.y - 1
        break;
      case 3:
        nextPosition.x = nextPosition.x - 1
        break;
    }

    this.recordHistory(nextPosition)
  },

  recordHistory: function() {
    const key = JSON.stringify(this.position())
    const visitCount = this.visitCounts[key]


    this.visitCounts[key] = (visitCount || 0) + 1

    if (visitCount >= 1) {
      console.log('FOUND REVISIT ', this.position())
    }
  },

  takeSteps: function(steps) {
    for (var i = 0; i < steps; i++) {
      this.takeStep()
    }
  }
}

for (var i = 0; i < steps.length; i++) {
  let step = steps[i]

  let direction = step.substring(0,1)
  let stepCount = step.substring(1)

  santa.turn(direction)
  santa.takeSteps(parseInt(stepCount))
}

const distance = Math.abs(santa.position().x) + Math.abs(santa.position().y)
console.log(distance)

