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

    this.synth = engine.audio.synth.createSimple({
      frequency: this.frequency,
    }).connect(destination)

    const now = engine.audio.time()

    this.synth.param.gain.linearRampToValueAtTime(1/8, now + 1/16)
    this.synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + 16)

    return this
  },
  destroy: function () {
    const now = engine.audio.time()

    engine.audio.ramp.linear(this.synth.param.gain, engine.const.zeroGain, 1/8)
    this.synth.stop(now + 1)

    return this
  },
  bump: function () {
    const now = engine.audio.time()
    
    engine.audio.ramp.linear(this.synth.param.gain, 1/8, 1/16)
    this.synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + 16)

    return this
  },
}
