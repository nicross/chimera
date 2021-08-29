content.audio.drone.synth = {}

content.audio.drone.synth.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.audio.drone.synth.prototype = {
  duration: 16,
  construct: function ({
    chime,
    destination,
    note,
  }) {
    this.frequency = content.const.frequencies[note]
    this.note = note

    const modDepth = engine.utility.random.float(1/12, 1/4)

    this.synth = engine.audio.synth.createAm({
      carrierDetune: engine.utility.random.float(-10, 10),
      carrierFrequency: this.frequency,
      garrierGain: 1 - modDepth,
      modDepth,
      modFrequency: engine.utility.lerpExp(1/8, 8, Math.random(), 2),
      type: 'triangle',
    }).filtered({
      frequency: this.frequency * 2,
    }).connect(destination)

    const gain = this.calculateGain(chime),
      now = engine.audio.time()

    this.synth.param.gain.linearRampToValueAtTime(gain, now + 1/64)
    this.synth.param.gain.linearRampToValueAtTime(gain/4096, now + this.duration)

    this.lastStrikeGain = gain
    this.lastStrikeTime = content.time.value()

    return this
  },
  destroy: function () {
    const now = engine.audio.time()

    engine.audio.ramp.linear(this.synth.param.gain, engine.const.zeroGain, 1/4)
    this.synth.stop(now + 1/4)

    return this
  },
  calculateGain: function (chime) {
    const distance = engine.position.getVector().distance(chime),
      ratio = engine.utility.distanceToPower(distance / 10)

    if (!this.lastStrikeGain || !this.lastStrikeTime) {
      return ratio
    }

    const now = content.time.value()
    const currentGain = Math.max(0, 1 - ((now - this.lastStrikeTime) / this.duration)) * this.lastStrikeGain

    return Math.max(currentGain, ratio)
  },
  onStrike: function (chime) {
    const attack = 1/64,
      detune = engine.utility.random.float(-10, 10),
      gain = this.calculateGain(chime),
      modDepth = engine.utility.random.float(1/12, 1/4),
      modFrequency = engine.utility.lerpExp(1/8, 8, Math.random(), 2),
      now = engine.audio.time()

    engine.audio.ramp.linear(this.synth.param.carrierGain, 1 - modDepth, attack)
    engine.audio.ramp.linear(this.synth.param.detune, detune, attack)
    engine.audio.ramp.linear(this.synth.param.gain, gain, attack)
    engine.audio.ramp.linear(this.synth.param.mod.depth, modDepth, attack)
    engine.audio.ramp.linear(this.synth.param.mod.frequency, modFrequency, attack)

    engine.audio.ramp.linear(this.synth.param.gain, gain, 1/16)
    this.synth.param.gain.linearRampToValueAtTime(gain/4096, now + this.duration)

    this.lastStrikeGain = gain
    this.lastStrikeTime = content.time.value()

    return this
  },
}
