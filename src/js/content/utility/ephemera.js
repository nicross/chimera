content.utility.ephemera = (() => {
  const ephemera = [],
    interval = 60

  let timer

  resetTimer()

  function resetManaged() {
    for (const ephemeral of ephemera) {
      if (ephemeral.clear) {
        ephemeral.clear()
      } else if (ephemeral.reset) {
        ephemeral.reset()
      }
    }
  }

  function resetTimer() {
    timer = interval
  }

  return {
    manage: function (ephemeral) {
      if (!ephemeral || !ephemeral.clear || !ephemeral.reset) {
        return this
      }

      ephemera.push(ephemeral)

      return this
    },
    reset: function () {
      resetManaged()
      resetTimer()
      return this
    },
    update: function (delta) {
      timer -= delta

      if (timer <= 0) {
        this.reset()
      }

      return this
    },
  }
})()

engine.loop.on('frame', ({delta, paused}) => {
  if (paused) {
    return
  }

  content.utility.ephemera.update(delta)
})

engine.state.on('reset', () => content.utility.ephemera.reset())
