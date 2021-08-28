content.generator = (() => {
  const chunks = [],
    chunkSize = 50,
    chunkTree = engine.utility.quadtree.create(),
    streamRadius = 4

  function createChunk(options) {
    const chunk = content.generator.chunk.create({
      count: content.generator.density.value(options.x, options.y),
      size: chunkSize,
      ...options,
    })

    chunks.push(chunk)
    chunkTree.insert(chunk)
  }

  function getChunk(x, y) {
    return chunkTree.find({x, y}, engine.const.zero)
  }

  function streamChunks() {
    const position = engine.position.getVector()

    const xi = Math.floor(position.x / chunkSize),
      yi = Math.floor(position.y / chunkSize)

    for (let x = xi - streamRadius; x <= xi + streamRadius; x += 1) {
      for (let y = yi - streamRadius; y <= yi + streamRadius; y += 1) {
        if (!getChunk(x, y)) {
          createChunk({x, y})
        }
      }
    }
  }

  return {
    chunks: () => [...chunks],
    reset: function () {
      for (const chunk of chunks) {
        chunk.destroy()
      }

      chunks.length = 0
      chunkTree.clear()

      return this
    },
    update: function () {
      streamChunks()

      return this
    },
  }
})()

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.generator.update()
})

engine.state.on('reset', () => content.generator.reset())
