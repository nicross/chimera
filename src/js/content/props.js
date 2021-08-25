content.props = (() => {
  return {
    update: function () {
      const length = engine.props.get().length

      // TODO: Return early if length is greater than maximum props
      // TODO: Roll whether a prop should spawn via wind
      // TODO: Select a random note to ring

      return this
    },
  }
})()

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.props.update()
})
