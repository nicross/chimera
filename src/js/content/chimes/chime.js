content.chimes.chime = {}

content.chimes.chime.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.chimes.chime.prototype = {
  construct: function ({
    notes = [],
    x = 0,
    y = 0,
  } = {}) {
    this.notes = notes
    this.x = x
    this.y = y

    this.lastStrike = 0

    return this
  },
  strike: function () {
    lastStrike = performance.now()

    return this
  },
}
