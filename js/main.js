$(document).ready(function () {

	// placeholder
    console.log("JavaScript is still working. Maybe.");

    // Enter key binding in the input field
    $('#input').keypress(function (key) {
        if (key.which === 13) {
            console.log("ENTERED"); // placeholder
        }
    });

    // Options button
    $('#toggle_options').on('click', function (e) {
        $('#options').fadeToggle(200);
        $('#input').focus();
    });
});
