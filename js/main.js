$(document).ready(function () {
    // Enter key binding in the input field
    $('#input').keypress(function (key) {
        if (key.which === 13) {
            console.log("ENTERED"); // placeholder
        }
    });

    $('#go').on('click', function (e) {
        console.log("ENTERED");
    });

    // Options button
    $('#options_button').on('click', function (e) {
        $('#options').fadeToggle(200);
        $('#input').focus();
    });
});
