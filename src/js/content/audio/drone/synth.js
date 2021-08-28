content.audio.drone.synth = {}

content.audio.drone.synth.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.audio.drone.synth.prototype = {
  construct: function ({
    destination,
    note,
  }) {
    this.frequency = content.const.frequencies[note]
    this.note = note

    // TODO: Create synth

    return this
  },
  destroy: function () {
    // TODO: Teardown synth

    return this
  },
  bump: function () {
    // TODO: Randomize synth

    return this
  },
}
