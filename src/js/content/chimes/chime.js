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

    return this
  },
  onStrike: function () {
    this.lastStrike = content.time.value()

    return this
  },
}
