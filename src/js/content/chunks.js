content.chunks = (() => {
  const chunks = engine.utility.quadtree.create()

  content.utility.ephemera.manage(chunks)

  return {
    reset: function () {
      chunks.clear()
      return this
    },
    update: function () {
      const position = engine.position.getVector()

      // TODO: Determine nearby chunks via position
      // TODO: Create nearby unspawned chunks

      return this
    },
  }
})()

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.chunks.update()
})

engine.state.on('reset', () => content.chunks.reset())
