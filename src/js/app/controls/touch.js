app.controls.touch = (() => {
  let touched = false

  window.addEventListener('touchend', onTouchend)
  window.addEventListener('touchstart', onTouchstart)

  function onTouchend() {
    touched = false
  }

  function onTouchstart() {
    touched = true
  }

  return {
    game: function () {
      return {}
    },
    ui: function () {
      const state = {}

      if (touched) {
        state.automove = true
      }

      return state
    },
  }
})()
