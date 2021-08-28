content.audio = (() => {
  const bus = engine.audio.mixer.createBus(),
    context = engine.audio.context()

  return {
    createBus: () => {
      const input = context.createGain()
      input.connect(bus)
      return input
    },
  }
})()
