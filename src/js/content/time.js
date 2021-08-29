content.time = (() => {
  let time = 0

  return {
    increment: function (value) {
      time += value
      return this
    },
    reset: function () {
      time = 0
      return this
    },
    set: function (value) {
      time = value
      return this
    },
    value: () => time,
  }
})()

engine.loop.on('frame', ({delta, paused}) => {
  if (paused) {
    return
  }

  content.time.increment(delta)
})

engine.state.on('import', ({time}) => content.time.set(time))
engine.state.on('reset', () => content.time.reset())
