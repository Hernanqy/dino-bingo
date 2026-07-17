(function () {
    "use strict";

    var imagePath = "./public/dorso-tarjeta-prehistorica.jpg?v=14";

    function normalizar(texto) {
        return (texto || "")
            .replace(/["']/g, "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toUpperCase();
    }

    function encontrarTarjeta(elemento) {
        var actual = elemento;

        for (var i = 0; i < 6 && actual; i++) {
            var rect = actual.getBoundingClientRect();

            if (
                rect.width >= 45 &&
                rect.height >= 70 &&
                rect.height > rect.width * 1.08
            ) {
                return actual;
            }

            actual = actual.parentElement;
        }

        return elemento.parentElement || elemento;
    }

    function colocarImagen(tarjeta) {
        if (!tarjeta || tarjeta.dataset.dorsoJpg === "true") {
            return;
        }

        tarjeta.dataset.dorsoJpg = "true";
        tarjeta.classList.add("dorso-jpg-aplicado");

        tarjeta.style.setProperty(
            "background-image",
            'url("' + imagePath + '")',
            "important"
        );

        tarjeta.style.setProperty(
            "background-position",
            "center center",
            "important"
        );

        tarjeta.style.setProperty(
            "background-size",
            "cover",
            "important"
        );

        tarjeta.style.setProperty(
            "background-repeat",
            "no-repeat",
            "important"
        );

        tarjeta.style.setProperty(
            "background-color",
            "#0b2818",
            "important"
        );

        tarjeta.style.setProperty(
            "border",
            "none",
            "important"
        );

        tarjeta.style.setProperty(
            "color",
            "transparent",
            "important"
        );

        tarjeta.style.setProperty(
            "font-size",
            "0",
            "important"
        );
    }

    function aplicarDorsos() {
        var elementos = document.querySelectorAll("body *");

        elementos.forEach(function (elemento) {
            var textoPropio = "";

            if (elemento.children.length === 0) {
                textoPropio = normalizar(elemento.textContent);
            }

            var before = normalizar(
                getComputedStyle(elemento, "::before").content
            );

            var after = normalizar(
                getComputedStyle(elemento, "::after").content
            );

            var contieneFosil =
                textoPropio === "FOSIL" ||
                before === "FOSIL" ||
                after === "FOSIL";

            if (!contieneFosil) {
                return;
            }

            var tarjeta = encontrarTarjeta(elemento);

            colocarImagen(tarjeta);

            if (elemento !== tarjeta) {
                elemento.style.setProperty(
                    "display",
                    "none",
                    "important"
                );
            }
        });
    }

    var estilos = document.createElement("style");

    estilos.textContent = `
        .dorso-jpg-aplicado {
            background-image:
                url("./public/dorso-tarjeta-prehistorica.jpg?v=14")
                !important;

            background-position: center center !important;
            background-size: cover !important;
            background-repeat: no-repeat !important;

            color: transparent !important;
            font-size: 0 !important;

            border: none !important;
            border-radius: 7% !important;
            overflow: hidden !important;
        }

        .dorso-jpg-aplicado::before,
        .dorso-jpg-aplicado::after {
            display: none !important;
            content: none !important;
        }

        .dorso-jpg-aplicado > * {
            opacity: 0 !important;
            visibility: hidden !important;
        }
    `;

    document.head.appendChild(estilos);

    aplicarDorsos();

    new MutationObserver(aplicarDorsos).observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );

    window.setInterval(aplicarDorsos, 400);
})();
