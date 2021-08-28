content.chimes = (() => {
  const registry = engine.utility.quadtree.create()

  return {
    deregister: function (definition) {
      registry.remove(definition)
      return this
    },
    register: function (definition) {
      registry.insert(definition)
      return this
    },
    reset: function () {
      registry.clear()
      return this
    },
    retrieve: (...args) => registry.retrieve(...args),
  }
})()

engine.state.on('reset', () => content.chimes.reset())
