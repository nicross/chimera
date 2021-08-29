content.generator.chord = (() => {
  const chordField = engine.utility.createNoiseWithOctaves({
    octaves: 4,
    seed: ['generator', 'chord', 'note'],
    type: engine.utility.simplex2d,
  })

  const inversionField = engine.utility.createNoiseWithOctaves({
    octaves: 4,
    seed: ['generator', 'chord', 'note'],
    type: engine.utility.simplex3d,
  })

  const chordScale = 1000 / engine.utility.simplex2d.prototype.skewFactor,
    inversionScale = 100 / engine.utility.simplex2d.prototype.skewFactor

  const chordIntervals = [0, 2, 4, 6, 8, 10],
    chordNotes = [-12, -10, -8, -7, -5, -3, -1, 0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24],
    chordRoots = [-12, -10, -8, -7, -5, -3, -1, 0, 2, 4, 5, 7]

  let chords = [],
    root

  content.utility.ephemera
    .manage(chordField)
    .manage(inversionField)

  function generateChords() {
    const srand = engine.utility.srand('generator', 'chord', 'chords')
    const count = Math.round(srand(6, 12))

    chords.length = 0

    for (let i = 0; i < count; i += 1) {
      let chord = []

      const chordRoot = engine.utility.choose(chordRoots, srand()),
        index = chordNotes.indexOf(chordRoot)

      while (chord.length < 3) {
        chord.length = 0

        for (let j = 0; j < chordIntervals.length; j += 1) {
          const chance = engine.utility.scale(j, 0, chordIntervals.length, 3/4, 1/3)

          if (srand() < chance) {
            const interval = chordIntervals[j]
            const note = root + chordNotes[index + interval]

            chord.push(note)
          }
        }
      }

      chords.push(chord)
    }
  }

  function generateRoot() {
    const srand = engine.utility.srand('generator', 'chord', 'root')
    root = Math.round(srand(60, 72))
  }

  return {
    chords: () => chords,
    import: function () {
      generateRoot()
      generateChords()

      return this
    },
    value: (x, y) => {
      const chordValue = engine.utility.wrapAlternate(chordField.value(x / chordScale, y / chordScale) * 3, 0, 1)

      const chord = engine.utility.choose(chords, chordValue).map((note, index) => {
        const inversionValue = inversionField.value(x / inversionScale, y / inversionField, index)
        return note + engine.utility.choose([-1, 0, 1], inversionValue)
      })

      return chord
    },
  }
})()

engine.state.on('import', () => content.generator.chord.import())
