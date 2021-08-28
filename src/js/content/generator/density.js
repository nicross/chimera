content.generator.density = (() => {
  const noise = engine.utility.createNoiseWithOctaves({
    octaves: 2,
    type: engine.utility.simplex2d,
  })

  const scale = 4 / engine.utility.simplex2d.prototype.skewFactor

  content.utility.ephemera.manage(noise)

  return {
    value: (x, y) => {
      const value = noise.value(x / scale, y / scale)

      return Math.round(
        engine.utility.lerp(4, 20, value)
      )
    },
  }
})()
