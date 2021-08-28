content.const = {
  frequencies: [],
}

engine.const.midiReferenceFrequency = 432

for (let i = 0; i < 128; i += 1) {
  content.const.frequencies[i] = engine.utility.midiToFrequency(i)
}

engine.prop.base.fadeInDuration = engine.const.zeroTime
engine.prop.base.fadeOutDuration = engine.const.zeroTime
