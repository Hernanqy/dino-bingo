document.addEventListener("DOMContentLoaded", function () {
    var startScreen = document.getElementById("startScreen");

    if (!startScreen) {
        return;
    }

    var buttons = startScreen.querySelectorAll("button");
    var startButton = null;

    buttons.forEach(function (button) {
        var text = button.textContent.toUpperCase();

        if (
            text.indexOf("COMENZAR") !== -1 ||
            text.indexOf("INICIAR") !== -1
        ) {
            startButton = button;
        }
    });

    if (!startButton && buttons.length > 0) {
        startButton = buttons[0];
    }

    if (startButton) {
        startButton.textContent = "COMENZAR";
        startScreen.appendChild(startButton);
    }
});
