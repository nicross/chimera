app.screen.game.canvas = (() => {
  let context,
    height,
    root,
    width

  engine.ready(() => {
    root = document.querySelector('.a-game--canvas')
    context = root.getContext('2d')

    window.addEventListener('resize', onResize)
    onResize()

    content.powerups.on('apply', onPowerupsApply)
    content.train.on('add', onTrainAdd)
    content.train.on('remove', onTrainRemove)

    app.state.screen.on('enter-game', onEnter)
    app.state.screen.on('exit-game', onExit)
  })

  function clear() {
    context.clearRect(0, 0, width, height)
  }

  function draw() {

  }

  function onEnter() {
    clear()
    engine.loop.on('frame', onFrame)
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
    particles = []
  }

  function onFrame() {
    if (!app.settings.computed.graphicsOn) {
      return
    }

    updateParticles()
    draw()
  }

  function onResize() {
    height = root.height = root.clientHeight
    width = root.width = root.clientWidth
  }

  return {}
})()
