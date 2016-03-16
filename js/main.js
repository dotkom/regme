$(document).ready(function () {
    // Enter key binding in the input field
    $('#input').keypress(function (key) {
        if (key.which === 13) {
            console.log("ENTER"); // placeholder
        }
    });
});