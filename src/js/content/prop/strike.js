content.prop.strike = engine.prop.base.invent({
  name: 'strike',
  play: function ({
    frequency = 0,
    velocity = 0,
  } = {}) {
    const duration = engine.utility.lerp(1/8, 1, velocity)

    const synth = engine.audio.synth.createFm({
      carrierDetune: engine.utility.random.float(-10, 10),
      carrierFrequency: frequency,
      modDepth: frequency / 2,
      modDetune: engine.utility.random.float(150, 250),
      modFrequency: frequency * 3,
      modType: 'sawtooth',
    }).filtered({
      frequency: frequency * 6,
    }).connect(this.output)

    const now = engine.audio.time()

    synth.param.gain.linearRampToValueAtTime(1, now + duration/8)
    synth.param.gain.exponentialRampToValueAtTime(engine.const.zeroGain, now + duration)

    synth.stop(now + duration)

    return engine.utility.timing.promise(duration * 1000)
  },
})
