content.audio.wind = (() => {
  const bus = content.audio.createBus()

  let binaural,
    synth

  bus.gain.value = engine.utility.fromDb(-9)

  function calculateFrequency(strength) {
    return engine.utility.lerpExp(20, 200, strength, 4)
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

    synth = engine.audio.synth.createBuffer({
      buffer: engine.audio.buffer.noise.brown(),
      gain: 1,
    }).filtered({
      frequency: calculateFrequency(strength),
    })

    binaural = engine.audio.binaural.create(
      calculatePan(angle)
    ).from(synth).to(bus)
  }

  function destroySynth() {
    if (synth) {
      synth.stop()
    }

    if (binaural) {
      binaural.destroy()
    }
  }

  function updateSynth() {
    const position = engine.position.getVector()

    const angle = content.wind.angle(position.x, position.y),
      strength = content.wind.strength(position.x, position.y)

    const frequency = calculateFrequency(strength),
      pan = calculatePan(angle)

    engine.audio.ramp.set(synth.filter.frequency, frequency)
    binaural.update(pan)
  }

  return {
    reset: function () {
      destroySynth()

      return this
    },
    update: function () {
      if (!synth) {
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
