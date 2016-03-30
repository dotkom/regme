$(document).ready(function () {
  // Enter key binding in the input field
  $('#input').keypress(function (key) {
    if (key.which === 13) {
      console.log('ENTER') // placeholder
    }
  })

  // Temperorary
  // TODO: Move functionality to react.jsx
  $('#options_button').on('click', function (e) {
    $('#options').fadeToggle(200)
    $('#input').focus()
  })
})