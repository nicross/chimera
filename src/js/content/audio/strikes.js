content.audio.strikes = (() => {
  const bus = content.audio.createBus(),
    maxProps = 12,
    pubsub = engine.utility.pubsub.create(),
    radius = 25

  function generateProp(windStrength) {
    const position = engine.position.getVector()

    const chimes = content.chimes.retrieve({
      height: radius * 2,
      width: radius * 2,
      x: position.x - radius,
      y: position.y - radius,
    })

    if (!chimes.length) {
      return
    }

    const chime = engine.utility.choose(chimes, Math.random()),
      note = engine.utility.choose(chime.notes, Math.random())

    const prop = engine.props.create(content.prop.strike, {
      destination: bus,
      x: chime.x,
      y: chime.y,
      z: chime.z,
    })

    prop.play({
      frequency: content.const.frequencies[note],
      velocity: windStrength * (Math.random() ** 0.5),
    }).then(() => {
      engine.props.destroy(prop)
    })

    chime.onStrike()

    pubsub.emit('strike', {
      chime,
      note,
    })
  }

  return engine.utility.pubsub.decorate({
    reset: function () {
      return this
    },
    update: function () {
      const count = engine.props.get().length

      if (count >= maxProps) {
        return this
      }

      const windStrength = content.wind.strength()

      const chance = engine.utility.lerpExp(1/16, 8, windStrength, 2) / engine.performance.fps(),
        roll = Math.random()

      if (roll < chance) {
        generateProp(windStrength)
      }

      return this
    },
  }, pubsub)
})()

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.audio.strikes.update()
})

engine.state.on('reset', () => content.audio.strikes.reset())
