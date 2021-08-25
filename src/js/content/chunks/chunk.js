content.chunks.chunk = {}

content.chunks.chunk.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.chunks.chunk.prototype = {
  construct: function () {
    // TODO: Generate notes within chunk

    return this
  },
}
