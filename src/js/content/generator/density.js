content.generator.density = (() => {
  const noise = engine.utility.createNoiseWithOctaves({
    octaves: 2,
    type: engine.utility.simplex2d,
  })

  const scale = 200 / engine.utility.simplex2d.prototype.skewFactor

  content.utility.ephemera.manage(noise)

  return {
    value: (x, y) => noise.value(x / scale, y / scale),
  }
})()
