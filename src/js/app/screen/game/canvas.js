app.screen.game.canvas = (() => {
  const drawDistance = 200,
    vfov = engine.utility.degreesToRadians(75) * (9/16)

  let analogPhase,
    analogSide,
    analogSign,
    chimeWidth,
    context,
    height,
    hfov,
    rotatePhase,
    rotateSign,
    root,
    width

  engine.ready(() => {
    root = document.querySelector('.a-game--canvas')
    context = root.getContext('2d')

    window.addEventListener('resize', onResize)
    onResize()

    app.state.screen.on('enter-game', onEnter)
    app.state.screen.on('exit-game', onExit)
    engine.state.on('import', onImport)
  })

  function calculateColors(time) {
    const analog = analogSide * engine.utility.scale(Math.cos(analogSign * Math.PI * (time + analogPhase) * (1 / 41)), -1, 1, 15, 45),
      contrast = engine.utility.scale(Math.cos(Math.PI * time * (1 / 59)), -1, 1, 0, 0.5),
      rotate = engine.utility.scale(Math.cos(rotateSign * Math.PI * (time + rotatePhase) * (1 / 311)), -1, 1, 0, 360)

    return {
      background: {
        h: rotate,
        s: 1,
        l: 0.5 - contrast,
      },
      foreground: {
        h: analog + rotate,
        s: 1,
        l: 0.5 + contrast,
      },
    }
  }

  function clear() {
    context.clearRect(0, 0, width, height)
  }

  function draw() {
    const heading = engine.utility.vector3d.unitX().rotateQuaternion(engine.position.getQuaternion().conjugate()),
      now = content.time.value(),
      position = engine.position.getVector(),
      rotate = Math.atan2(heading.y, heading.x)

    const chimes = content.chimes.retrieve({
      height: drawDistance * 2,
      width: drawDistance * 2,
      x: position.x - drawDistance,
      y: position.y - drawDistance,
    })

    const {
      background,
      foreground,
    } = calculateColors(now)

    // Fill background
    context.fillStyle = `hsl(${background.h}, ${background.s * 100}%,  ${background.l * 100}%)`
    context.fillRect(0, 0, width, height)

    // Set foreground color
    context.fillStyle = `hsl(${foreground.h}, ${foreground.s * 100}%,  ${foreground.l * 100}%)`

    for (const chime of chimes) {
      // Convert to relative space, adding sway
      const relative = engine.utility.vector2d.create({
        x: chime.x - position.x + (Math.cos(Math.PI * chime.swayFrequency * chime.swaySign * now) / 32),
        y: chime.y - position.y + (Math.sin(Math.PI * chime.swayFrequency * chime.swaySign * now) / 32),
      }).rotate(rotate)

      // Filter out chimes behind field of view
      if (relative.x <= 0) {
        continue
      }

      // Calculate distance
      const distance = relative.distance()

      // Filter out nodes beyond draw distance
      if (distance > drawDistance) {
        continue
      }

      // Calculate horizontal position
      const hangle = Math.atan2(relative.y, relative.x)

      // Filter out chimes beyond horizontal field of view (with leeway)
      if (Math.abs(hangle) > hfov / 1.75) {
        continue
      }

      // Calculate width
      let drawWidth = engine.utility.lerpExp(0, chimeWidth, 1 - (distance / drawDistance), 8)

      if (chime.lastStrike) {
        const delta = now - chime.lastStrike

        if (delta < 1/16) {
          drawWidth *= engine.utility.scale(delta, 0, 1/16, 1, 4)
        } else if (delta < 1) {
          drawWidth *= engine.utility.scale(delta, 1/16, 1, 4, 1)
        }
      }

      // Draw
      const x = (width / 2) - (width * hangle / hfov) - (drawWidth / 2)
      context.fillRect(x, 0, drawWidth, height)
    }
  }

  function onEnter() {
    clear()
    engine.loop.on('frame', onFrame)
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
  }

  function onFrame() {
    draw()
  }

  function onImport() {
    const srand = engine.utility.srand('canvas')

    analogPhase = srand(0, 41)
    analogSide = engine.utility.sign(srand(-1, 1))
    analogSign = engine.utility.sign(srand(-1, 1))
    rotatePhase = srand(0, 311)
    rotateSign = engine.utility.sign(srand(-1, 1))
  }

  function onResize() {
    height = root.height = root.clientHeight
    width = root.width = root.clientWidth
    hfov = vfov * (height / width)

    chimeWidth = 32 * (width / 1920)
  }

  return {}
})()
