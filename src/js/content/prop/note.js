content.prop.note = engine.prop.base.invent({
  name: 'note',
  onConstruct: function (options) {
    this.play(options).then(() => this.destroy())
  },
  play: function ({
    // TODO: Parameters
  } = {}) {
    // TODO: Duration
    const duration = 0

    const synth = engine.audio.synth.createFm({
      // TODO: Parameters
    }).connect(this.output)

    const now = engine.audio.time()

    // TODO: Automation

    synth.stop(now + duration)

    return engine.utility.timing.promise(duration * 1000)
  },
})
