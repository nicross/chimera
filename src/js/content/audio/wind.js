content.audio.wind = (() => {
  const bus = content.audio.createBus(),
    context = engine.audio.context(),
    synths = []

  const modDepthField = engine.utility.createNoiseWithOctaves({
    octaves: 4,
    seed: ['audio', 'wind', 'modDepth'],
    type: engine.utility.simplex3d,
  })

  const modFrequencyField = engine.utility.createNoiseWithOctaves({
    octaves: 4,
    seed: ['audio', 'wind', 'modFrequency'],
    type: engine.utility.simplex3d,
  })

  const physicalScale = 100 / engine.utility.simplex2d.prototype.skewFactor,
    timeScale = 2 / engine.utility.simplex2d.prototype.skewFactor

  let binaural,
    binauralSynth

  bus.gain.value = engine.utility.fromDb(-9)

  function calculateHighFrequency(strength) {
    return engine.utility.lerpExp(2000, 20000, strength, 0.25)
  }

  function calculateHighGain(strength) {
    return engine.utility.fromDb(engine.utility.lerp(-36, -27, strength))
  }

  function calculateLowFrequency(strength) {
    return engine.utility.lerpExp(20, 160, strength, 4)
  }

  function calculateQ(strength) {
    return engine.utility.lerpExp(20, 0.001, strength)
  }

  function calculatePan(angle) {
    return engine.utility.vector3d.create({
      x: Math.cos(angle),
      y: Math.sin(angle),
    }).rotateQuaternion(
      engine.position.getQuaternion().conjugate()
    ).scale(0.5)
  }

  function createSynth() {
    const position = engine.position.getVector()

    const angle = content.wind.angle(position.x, position.y),
      strength = content.wind.strength(position.x, position.y)

    binauralSynth = engine.audio.synth.createBuffer({
      buffer: engine.audio.buffer.noise.brown(),
      gain: 1,
    }).filtered({
      frequency: calculateLowFrequency(strength),
    })

    binaural = engine.audio.binaural.create(
      calculatePan(angle)
    ).from(binauralSynth).to(bus)

    const highFrequency = calculateHighFrequency(strength),
      highGain = calculateHighGain(strength),
      modDepth = getModDepth(),
      modFrequency = getModFrequency(),
      q = calculateQ(strength)

    for (const pan of [-1, 1]) {
      const synth = engine.audio.synth.createAmBuffer({
        buffer: engine.audio.buffer.noise.white(),
        carrierGain: 1 - modDepth,
        gain: highGain,
        modDepth: modDepth,
        modDetune: 100 * pan,
        modFrequency: modFrequency,
      }).filtered({
        frequency: highFrequency,
        Q: q,
      }).chainAssign('panner', context.createStereoPanner()).connect(bus)

      synth.panner.pan.value = pan

      synths.push(synth)
    }
  }

  function destroySynth() {
    if (binauralSynth) {
      binauralSynth.stop()
      binauralSynth = null
    }

    if (binaural) {
      binaural.destroy()
      binaural = null
    }

    for (const synth of synths) {
      synth.stop()
    }

    synths.length = 0
  }

  function getModDepth() {
    const {x, y} = engine.position.getVector()
    const time = content.time.value()
    const value = modDepthField.value(x / physicalScale, y / physicalScale, time / timeScale)

    return engine.utility.lerpExp(0, 1/3, value, 2)
  }

  function getModFrequency() {
    const {x, y} = engine.position.getVector()
    const time = content.time.value()
    const value = modFrequencyField.value(x / physicalScale, y / physicalScale, time / timeScale)

    return engine.utility.lerpExp(engine.const.zeroGain, 8, value, 4)
  }

  function updateSynth() {
    const position = engine.position.getVector()

    const angle = content.wind.angle(position.x, position.y),
      strength = content.wind.strength(position.x, position.y)

    const lowFrequency = calculateLowFrequency(strength),
      pan = calculatePan(angle)

    engine.audio.ramp.set(binauralSynth.filter.frequency, lowFrequency)
    binaural.update(pan)

    const highFrequency = calculateHighFrequency(strength),
      highGain = calculateHighGain(strength),
      modDepth = getModDepth(),
      modFrequency = getModFrequency(),
      q = calculateQ(strength)

    for (const synth of synths) {
      engine.audio.ramp.set(synth.filter.frequency, highFrequency)
      engine.audio.ramp.set(synth.filter.Q, q)
      engine.audio.ramp.set(synth.param.carrierGain, 1 - modDepth)
      engine.audio.ramp.set(synth.param.gain, highGain)
      engine.audio.ramp.set(synth.param.mod.depth, modDepth)
      engine.audio.ramp.set(synth.param.mod.frequency, modFrequency)
    }
  }

  return {
    reset: function () {
      destroySynth()

      return this
    },
    update: function () {
      if (!binaural) {
        createSynth()
      }

      updateSynth()

      return this
    },
  }
})()

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.audio.wind.update()
})

engine.state.on('reset', () => content.audio.wind.reset())
