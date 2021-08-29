content.wind = (() => {
  const angle = engine.utility.createNoiseWithOctaves({
    octaves: 8,
    seed: ['wind', 'angle'],
    type: engine.utility.simplex3d,
  })

  const strength = engine.utility.createNoiseWithOctaves({
    octaves: 8,
    seed: ['wind', 'strength'],
    type: engine.utility.simplex3d,
  })

  const scalePhysical = 100 / engine.utility.simplex2d.prototype.skewFactor,
    scaleTime = 10 / engine.utility.simplex2d.prototype.skewFactor

  content.utility.ephemera
    .manage(angle)
    .manage(strength)

  return {
    angle: (x, y) => {
      const time = content.time.value() / scaleTime

      x /= scalePhysical
      y /= scalePhysical

      const value = angle.value(x, y, time)

      return engine.utility.lerp(0, Math.PI*2, value)
    },
    strength: (x, y) => {
      const time = content.time.value() / scaleTime

      x /= scalePhysical
      y /= scalePhysical

      return strength.value(x, y, time)
    },
  }
})()
