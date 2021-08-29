content.audio.footsteps = (() => {
  const bus = content.audio.createBus(),
    strideLength = 2

  let isLeft,
    lastAngle,
    lastStep,
    lastVelocity

  bus.gain.value = engine.utility.fromDb(-12)

  function shouldStep() {
    // Complete stop
    if (lastVelocity && engine.position.getVelocity().isZero()) {
      return true
    }

    // Walking
    const distance = engine.utility.distance({
      ...lastStep,
      z: 0,
    }, {
      ...engine.position.getVector(),
      z: 0,
    })

    if (distance >= strideLength) {
      return true
    }

    // Turning
    const angle = engine.position.getEuler().yaw,
      difference = engine.utility.normalizeAngleSigned(angle - lastAngle)

    return !engine.utility.between(difference, -Math.PI/3, Math.PI/3)
  }

  function trigger() {
    const velocity = engine.utility.clamp(engine.position.getVelocity().distance() / 5, 0, 1)

    const modDepth = engine.utility.random.float(0, 1/2)

    const synth = engine.audio.synth.createAmBuffer({
      buffer: engine.audio.buffer.noise.white(),
      carrierGain: 1 - modDepth,
      modDepth: modDepth,
      modFrequency: engine.utility.random.float(4, 8),
    }).filtered({
      detune: engine.utility.random.float(-10, 10),
      frequency: engine.utility.lerp(150, 300, velocity),
    })

    const binaural = engine.audio.binaural.create({
      x: 0.25,
      y: (isLeft ? 1 : -1) * 0.5,
      z: -1,
    }).from(synth).to(bus)

    const now = engine.audio.time()

    synth.param.gain.linearRampToValueAtTime(1, now + 1/16)
    synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + 1/2)
    synth.stop(now + 1/2)

    setTimeout(() => {
      binaural.destroy()
    }, 500)
  }

  return {
    import: function () {
      lastStep = engine.position.getVector()

      return this
    },
    update: function () {
      if (shouldStep()) {
        trigger()

        isLeft = !isLeft
        lastAngle = engine.position.getEuler().yaw
        lastStep = engine.position.getVector()
        lastVelocity = engine.position.getVelocity().distance()
      }

      return this
    },
  }
})()

engine.loop.on('frame', () => content.audio.footsteps.update())
engine.state.on('import', () => content.audio.footsteps.import())
