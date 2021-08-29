content.audio.drone = (() => {
  const bus = content.audio.createBus(),
    maxNotes = 16,
    notes = [],
    synths = new Map()

  const reverb = engine.audio.mixer.send.reverb.create({
    x: 0,
    y: 0,
    z: 1,
  }).from(bus)

  bus.gain.value = engine.utility.fromDb(-18)

  function bump(note, chime) {
    const index = notes.indexOf(note),
      synth = synths.get(note)

    notes.splice(index, 1)
    notes.push(note)

    synth.onStrike(chime)
  }

  function createSynth(note, chime) {
    const synth = content.audio.drone.synth.create({
      chime,
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

  function push(note, chime) {
    notes.push(note)
    createSynth(note, chime)

    if (notes.length > maxNotes) {
      const destroy = notes.shift()
      destroySynth(destroy)
    }
  }

  return {
    notes: () => notes,
    push: function ({
      chime,
      note,
    }) {
      if (notes.includes(note)) {
        bump(note, chime)
      } else {
        push(note, chime)
      }

      return this
    },
    reset: function () {
      notes.length = 0

      for (const synth of synths.values()) {
        synth.destroy()
      }

      synths.clear()

      return this
    },
  }
})()

engine.ready(() => {
  content.audio.strikes.on('strike', (...args) => content.audio.drone.push(...args))
})

engine.state.on('reset', () => content.audio.drone.reset())
