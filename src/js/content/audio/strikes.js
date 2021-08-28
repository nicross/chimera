content.audio.strikes = (() => {
  const bus = content.audio.createBus(),
    maxProps = 8,
    pubsub = engine.utility.pubsub.create(),
    radius = 50

  function generateProp() {
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

    const chime = engine.utility.choose(chimes, Math.random())
      note = engine.utility.choose(chime.notes, Math.random())

    engine.props.create(content.prop.strike, {
      destination: bus,
      frequency: content.const.frequencies[note],
    })

    pubsub.emit('strike', note)
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

      const wind = content.wind.strength()

      const chance = engine.utility.lerp(1/12, 1, wind) / engine.performance.fps(),
        roll = Math.random()

      if (roll > chance) {
        return this
      }

      generateProp(wind)

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
