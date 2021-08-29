app.screen.game = (() => {
  let automove = false,
    root

  engine.ready(() => {
    root = document.querySelector('.a-game')
    app.utility.focus.trap(root)

    app.state.screen.on('enter-game', onEnter)
    app.state.screen.on('exit-game', onExit)
  })

  function handleControls() {
    const game = app.controls.game(),
      ui = app.controls.ui()

    if (ui.randomize) {
      engine.state.import({
        position: {
          x: 0,
          y: 0,
        },
        seed: new Date(),
        time: Math.random() * 60,
      })
    }

    if (ui.automove) {
      automove = !automove
    }

    if (automove) {
      game.y = 1
    }

    content.movement.update(game)
  }

  function onEnter() {
    app.utility.focus.set(root)
    engine.loop.on('frame', onFrame)

    engine.state.import({
      position: {
        x: 0,
        y: 0,
      },
      seed: app.const.defaultSeed,
      time: 0,
    })

    engine.loop.resume()
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
  }

  function onFrame({paused}) {
    if (paused) {
      return
    }

    handleControls()
  }

  return {}
})()
