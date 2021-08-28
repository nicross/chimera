content.chimes.chime = {}

content.chimes.chime.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.chimes.chime.prototype = {
  construct: function ({
    notes = [],
    x = 0,
    y = 0,
    z = 0,
  } = {}) {
    this.swayFrequency = engine.utility.random.float(1/8, 1)
    this.swaySign = engine.utility.random.sign()

    this.notes = notes
    this.x = x
    this.y = y
    this.z = z

    return this
  },
  onStrike: function () {
    this.lastStrike = content.time.value()

    return this
  },
}
