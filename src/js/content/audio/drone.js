content.audio.drone = (() => {
  const bus = content.audio.createBus(),
    maxNotes = 10,
    notes = [],
    synths = new Map()

  function bump(note) {
    const index = notes.indexOf(note),
      synth = synths.get(note)

    notes.splice(index, 1)
    notes.push(note)

    synth.bump()
  }

  function createSynth(note) {
    const synth = content.audio.drone.synth.create({
      destination: bus,
      note,
    })

    synths.set(note, synth)
  }

  function destroySynth(note) {
    const synth = synths.get(note)

    synth.destroy()
    synths.delete(note)
  }

  function push(note) {
    notes.push(note)
    createSynth(note)

    if (notes.length > maxNotes) {
      const destroy = notes.shift()
      destroySynth(destroy)
    }
  }

  return {
    push: function (note) {
      if (notes.includes(note)) {
        bump(note)
      } else {
        push(note)
      }

      return this
    },
    reset: function () {
      notes.length = 0

      for (const synth of synths) {
        synth.destroy()
      }

      synths.clear()

      return this
    },
  }
})()

engine.state.on('reset', () => content.audio.drone.reset())
