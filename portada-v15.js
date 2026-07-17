document.addEventListener("DOMContentLoaded", function () {
    var startScreen = document.getElementById("startScreen");

    if (!startScreen) {
        return;
    }

    var title = startScreen.querySelector(
        "h1, .main-title, .hero-title"
    );

    if (title) {
        title.textContent = "DINO BINGO";
    }
});
