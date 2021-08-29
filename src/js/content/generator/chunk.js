content.generator.chunk = {}

content.generator.chunk.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.generator.chunk.prototype = {
  construct: function ({
    count = 0,
    size = 0,
    x = 0,
    y = 0,
  } = {}) {
    this.count = count
    this.size = size
    this.x = x
    this.y = y

    this.generate()

    return this
  },
  destroy: function () {
    for (const chime of this.chimes) {
      content.chimes.deregister(chime)
    }

    return this
  },
  generate: function () {
    this.chimes = []

    for (let i = 0; i < this.count; i += 1) {
      const srand = engine.utility.srand('chunk', this.x, this.y, 'chime', i)

      const x = (this.x * this.size) + (srand(0, this.size)),
        y = (this.y * this.size) + (srand(0, this.size))

      const chime = content.chimes.chime.create({
        notes: content.generator.chord.value(x, y),
        x,
        y,
        z: srand(1, 3),
      })

      this.chimes.push(chime)
      content.chimes.register(chime)
    }

    return this
  }
}
