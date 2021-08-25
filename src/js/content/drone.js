content.drone = (() => {
  const synths = new Map()

  function getNotes() {
    // TODO: Get notes from spawned chunks

    return []
  }

  return {
    reset: function () {
      for (const synth of synths) {
        synth.destroy()
      }

      synths.clear()

      return this
    },
    update: function () {
      const notes = getNotes()

      const create = notes.filter((note) => !synths.has(note.token))

      for (const note of create) {
        const synth = this.synth.create(note)
        synths.set(note.token, synth)
      }

      const tokens = notes.map((note) => note.token)
      const destroy = [...synths.values()].filter((synth) => tokens.includes(synth.token))

      for (const synth of destroy) {
        synth.destroy()
        synths.delete(synth.token)
      }

      return this
    },
  }
})()

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.drone.update()
})

engine.state.on('reset', () => content.drone.reset())
