content.drone.synth = {}

content.drone.synth.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.drone.synth.prototype = {
  construct: function (prop) {
    // TODO: Create synth
    
    return this
  },
  destroy: function () {
    // TODO: Teardown synth

    return this
  },
}
